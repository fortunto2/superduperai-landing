import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { CURRENT_PRICES } from '@/lib/stripe-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Create initial generation file
async function createInitialGenerationFile(generationId: string, prompt: string, videoCount: number) {
  const storageDir = join(process.cwd(), '.veo3-generations');
  const filePath = join(storageDir, `${generationId}.json`);
  
  const initialData = {
    generationId,
    prompt,
    videoCount,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString(),
    videos: Array.from({ length: videoCount }, (_, i) => ({
      fileId: `pending_${i}`,
      status: 'pending',
    })),
  };

  try {
    // Ensure directory exists
    await writeFile(join(storageDir, '.gitkeep'), '');
    await writeFile(filePath, JSON.stringify(initialData, null, 2));
    console.log('✅ Created initial generation file:', filePath);
  } catch (error) {
    console.error('❌ Failed to create initial generation file:', error);
    // Don't throw error, just log it
  }
}

const checkoutSchema = z.object({
  priceId: z.string().refine(
    (priceId) => Object.values(CURRENT_PRICES).includes(priceId),
    'Invalid price ID for current environment'
  ),
  prompt: z.string().min(1, 'Prompt is required'),
  videoCount: z.number().int().min(1).max(3),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Generate unique generation ID
    const generationId = `veo3_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Create checkout session with metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: validatedData.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: validatedData.successUrl.replace('{CHECKOUT_SESSION_ID}', generationId),
      cancel_url: validatedData.cancelUrl,
      customer_email: validatedData.customerEmail,
      metadata: {
        prompt: validatedData.prompt,
        video_count: validatedData.videoCount.toString(),
        customer_email: validatedData.customerEmail || '',
        duration: '5', // Default duration
        resolution: '1280x720', // Default resolution
        style: 'cinematic', // Default style
        generation_id: generationId,
      },
      payment_intent_data: {
        metadata: {
          prompt: validatedData.prompt,
          video_count: validatedData.videoCount.toString(),
          customer_email: validatedData.customerEmail || '',
          duration: '5',
          resolution: '1280x720',
          style: 'cinematic',
          generation_id: generationId,
        },
      },
    });

    // Create initial generation file so status page works immediately
    await createInitialGenerationFile(generationId, validatedData.prompt, validatedData.videoCount);

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      generationId 
    });

  } catch (error) {
    console.error('❌ Checkout creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 