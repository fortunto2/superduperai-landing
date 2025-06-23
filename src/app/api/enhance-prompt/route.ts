import { generateText } from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Azure provider
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
});

// Available models with their character limits and capabilities
const MODEL_CONFIG = {
  'gpt-4.1': {
    name: 'GPT-4.1',
    deploymentName: 'gpt-4.1', // Real deployment name in Azure
    maxChars: { short: 500, medium: 1000, long: 2000 },
    maxTokens: { short: 150, medium: 300, long: 600 },
    supportsSystem: true,
    isReasoning: false,
    type: 'chat' // standard chat model
  }
} as const;

// Request schema validation
const enhancePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  customLimit: z.number().min(200).max(10000).default(1000),
  model: z.enum(['gpt-4.1']).default('gpt-4.1'),
  focusType: z.string().optional(), // Can be comma-separated list of focus types
  includeAudio: z.boolean().default(true),
  promptData: z.object({
    characters: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      speech: z.string()
    })).optional(),
    language: z.string().optional()
  }).optional()
});

export async function POST(req: NextRequest) {
  try {
    // Check environment variables (only resource name and API key needed)
    if (!process.env.AZURE_OPENAI_RESOURCE_NAME || !process.env.AZURE_OPENAI_API_KEY) {
      console.error('Missing Azure OpenAI environment variables');
      return NextResponse.json(
        { error: 'Azure OpenAI not configured. Please set AZURE_OPENAI_RESOURCE_NAME and AZURE_OPENAI_API_KEY environment variables.' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { prompt, customLimit, model, focusType, includeAudio, promptData } = enhancePromptSchema.parse(body);
    
    console.log('Enhancement request:', { prompt: prompt.substring(0, 100) + '...', customLimit, model, focusType, includeAudio });

    // Extract character speech for special handling
    let characterSpeechInfo = '';
    if (includeAudio && promptData?.characters) {
      const charactersWithSpeech = promptData.characters.filter(char => char.speech.trim());
      if (charactersWithSpeech.length > 0) {
        characterSpeechInfo = `\n\nCHARACTER SPEECH INFORMATION:\n${charactersWithSpeech.map(char => 
          `- ${char.name || 'Character'}: "${char.speech}" ${promptData.language ? `(in ${promptData.language})` : ''}`
        ).join('\n')}\n`;
      }
    }

    const modelConfig = MODEL_CONFIG[model];
    // Reduce target by 25% to avoid overruns and give buffer for formatting
    const targetChars = Math.floor(customLimit * 0.75);
    const maxChars = customLimit; // Keep original for response
    // Calculate tokens based on character limit (roughly 4 chars per token)
    const maxTokens = Math.min(Math.ceil(customLimit / 4), 2000); // Cap at 2000 tokens

    // Create focus-specific instruction
    const focusInstructions = {
      character: 'FOCUS ON CHARACTER: Pay special attention to character development, appearance details, facial expressions, body language, and personality traits in the MAIN SUBJECT and SCENE DESCRIPTION sections. Make the character descriptions vivid and memorable while maintaining the required structure.',
      action: 'FOCUS ON ACTION: Emphasize dynamic movements, activities, and sequences in the SCENE DESCRIPTION and CAMERA MOVEMENT sections. Add details about how actions unfold, timing, and physical interactions with the environment while maintaining the required structure.',
      cinematic: 'FOCUS ON CINEMATOGRAPHY: Enhance the CAMERA MOVEMENT, LIGHTING/MOOD, and VISUAL STYLE sections with professional filming techniques, visual composition, and color grading. Make it more visually stunning while maintaining the required structure.',

      safe: 'SAFE CONTENT MODE: Ensure all content strictly complies with Google VEO3 content policies. Avoid any content that could be flagged for: violence, sexual content, child safety concerns, celebrity likenesses, hate speech, dangerous activities, toxic behavior, or copyright infringement. Focus on family-friendly, educational, artistic, or commercial content that is clearly fictional and non-controversial. Emphasize positive themes, safe environments, and appropriate activities suitable for all audiences while maintaining the required structure.'
    };

    // Handle multiple focus types
    let focusInstruction = '';
    if (focusType) {
      const focusTypes = focusType.split(',').map(type => type.trim());
      const validFocusTypes = focusTypes.filter(type => type in focusInstructions);
      if (validFocusTypes.length > 0) {
        const instructions = validFocusTypes.map(type => focusInstructions[type as keyof typeof focusInstructions]);
        focusInstruction = `\n\nCOMBINED FOCUS INSTRUCTIONS:\n${instructions.join('\n\n')}\n`;
      }
    }

    const enhancementPrompt = `Please enhance this VEO3 video prompt to be STRICTLY UNDER ${targetChars} characters (target: ${targetChars}, absolute max: ${maxChars}): "${prompt}"${focusInstruction}${characterSpeechInfo}

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
7. Audio Cue: Detailed sound design including dialogue, ambient sounds, music, and sound effects
8. Color Palette: Dominant colors or tones - bold, pastel, muted, monochrome

PROMPTING TIPS:
- Use natural language - write as you would speak
- Use long prompts - more information = better output
- Be clear and descriptive - avoid slang terms like 'robo-arm'
- Avoid quotes for dialogue - " " ( ) [ ] may generate unwanted subtitles
- Language influences culture - mentioning language affects clothing, signs, architecture

STRICT LENGTH CONTROL (Target: ${targetChars} characters, Absolute Max: ${maxChars}):
- CRITICAL: You MUST stay under ${targetChars} characters. This is NOT a suggestion.
- Count characters as you write each section and adjust accordingly
- If approaching limit, prioritize core VEO3 sections and reduce descriptive flourishes
- Better to have concise, complete sections than verbose, cut-off content

SMART LENGTH DISTRIBUTION:
- Dynamically allocate character budget based on selected focus and prompt complexity
- If focusing on CHARACTER: allocate 30% to MAIN SUBJECT, 20% to SCENE DESCRIPTION, 15% each to other sections
- If focusing on ACTION: allocate 25% to SCENE DESCRIPTION, 25% to CAMERA MOVEMENT, 20% to MAIN SUBJECT, 10% each to other sections  
- If focusing on CINEMATIC: allocate 25% to CAMERA MOVEMENT, 20% to VISUAL STYLE, 20% to LIGHTING/MOOD, 15% each to other sections
- If SAFE CONTENT only: distribute evenly but prioritize family-friendly descriptions
- For smaller targets (<800 chars): focus on essential elements, reduce descriptive flourishes
- For larger targets (>2500 chars): add rich details, sensory descriptions, and nuanced elements

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

MANDATORY STRUCTURE - Your response MUST follow this exact format:

SCENE DESCRIPTION: [Detailed description of the overall scene, what's happening, who's involved, and general atmosphere]

VISUAL STYLE: [Overall look and feel - specify if cinematic, realistic, animated, stylized, or surreal]

CAMERA MOVEMENT: [Specific camera movements - slow pan, static shot, tracking shot, aerial zoom, etc.]

MAIN SUBJECT: [Primary person, character, or object that should be the focus of the video]

BACKGROUND SETTING: [Specific location or environment where scene takes place]

LIGHTING/MOOD: [Type of lighting and emotional tone - golden hour, dramatic shadows, soft lighting, etc.]

AUDIO CUE: [Detailed sound design: character dialogue, ambient sounds, music, sound effects, voice characteristics]

COLOR PALETTE: [Dominant colors or tones - bold, pastel, muted, monochrome, warm, cool, etc.]

CRITICAL LENGTH & STRUCTURE REQUIREMENTS: 
- TOTAL LENGTH MUST BE UNDER ${targetChars} CHARACTERS
- Use EXACTLY this structure with these section headers
- Use double line breaks (\n\n) between sections
- Each section must be a complete paragraph proportional to its importance
- NEVER skip any section - if not relevant, still include it briefly
- Write in flowing, natural language while maintaining structure
- If approaching character limit, reduce descriptive flourishes but keep all 8 sections
- Quality over quantity - better concise and complete than verbose and cut-off

Return ONLY the structured enhanced prompt. No additional text or explanations.`;

    // Configure standard chat model
    const modelInstance = azure(modelConfig.deploymentName);
    
    const generateOptions = {
      model: modelInstance,
      maxTokens: maxTokens,
      system: `You are an expert video prompt engineer specializing in Google's VEO3 AI video generation model with SMART LENGTH MANAGEMENT.

CRITICAL: You MUST follow the VEO3 structure format EXACTLY. Your response MUST be organized into these sections with clear paragraph breaks:

1. SCENE DESCRIPTION: Overall description of what's happening, who's involved, and the general atmosphere
2. VISUAL STYLE: Overall look and feel - cinematic, realistic, animated, stylized, or surreal  
3. CAMERA MOVEMENT: How camera moves - slow pan, static shot, tracking shot, aerial zoom
4. MAIN SUBJECT: Primary person, character, or object that should be the focus
5. BACKGROUND SETTING: Specific location or environment where scene takes place
6. LIGHTING/MOOD: Type of lighting and emotional tone you want
7. AUDIO CUE: Specific sound or music during the scene (if relevant)
8. COLOR PALETTE: Dominant colors or tones - bold, pastel, muted, monochrome

STRICT LENGTH CONTROL:
- CRITICAL: You MUST stay UNDER ${targetChars} characters total. This is NOT negotiable.
- Monitor your character count as you write each section
- If approaching limit, prioritize completeness over verbosity
- Better to have 8 concise sections than 4 verbose ones that get cut off

SMART LENGTH DISTRIBUTION:
- You MUST intelligently distribute the ${targetChars} character budget across sections based on focus
- If CHARACTER focus: Make MAIN SUBJECT rich and detailed (30% of budget), SCENE DESCRIPTION substantial (20%), others balanced
- If ACTION focus: Emphasize SCENE DESCRIPTION and CAMERA MOVEMENT (25% each), others proportional
- If CINEMATIC focus: Prioritize CAMERA MOVEMENT, VISUAL STYLE, LIGHTING/MOOD (20-25% each)
- If AUDIO enabled: Allocate extra space to AUDIO CUE section for detailed sound design and character speech
- For small budgets (<800): Be concise but complete, focus on essential elements
- For large budgets (>2500): Add rich sensory details, nuanced descriptions, professional terminology

SPECIAL AUDIO & SPEECH HANDLING:
- When character speech is provided, create a dedicated subsection in MAIN SUBJECT or AUDIO CUE
- Preserve exact speech/dialogue in original language
- Add detailed audio descriptions: ambient sounds, voice tones, sound effects
- Include audio transitions and layering (dialogue over background sounds)
- Specify voice characteristics: tone, accent, emotion, volume
- Add sound design elements that enhance the scene atmosphere

FORMATTING REQUIREMENTS:
- Use double line breaks (\\n\\n) between each section
- Each section should be a complete paragraph proportional to its importance and focus
- Adjust paragraph length based on focus priorities and character budget
- NEVER skip sections - if less important for focus, make it brief but present
- Make it flow naturally while maintaining structure

LANGUAGE RULE: Write everything in English except preserve direct speech in original language.

Your enhanced prompt MUST be structured, detailed, and optimized for VEO3 video generation with SMART character allocation.`,
      prompt: enhancementPrompt,
    };

    console.log('Calling Azure OpenAI with options:', {
      deploymentName: modelConfig.deploymentName,
      selectedModel: model,
      modelType: modelConfig.type,
      resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
      maxTokens: generateOptions.maxTokens,
      promptLength: generateOptions.prompt.length
    });

    const result = await generateText(generateOptions);
    
    console.log('Azure OpenAI response:', {
      textLength: result.text.length,
      textPreview: result.text.substring(0, 100) + (result.text.length > 100 ? '...' : ''),
      hasReasoning: !!result.reasoning,
      reasoningLength: result.reasoning?.length || 0,
      usage: result.usage,
      providerMetadata: result.providerMetadata
    });

    // For reasoning models, we might get reasoning content
    const enhancedText = result.text.trim();
    
    if (!enhancedText) {
      console.error('Empty response from Azure OpenAI');
      return NextResponse.json(
        { error: 'Received empty response from AI model. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      originalPrompt: prompt,
      enhancedPrompt: enhancedText,
      customLimit: customLimit,
      model: model,
      modelName: modelConfig.name,
      targetCharacters: maxChars,
      actualCharacters: enhancedText.length,
      // Include reasoning info if available
      ...(result.reasoning && { reasoning: result.reasoning }),
      ...(result.usage && { usage: result.usage }),
      ...(result.providerMetadata && { providerMetadata: result.providerMetadata })
    });

  } catch (error) {
    console.error('Error enhancing prompt:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json(
      { error: 'Failed to enhance prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 