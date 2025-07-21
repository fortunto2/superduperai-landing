import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, quantity = 1, prompt } = await request.json();

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
      metadata: {
        videoCount: quantity.toString(),
        prompt: prompt || '',
        video_count: quantity.toString(),
        duration: '8',
        resolution: '1280x720',
        style: 'cinematic',
      },
    });

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