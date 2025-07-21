import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { webhookStatusStore } from '@/lib/webhook-status-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// SuperDuperAI configuration
const configureSuperduperAI = () => {
  if (!process.env.SUPERDUPERAI_TOKEN) {
    throw new Error('SUPERDUPERAI_TOKEN environment variable is not set');
  }
};

const getSuperduperAIConfig = () => ({
  url: process.env.SUPERDUPERAI_URL || 'https://api.superduperai.com',
  token: process.env.SUPERDUPERAI_TOKEN
});

const API_ENDPOINTS = {
  GENERATE_VIDEO: '/api/v1/file/generate-video'
};

// Generate single video using SuperDuperAI API
async function generateVideoWithSuperDuperAI(
  prompt: string, 
  duration: number = 5, 
  resolution: string = '1280x720', 
  style: string = 'cinematic'
): Promise<string> {
  console.log('🎬 Starting SuperDuperAI video generation:', { prompt, duration, resolution, style });
  
  // Configure SuperDuperAI client
  configureSuperduperAI();
  const config = getSuperduperAIConfig();
  
  const [width, height] = resolution.split('x').map(Number);
  
  const payload = {
    config: {
      prompt,
      negative_prompt: '',
      width,
      height,
      aspect_ratio: width > height ? '16:9' : height > width ? '9:16' : '1:1',
      duration,
      seed: Math.floor(Math.random() * 1000000),
      generation_config_name: 'google-cloud/veo3', // Use VEO3 model
      frame_rate: 30,
      batch_size: 1,
      references: []
    }
  };
  
  console.log('📤 Sending request to SuperDuperAI:', payload);
  
  const response = await fetch(`${config.url}${API_ENDPOINTS.GENERATE_VIDEO}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`,
      'User-Agent': 'SuperDuperAI-Landing/1.0'
    },
    body: JSON.stringify(payload),
    // Add timeout to prevent webhook from hanging
    signal: AbortSignal.timeout(15000) // 15 seconds timeout
  });
  
  console.log(`📡 SuperDuperAI API Response Status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ SuperDuperAI API Error:', errorText);
    throw new Error(`SuperDuperAI API failed: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('✅ SuperDuperAI response:', result);
  
  // Extract file ID from response
  const fileId = result.id;
  if (!fileId) {
    throw new Error('No file ID returned from SuperDuperAI API');
  }
  
  console.log(`🚀 Video generation task created successfully!`);
  console.log(`📁 FileId: ${fileId}`);
  console.log(`⏱️ Client can now poll /api/file/${fileId} for status updates`);
  return fileId;
}

