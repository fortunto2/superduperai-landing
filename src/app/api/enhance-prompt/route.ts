import { generateText } from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Azure provider
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
});

// Request schema validation
const enhancePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { prompt } = enhancePromptSchema.parse(body);

    // Generate enhanced prompt using Azure OpenAI
    const { text } = await generateText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'),
      system: `You are an expert video prompt engineer specializing in Google's VEO3 AI video generation model. 

Your task is to enhance and expand user-provided video prompts to make them more detailed, cinematic, and effective for VEO3.

Guidelines for enhancement:
1. Preserve the original intent and core elements of the user's prompt
2. Add specific cinematic details (camera movements, lighting, composition)
3. Include more vivid descriptions of actions, emotions, and atmosphere
4. Specify technical details that help VEO3 generate better videos
5. Maintain the original duration and style preferences if specified
6. Add professional video production terminology
7. Keep the enhanced prompt under 500 characters for optimal VEO3 performance
8. Make the prompt more specific and actionable

Original prompt style should be maintained (e.g., if it's casual, keep it casual; if professional, keep it professional).

Return ONLY the enhanced prompt, no additional text or explanations.`,
      prompt: `Please enhance this VEO3 video prompt: "${prompt}"`,
      maxTokens: 200,
    });

    return NextResponse.json({ 
      originalPrompt: prompt,
      enhancedPrompt: text.trim()
    });

  } catch (error) {
    console.error('Error enhancing prompt:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
} 