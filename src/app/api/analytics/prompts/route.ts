import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get all prompt keys
    const promptKeys = await kv.keys('prompt:*');
    
    // Get prompts with pagination
    const paginatedKeys = promptKeys.slice(offset, offset + limit);
    const prompts = [];
    
    for (const key of paginatedKeys) {
      try {
        const data = await kv.get<{ prompt: string; timestamp: string }>(key);
        if (data) {
          const sessionId = key.replace('prompt:', '');
          prompts.push({
            sessionId,
            prompt: data.prompt,
            length: data.prompt.length,
            timestamp: data.timestamp
          });
        }
      } catch (error) {
        console.warn('⚠️ Failed to get prompt data for key:', key, error);
      }
    }
    
    // Calculate statistics
    const totalPrompts = promptKeys.length;
    const totalCharacters = prompts.reduce((sum, p) => sum + p.length, 0);
    const avgLength = totalPrompts > 0 ? Math.round(totalCharacters / totalPrompts) : 0;
    
    // Find longest and shortest prompts
    const longestPrompt = prompts.reduce((max, p) => p.length > max.length ? p : max, { length: 0 });
    const shortestPrompt = prompts.reduce((min, p) => p.length < min.length ? p : min, { length: Infinity });
    
    return NextResponse.json({
      statistics: {
        totalPrompts,
        totalCharacters,
        averageLength: avgLength,
        longestPrompt: longestPrompt.length > 0 ? {
          sessionId: longestPrompt.sessionId,
          length: longestPrompt.length,
          preview: longestPrompt.prompt.substring(0, 100) + '...'
        } : null,
        shortestPrompt: shortestPrompt.length < Infinity ? {
          sessionId: shortestPrompt.sessionId,
          length: shortestPrompt.length,
          preview: shortestPrompt.prompt
        } : null
      },
      prompts: prompts.map(p => ({
        sessionId: p.sessionId,
        length: p.length,
        preview: p.prompt.substring(0, 100) + (p.prompt.length > 100 ? '...' : ''),
        timestamp: p.timestamp
      })),
      pagination: {
        limit,
        offset,
        total: totalPrompts,
        hasMore: offset + limit < totalPrompts
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting prompt analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get prompt analytics' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Delete specific prompt
    const key = `prompt:${sessionId}`;
    await kv.del(key);
    
    console.log('🗑️ Deleted prompt from analytics:', sessionId);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 