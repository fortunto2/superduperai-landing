import { NextRequest, NextResponse } from 'next/server';
import { getWebhookStatusWithFallback } from '@/lib/webhook-status-store';
import { getPrompt } from '@/lib/kv';

// Development-only API for testing
export async function GET(request: NextRequest) {
  // Only allow in development or test environments
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL?.includes('git-stripe')) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (sessionId) {
      // Get specific session data
      const webhookData = await getWebhookStatusWithFallback(sessionId);
      const prompt = await getPrompt(sessionId);
      
      return NextResponse.json({
        sessionId,
        webhookData,
        prompt: prompt ? { length: prompt.length, preview: prompt.substring(0, 100) } : null
      });
    }
    
    // Get all webhook sessions (this would need to be implemented with Redis keys)
    // For now, return a message that this needs Redis keys listing
    return NextResponse.json({
      message: 'Use sessionId parameter to get specific session data',
      example: '/api/dev/files?sessionId=cs_test_xxx'
    });
    
  } catch (error) {
    console.error('❌ Error getting dev files:', error);
    return NextResponse.json(
      { error: 'Failed to get dev files' },
      { status: 500 }
    );
  }
} 