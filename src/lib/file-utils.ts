import { promises as fs } from 'fs';
import path from 'path';

const GENERATIONS_DIR = '.veo3-generations';

export interface GenerationData {
  generationId: string;
  prompt: string;
  videoCount: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  createdAt: string;
  videos: Array<{
    fileId: string;
    url?: string;
    thumbnailUrl?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
}

/**
 * Find generationId by fileId
 */
export async function findGenerationByFileId(fileId: string): Promise<string | null> {
  try {
    const files = await fs.readdir(GENERATIONS_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(GENERATIONS_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data: GenerationData = JSON.parse(content);
      
      if (data.videos?.some(video => video.fileId === fileId)) {
        return data.generationId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding generation by fileId:', error);
    return null;
  }
}

/**
 * Get all fileIds from a generation
 */
export async function getFileIdsFromGeneration(generationId: string): Promise<string[]> {
  try {
    const filePath = path.join(GENERATIONS_DIR, `${generationId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const data: GenerationData = JSON.parse(content);
    
    return data.videos?.map(video => video.fileId) || [];
  } catch (error) {
    console.error('Error getting fileIds from generation:', error);
    return [];
  }
}

/**
 * Generate file status URL
 */
export function getFileStatusUrl(fileId: string, locale: string = 'en'): string {
  return `/${locale}/file/${fileId}`;
}

/**
 * Generate generation status URL
 */
export function getGenerationStatusUrl(generationId: string, locale: string = 'en'): string {
  return `/${locale}/veo3-status/${generationId}`;
}

/**
 * Validate UUID format
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Validate generation ID format
 */
export function isValidGenerationId(str: string): boolean {
  return str.startsWith('veo3_') || str.startsWith('api_test_') || str.startsWith('sunset_test_');
}

/**
 * Get file type from SuperDuperAI response
 */
export function getFileTypeFromResponse(response: Record<string, unknown>): 'video' | 'image' | 'audio' | 'other' {
  if (response.type) {
    return response.type as 'video' | 'image' | 'audio' | 'other';
  }
  
  if (response.video_generation) return 'video';
  if (response.image_generation) return 'image';
  if (response.audio_generation) return 'audio';
  
  return 'other';
} 