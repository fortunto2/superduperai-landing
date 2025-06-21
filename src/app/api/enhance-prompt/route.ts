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
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { prompt, length } = enhancePromptSchema.parse(body);

    // Define character limits based on length preference
    const lengthLimits = {
      short: 500,
      medium: 1000,
      long: 2000
    };
    
    const maxTokensMap = {
      short: 150,
      medium: 300,
      long: 600
    };

    // Generate enhanced prompt using Azure OpenAI
    const { text } = await generateText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'),
      system: `You are an expert video prompt engineer specializing in Google's VEO3 AI video generation model.

Your task is to enhance and expand user-provided video prompts to make them more detailed, cinematic, and effective for VEO3.

CRITICAL LANGUAGE RULE:
- ALWAYS write the enhanced prompt in ENGLISH ONLY
- EXCEPTION: Preserve direct speech/dialogue in its original language if explicitly specified
- Example: "says in russian: 'Я опаздываю'" → keep the Russian phrase exactly as is
- Example: "says in spanish: 'Te amo'" → keep the Spanish phrase exactly as is
- All descriptions, camera work, lighting, etc. must be in English

VEO3 PROMPTING GUIDELINES (based on official documentation):

STRUCTURE:
1. Scene Description: Overall description of what's happening, who's involved, and the general atmosphere
2. Visual Style: Overall look and feel - cinematic, realistic, animated, stylized, or surreal  
3. Camera Movement: How camera moves - slow pan, static shot, tracking shot, aerial zoom
4. Main Subject: Primary person, character, or object that should be the focus
5. Background Setting: Specific location or environment where scene takes place
6. Lighting/Mood: Type of lighting and emotional tone you want
7. Audio Cue: Specific sound or music during the scene
8. Color Palette: Dominant colors or tones - bold, pastel, muted, monochrome

PROMPTING TIPS:
- Use natural language - write as you would speak
- Use long prompts - more information = better output
- Be clear and descriptive - avoid slang terms like 'robo-arm'
- Avoid quotes for dialogue - " " ( ) [ ] may generate unwanted subtitles
- Language influences culture - mentioning language affects clothing, signs, architecture

TARGET LENGTH: ${lengthLimits[length]} characters (${length} version)

Enhancement Guidelines:
1. Preserve the original intent and core elements of the user's prompt
2. Add specific cinematic details (camera movements, lighting, composition)
3. Include more vivid descriptions of actions, emotions, and atmosphere
4. Specify technical details that help VEO3 generate better videos
5. Maintain the original duration and style preferences if specified
6. Add professional video production terminology
7. Make the prompt more specific and actionable
8. Include cultural context when appropriate (but describe in English)
9. Add sensory details (sounds, textures, temperature)
10. Specify color palettes and visual aesthetics
11. PRESERVE any direct speech in original language while describing everything else in English

Original prompt style should be maintained (e.g., if it's casual, keep it casual; if professional, keep it professional).

Return ONLY the enhanced prompt in English (except for preserved direct speech), no additional text or explanations.`,
      prompt: `Please enhance this VEO3 video prompt to be approximately ${lengthLimits[length]} characters (${length} length): "${prompt}"`,
      maxTokens: maxTokensMap[length],
    });

    return NextResponse.json({ 
      originalPrompt: prompt,
      enhancedPrompt: text.trim(),
      length: length,
      targetCharacters: lengthLimits[length],
      actualCharacters: text.trim().length
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