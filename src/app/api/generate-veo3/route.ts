import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { configureSuperduperAI, getSuperduperAIConfig, API_ENDPOINTS } from '@/lib/config/superduperai';

// VEO3 generation request schema
const veo3GenerationSchema = z.object({
  generationId: z.string(),
  prompt: z.string().min(1, 'Prompt is required'),
  videoCount: z.number().min(1).max(3).default(1),
  status: z.enum(['pending', 'processing', 'completed', 'error']).default('processing'),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.string(),
  paymentIntentId: z.string().optional(),
  sessionId: z.string().optional(),
  customerEmail: z.string().optional(),
  videos: z.array(z.object({
    fileId: z.string(),
    url: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'error']).default('processing'),
  })).optional(),
  error: z.string().optional(),
});

type VEO3GenerationData = z.infer<typeof veo3GenerationSchema>;

// File paths for storing generation data
const STORAGE_DIR = join(process.cwd(), '.veo3-generations');
const getGenerationFilePath = (generationId: string) => join(STORAGE_DIR, `${generationId}.json`);

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await writeFile(join(STORAGE_DIR, '.gitkeep'), '');
  } catch {
    // Directory already exists or other error, ignore
  }
}

// Save generation data to file
async function saveGenerationData(data: VEO3GenerationData) {
  await ensureStorageDir();
  const filePath = getGenerationFilePath(data.generationId);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Load generation data from file
async function loadGenerationData(generationId: string): Promise<VEO3GenerationData | null> {
  try {
    const filePath = getGenerationFilePath(generationId);
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Generate video using SuperDuperAI API
async function generateVideoWithSuperDuperAI(prompt: string, videoCount: number): Promise<string[]> {
  console.log('🎬 Starting SuperDuperAI video generation:', { prompt, videoCount });
  
  // Configure SuperDuperAI client
  configureSuperduperAI();
  const config = getSuperduperAIConfig();
  
  const fileIds = [];
  
  for (let i = 0; i < videoCount; i++) {
    try {
      // Use VEO3 model for video generation
      const payload = {
        config: {
          prompt,
          negative_prompt: '',
          width: 1280,
          height: 720,
          aspect_ratio: '16:9',
          duration: 8,
          seed: Math.floor(Math.random() * 1000000),
          generation_config_name: 'google-cloud/veo3', // Use VEO3 model
          frame_rate: 30,
          batch_size: 1,
          references: []
        }
      };
      
      console.log('📤 Sending request to SuperDuperAI:', payload);
      
      const response = await fetch(`${config.url}${API_ENDPOINTS.GENERATE_VIDEO}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`,
          'User-Agent': 'SuperDuperAI-Landing/1.0'
        },
        body: JSON.stringify(payload)
      });
      
      console.log(`📡 SuperDuperAI API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SuperDuperAI API Error:', errorText);
        throw new Error(`SuperDuperAI API failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ SuperDuperAI response:', result);
      
      // Extract file ID from response (this is the key change!)
      const fileId = result.id;
      if (!fileId) {
        throw new Error('No file ID returned from SuperDuperAI API');
      }
      
      fileIds.push(fileId);
      
      console.log(`✅ Video ${i + 1}/${videoCount} generation started with fileId: ${fileId}`);
      
    } catch (error) {
      console.error(`❌ Error generating video ${i + 1}:`, error);
      throw error;
    }
  }
  
  return fileIds;
}

// Check file status via SuperDuperAI API
async function checkFileStatus(fileId: string): Promise<{ url?: string; thumbnailUrl?: string; status: string }> {
  try {
    configureSuperduperAI();
    const config = getSuperduperAIConfig();
    
    const response = await fetch(`${config.url}/api/v1/file/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${config.token}`
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Failed to check file ${fileId} status:`, response.status);
      return { status: 'error' };
    }
    
    const fileData = await response.json();
    console.log(`📁 File ${fileId} status:`, fileData);
    
    // Check if file is completed
    if (fileData.url) {
      return {
        url: fileData.url,
        thumbnailUrl: fileData.thumbnail_url,
        status: 'completed'
      };
    }
    
    // Check task status
    if (fileData.tasks && fileData.tasks.length > 0) {
      const latestTask = fileData.tasks[fileData.tasks.length - 1];
      if (latestTask.status === 'error') {
        return { status: 'error' };
      }
      if (latestTask.status === 'in_progress') {
        return { status: 'processing' };
      }
    }
    
    return { status: 'processing' };
    
  } catch (error) {
    console.error(`❌ Error checking file ${fileId}:`, error);
    return { status: 'error' };
  }
}

// POST - Create/start video generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🎬 VEO3 generation request:', body);
    
    // Validate request data
    const validatedData = veo3GenerationSchema.parse(body);
    
    // Start video generation with SuperDuperAI
    try {
      const fileIds = await generateVideoWithSuperDuperAI(
        validatedData.prompt,
        validatedData.videoCount
      );
      
      // Create video entries with fileIds
      const videos = fileIds.map(fileId => ({
        fileId,
        status: 'processing' as const,
        url: undefined,
        thumbnailUrl: undefined
      }));
      
      // Update generation data with file IDs
      const updatedData: VEO3GenerationData = {
        ...validatedData,
        status: 'processing',
        progress: 10, // Initial progress
        videos
      };
      
      // Save to file
      await saveGenerationData(updatedData);
      
      console.log('🎬 VEO3 generation started:', {
        success: true,
        generationId: validatedData.generationId,
        fileIds,
        status: 'started',
        estimatedTime: validatedData.videoCount * 50, // 50 seconds per video
        message: 'VEO3 video generation started'
      });
      
      return NextResponse.json({
        success: true,
        generationId: validatedData.generationId,
        fileIds,
        status: 'started',
        estimatedTime: validatedData.videoCount * 50,
        message: 'VEO3 video generation started'
      });
      
    } catch (error) {
      console.error('❌ VEO3 generation error:', error);
      
      // Save error state
      const errorData: VEO3GenerationData = {
        ...validatedData,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      await saveGenerationData(errorData);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to start video generation',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ VEO3 API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Check generation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('generationId');
    
    if (!generationId) {
      return NextResponse.json({
        success: false,
        error: 'Generation ID is required'
      }, { status: 400 });
    }
    
    // Load generation data
    const generationData = await loadGenerationData(generationId);
    
    if (!generationData) {
      return NextResponse.json({
        success: false,
        error: 'Generation not found'
      }, { status: 404 });
    }
    
    // If generation is still processing, check status via SuperDuperAI API
    if (generationData.status === 'processing' && generationData.videos) {
      let allCompleted = true;
      let totalProgress = 0;
      const updatedVideos = [];
      
      for (const video of generationData.videos) {
        const fileStatus = await checkFileStatus(video.fileId);
        
        if (fileStatus.status === 'completed' && fileStatus.url) {
          updatedVideos.push({
            ...video,
            url: fileStatus.url,
            thumbnailUrl: fileStatus.thumbnailUrl,
            status: 'completed' as const
          });
          totalProgress += 100;
        } else if (fileStatus.status === 'error') {
          updatedVideos.push({
            ...video,
            status: 'error' as const
          });
          totalProgress += 0;
          allCompleted = false;
        } else {
          updatedVideos.push({
            ...video,
            status: 'processing' as const
          });
          totalProgress += 50; // Still processing
          allCompleted = false;
        }
      }
      
      const averageProgress = Math.round(totalProgress / generationData.videos.length);
      
      // Update generation data
      const updatedData: VEO3GenerationData = {
        ...generationData,
        status: allCompleted ? 'completed' : 'processing',
        progress: averageProgress,
        videos: updatedVideos
      };
      
      await saveGenerationData(updatedData);
      
      return NextResponse.json({
        success: true,
        ...updatedData
      });
    }
    
    return NextResponse.json({
      success: true,
      ...generationData
    });
    
  } catch (error) {
    console.error('❌ Status check error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check generation status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 