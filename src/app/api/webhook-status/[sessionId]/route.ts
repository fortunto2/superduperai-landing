import { NextRequest, NextResponse } from 'next/server';
import { getWebhookStatusWithFallback, updateWebhookStatusWithFallback, type WebhookStatusData } from '@/lib/webhook-status-store';
import { getPrompt } from '@/lib/kv';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const status = await getWebhookStatusWithFallback(sessionId);
    
    if (!status) {
      return NextResponse.json({ 
        status: 'pending',
        message: 'Webhook processing not yet started'
      });
    }

    // Try to get the full prompt if it was a long prompt
    let fullPrompt = null;
    try {
      fullPrompt = await getPrompt(sessionId);
    } catch (error) {
      console.warn('⚠️ Failed to get prompt from KV:', error);
    }

    return NextResponse.json({
      ...status,
      prompt: fullPrompt // Include full prompt if available
    });
  } catch (error) {
    console.error('Error getting webhook status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const data: WebhookStatusData = await request.json();

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Update status in store
    await updateWebhookStatusWithFallback(sessionId, {
      ...data,
      timestamp: new Date().toISOString()
    });

    console.log(`📊 Webhook status updated for ${sessionId}:`, data);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating webhook status:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook status' },
      { status: 500 }
    );
  }
} 