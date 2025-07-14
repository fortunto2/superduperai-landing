import { type NextRequest, NextResponse } from 'next/server';
import { configureSuperduperAI, getSuperduperAIConfig } from '@/lib/config/superduperai';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params;
  
  try {
    // Configure SuperDuperAI client for server-side usage
    configureSuperduperAI();
    const config = getSuperduperAIConfig();
    
    console.log('📁 File proxy: Getting file status for ID:', fileId);
    
    // Use direct fetch to SuperDuperAI API
    const response = await fetch(`${config.url}/api/v1/file/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('💥 File proxy error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to get file status', details: `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const fileData = await response.json();
    console.log('✅ File status response:', fileData);
    
    return NextResponse.json(fileData);
  } catch (error) {
    console.error('💥 File proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get file status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 