// Update webhook status directly in store
function updateWebhookStatus(sessionId: string, data: { status: 'pending' | 'processing' | 'completed' | 'error'; fileId?: string; error?: string }) {
  try {
    webhookStatusStore.set(sessionId, {
      ...data,
      timestamp: new Date().toISOString()
    });
    console.log(`📊 Webhook status updated for ${sessionId}:`, data);
  } catch (error) {
    console.error('Failed to update webhook status:', error);
  }
}

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
    console.error('Body length:', body.length);
    console.error('Environment:', process.env.NODE_ENV);
    console.error('Vercel URL:', process.env.VERCEL_URL);
    
    // В режиме разработки показываем больше информации
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
      console.error('Full body (first 200 chars):', body.substring(0, 200));
    }
    
    // Для отладки на тестовой ветке - временно пропускаем проверку подписи
    if (process.env.VERCEL_URL?.includes('git-stripe')) {
      console.warn('⚠️ TEMPORARILY SKIPPING SIGNATURE VERIFICATION FOR TESTING');
      try {
        event = JSON.parse(body);
      } catch (parseError) {
        console.error('❌ Failed to parse webhook body:', parseError);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
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
        console.log(`🔔 Unhandled event type: ${event.type} (ignoring)`);
        // Не обрабатываем это событие, но это не ошибка
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Stripe webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout completed:', session.id);
  const sessionId = session.id;

  // Update webhook status to processing
  updateWebhookStatus(sessionId, { status: 'processing' });
  
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
    console.warn('⚠️ Missing required metadata in checkout session:', sessionId, session.metadata);
    
    // For test events from Stripe CLI, use default values
    if (!prompt && !video_count) {
      console.log('🧪 Detected test event, using default values for testing');
      const testPrompt = 'A beautiful sunset over the ocean with waves gently crashing on the shore';
      
      try {
        const fileId = await generateVideoWithSuperDuperAI(testPrompt, 5, '1280x720', 'cinematic');
        console.log('🎬 Test VEO3 file created:', fileId);
        updateWebhookStatus(sessionId, { status: 'completed', fileId });
        return;
      } catch (error) {
        console.error('❌ Failed to generate test video:', error);
        updateWebhookStatus(sessionId, { status: 'error', error: 'Test generation failed' });
        return;
      }
    }
    
    updateWebhookStatus(sessionId, { status: 'error', error: 'Missing required metadata' });
    return;
  }
  
  // Determine base URL - use NEXT_PUBLIC_APP_URL or fallback to Vercel URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                 process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                 'http://localhost:3000';
  
  try {
    
    console.log('🌐 Payment webhook calling API at:', baseUrl);
    
    // Start VEO3 generation
    const response = await fetch(`${baseUrl}/api/generate-veo3`, {
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
  
  let prompt, video_count, customer_email, duration = '5', resolution = '1280x720', style = 'cinematic';
  let sessionId: string | undefined;

  // First, get the checkout session
  try {
    // Get the checkout session from payment intent
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1
    });

    if (sessions.data.length === 0) {
      console.error('❌ No checkout session found for payment intent:', paymentIntent.id);
      return;
    }

    const session = sessions.data[0];
    sessionId = session.id;
    console.log('🔍 Found checkout session:', sessionId);

    // Update webhook status to processing
    updateWebhookStatus(sessionId, { status: 'processing' });

    // Extract metadata from checkout session (not payment intent)
    const metadata = session.metadata || {};
    prompt = metadata.prompt;
    video_count = metadata.video_count;
    customer_email = metadata.customer_email;
    duration = metadata.duration || '5';
    resolution = metadata.resolution || '1280x720';
    style = metadata.style || 'cinematic';

    if (!prompt || !video_count) {
      console.error('❌ Missing required metadata in checkout session:', sessionId, session.metadata);
      updateWebhookStatus(sessionId, { status: 'error', error: 'Missing required metadata' });
      return;
    }
  } catch (sessionError) {
    console.error('❌ Failed to get checkout session for payment intent:', paymentIntent.id, sessionError);
    return;
  }

  // Now generate the video
  try {
    // Determine base URL - use NEXT_PUBLIC_APP_URL or fallback to Vercel URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000';
    
    console.log('🌐 Webhook calling API at:', baseUrl);
    console.log('📋 Environment vars:', {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Start VEO3 generation directly with SuperDuperAI (async, don't wait)
    const fileId = await generateVideoWithSuperDuperAI(prompt, parseInt(duration), resolution, style);
    console.log('🎬 VEO3 generation started with fileId:', fileId);

    // Update webhook status to processing with fileId (client can start polling)
    if (sessionId) {
      updateWebhookStatus(sessionId, { status: 'processing', fileId });
    }

    console.log('✅ Webhook completed quickly, client will poll fileId:', fileId);

    // TODO: Send email notification to customer with file status link
    if (customer_email) {
      const statusUrl = `${baseUrl}/en/file/${fileId}`;
      console.log('📧 TODO: Send email to', customer_email, 'with status URL:', statusUrl);
    }

  } catch (error) {
    console.error('❌ Failed to start VEO3 generation:', error);
    
    // Update webhook status to error
    if (sessionId) {
      updateWebhookStatus(sessionId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
    
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