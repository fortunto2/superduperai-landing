import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Video generation request schema
const videoGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  negativePrompt: z.string().optional(),
  style: z.string().default('cinematic'),
  resolution: z.string().default('1280x720'),
  shotSize: z.string().default('medium_shot'),
  model: z.string().default('veo3'),
  frameRate: z.number().int().min(24).max(120).default(30),
  duration: z.number().int().min(1).max(60).default(8),
  seed: z.number().optional(),
  generationType: z.enum(['text-to-video', 'image-to-video']).default('text-to-video'),
  file: z.any().optional(), // For FormData file uploads
  chatId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    const contentType = request.headers.get('content-type') || '';
    
    // Handle both FormData and JSON requests
    if (contentType.includes('multipart/form-data')) {
      console.log('🎬 Processing FormData request');
      const formData = await request.formData();
      
      body = {
        prompt: formData.get('prompt')?.toString() || '',
        negativePrompt: formData.get('negativePrompt')?.toString() || '',
        style: formData.get('style')?.toString() || 'cinematic',
        resolution: formData.get('resolution')?.toString() || '1280x720',
        shotSize: formData.get('shotSize')?.toString() || 'medium_shot',
        model: formData.get('model')?.toString() || 'veo3',
        frameRate: Number(formData.get('frameRate')) || 30,
        duration: Number(formData.get('duration')) || 8,
        seed: formData.get('seed') ? Number(formData.get('seed')) : undefined,
        generationType: formData.get('generationType')?.toString() || 'text-to-video',
        chatId: formData.get('chatId')?.toString() || 'video-generator',
        file: formData.get('file') as File | null,
      };
    } else {
      console.log('🎬 Processing JSON request');
      body = await request.json();
    }
    
    // Validate request data
    const validatedData = videoGenerationSchema.parse(body);
    
    console.log('🎬 Video generation request:', {
      prompt: validatedData.prompt.substring(0, 100) + '...',
      model: validatedData.model,
      generationType: validatedData.generationType,
      duration: validatedData.duration,
      resolution: validatedData.resolution,
      hasFile: !!validatedData.file,
    });
    
    // Generate unique file ID for tracking
    const fileId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // TODO: Implement actual video generation
    // For now, simulate the process
    const mockResult = {
      success: true,
      fileId,
      projectId: fileId,
      requestId: fileId,
      message: `Video generation started with ${validatedData.model}`,
      estimatedTime: validatedData.duration * 10, // Rough estimate
    };
    
    // In real implementation, this would:
    // 1. Call SuperDuperAI API with proper payload
    // 2. Handle image upload for image-to-video
    // 3. Return file ID for SSE monitoring
    
    console.log('🎬 ✅ Video generation started:', mockResult);
    
    return NextResponse.json(mockResult);
    
  } catch (error) {
    console.error('🎬 ❌ Video generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check generation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' }, 
        { status: 400 }
      );
    }
    
    console.log('🎬 Checking status for file:', fileId);
    
    // TODO: Implement actual status checking
    // For now, simulate completed video after 30 seconds
    const mockStatus = {
      success: true,
      fileId,
      status: 'completed',
      progress: 100,
      url: `https://example.com/video/${fileId}.mp4`,
      message: 'Video generation completed successfully',
    };
    
    return NextResponse.json(mockStatus);
    
  } catch (error) {
    console.error('🎬 ❌ Status check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 