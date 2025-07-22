import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storePrompt } from '@/lib/kv';

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

    // Handle prompts (store all in KV for analytics, use short reference in Stripe metadata)
    const promptToStore = prompt || '';
    const isLongPrompt = promptToStore.length > 400; // Leave some buffer for Stripe metadata
    
    let metadataPrompt = '';
    if (isLongPrompt) {
      // Store full prompt in KV and use short reference in metadata
      metadataPrompt = `[PROMPT:${promptToStore.length}chars]`;
      console.log('📝 Long prompt detected, storing in KV:', promptToStore.length, 'chars');
    } else {
      // For short prompts, still store in KV but use prompt in metadata too
      metadataPrompt = promptToStore;
      console.log('📝 Short prompt, storing in KV for analytics:', promptToStore.length, 'chars');
    }

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
        prompt: metadataPrompt,
        video_count: quantity.toString(),
        duration: '8',
        resolution: '1280x720',
        style: 'cinematic',
        toolSlug: toolSlug || '',
        toolTitle: toolTitle || '',
        hasLongPrompt: isLongPrompt.toString(),
      },
    });

    // Store all prompts in KV for analytics
    try {
      await storePrompt(session.id, promptToStore);
      console.log('💾 Prompt stored in KV for analytics:', session.id, `(${promptToStore.length} chars)`);
    } catch (error) {
      console.error('❌ Failed to store prompt in KV:', error);
      // Continue anyway - we'll try to get prompt from metadata
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