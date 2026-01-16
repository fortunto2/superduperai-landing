import { NextResponse } from 'next/server';
import { CURRENT_PRICES } from '@/lib/stripe-config';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      prices: CURRENT_PRICES,
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'test',
    });
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
} 