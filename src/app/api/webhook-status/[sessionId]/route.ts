import { NextRequest, NextResponse } from 'next/server';

interface WebhookStatusData {
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;
  error?: string;
  timestamp?: string;
}

// In-memory storage for webhook status (in production, use Redis or database)
const webhookStatusStore = new Map<string, WebhookStatusData>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get status from store
    const status = webhookStatusStore.get(sessionId) || { status: 'pending' as const };

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking webhook status:', error);
    return NextResponse.json(
      { error: 'Failed to check webhook status' },
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

// Export the webhook status store for use in webhook handler
export { webhookStatusStore }; 