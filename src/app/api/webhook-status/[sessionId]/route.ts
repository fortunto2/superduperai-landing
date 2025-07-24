import { NextRequest, NextResponse } from 'next/server';
import { getSessionData, updateSessionData } from '@/lib/kv';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const sessionData = await getSessionData(sessionId);
    
    if (!sessionData) {
      return NextResponse.json({ 
        status: 'pending',
        message: 'Session not found or processing not yet started'
      });
    }

    console.log('📊 Retrieved session data for API:', sessionId, sessionData.status);

    // Return session data in format expected by frontend
    return NextResponse.json({
      status: sessionData.status,
      fileId: sessionData.fileId,
      error: sessionData.error,
      toolSlug: sessionData.toolSlug,
      toolTitle: sessionData.toolTitle,
      prompt: sessionData.prompt,
      timestamp: sessionData.createdAt
    });
  } catch (error) {
    console.error('Error getting session data:', error);
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
    const updates = await request.json();

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Update session data
    await updateSessionData(sessionId, updates);

    console.log(`📊 Session data updated for ${sessionId}:`, updates);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating session data:', error);
    return NextResponse.json(
      { error: 'Failed to update session data' },
      { status: 500 }
    );
  }
} 