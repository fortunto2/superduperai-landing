import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storeSessionData, type SessionData } from '@/lib/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, quantity = 1, prompt, toolSlug, toolTitle } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get the app URL with proper fallback
    const getAppUrl = () => {
      // First try NEXT_PUBLIC_APP_URL (manually set)
      if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
      }
      
      // Then try VERCEL_URL (automatically set by Vercel)
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      
      // Finally fallback to localhost for development
      return 'http://localhost:3000';
    };

    const appUrl = getAppUrl();
    console.log('🔗 Using app URL:', appUrl);

    // Store everything in Redis, keep Stripe metadata minimal
    const sessionData: SessionData = {
      prompt: prompt || '',
      videoCount: quantity,
      duration: 8,
      resolution: '1280x720',
      style: 'cinematic',
      toolSlug: toolSlug || 'veo3-prompt-generator',
      toolTitle: toolTitle || 'Free VEO3 Viral Prompt Generator',
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };

    console.log('💾 Storing session data in Redis:', sessionData.prompt.length, 'chars');

    // Minimal Stripe metadata - only essential info
    const metadata = {
      video_count: quantity.toString(),
      tool: 'veo3-generator'
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/en/payment-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/en/tool/veo3-prompt-generator`,
      metadata,
    });

    // Store complete session data in Redis
    try {
      await storeSessionData(session.id, sessionData);
      console.log('💾 Session data stored in Redis:', session.id);
    } catch (error) {
      console.error('❌ Failed to store session data in Redis:', error);
      // This is critical - if we can't store session data, webhook will fail
      throw new Error('Failed to store session data');
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 