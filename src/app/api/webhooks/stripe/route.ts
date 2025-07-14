import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error('❌ Stripe webhook signature verification failed:', error);
    console.error('Expected secret:', endpointSecret?.substring(0, 10) + '...');
    console.error('Signature:', signature?.substring(0, 50) + '...');
    
    // В режиме разработки показываем больше информации
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('🔔 Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Stripe webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout completed:', session.id);
  
  // Extract metadata from checkout session
  const { 
    prompt, 
    video_count, 
    customer_email,
    duration = '5',
    resolution = '1280x720',
    style = 'cinematic',
    generation_id
  } = session.metadata || {};

  if (!prompt || !video_count) {
    console.error('❌ Missing required metadata in checkout session:', session.id);
    return;
  }

  try {
    // Start VEO3 generation
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-veo3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        sessionId: session.id,
        generationId: generation_id,
        videoCount: parseInt(video_count),
        customerEmail: customer_email || session.customer_details?.email,
        duration: parseInt(duration),
        resolution,
        style,
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation API failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('🎬 VEO3 generation started:', result);

    // TODO: Send email notification to customer with generation status link
    const email = customer_email || session.customer_details?.email;
    if (email) {
      console.log('📧 TODO: Send email to', email, 'with generation ID:', result.generationId);
    }

  } catch (error) {
    console.error('❌ Failed to start VEO3 generation:', error);
    
    // TODO: Send error notification to customer
    const email = customer_email || session.customer_details?.email;
    if (email) {
      console.log('📧 TODO: Send error email to', email);
    }
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);
  
  // Extract metadata from payment intent
  const { 
    prompt, 
    video_count, 
    customer_email,
    duration = '5',
    resolution = '1280x720',
    style = 'cinematic',
    generation_id
  } = paymentIntent.metadata;

  if (!prompt || !video_count) {
    console.error('❌ Missing required metadata in payment intent:', paymentIntent.id);
    return;
  }

  try {
    // Start VEO3 generation
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-veo3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        paymentIntentId: paymentIntent.id,
        generationId: generation_id,
        videoCount: parseInt(video_count),
        customerEmail: customer_email,
        duration: parseInt(duration),
        resolution,
        style,
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation API failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('🎬 VEO3 generation started:', result);

    // TODO: Send email notification to customer with generation status link
    if (customer_email) {
      console.log('📧 TODO: Send email to', customer_email, 'with generation ID:', result.generationId);
    }

  } catch (error) {
    console.error('❌ Failed to start VEO3 generation:', error);
    
    // TODO: Send error notification to customer
    if (customer_email) {
      console.log('📧 TODO: Send error email to', customer_email);
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  const { customer_email } = paymentIntent.metadata;
  
  // TODO: Send payment failure notification
  if (customer_email) {
    console.log('📧 TODO: Send payment failure email to', customer_email);
  }
} 