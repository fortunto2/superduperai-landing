import { NextRequest, NextResponse } from 'next/server';
import { webhookStatusStore } from '@/lib/webhook-status-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const status = webhookStatusStore.get(sessionId);
    
    if (!status) {
      return NextResponse.json({ 
        status: 'pending',
        message: 'Webhook processing not yet started'
      });
    }

    return NextResponse.json(status);
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
    webhookStatusStore.set(sessionId, {
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