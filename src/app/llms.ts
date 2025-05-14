import { allTools, allCases, allPages } from ".contentlayer/generated";

/**
 * Генерирует содержимое llms.txt во время билда
 * @returns Текстовое содержимое файла llms.txt
 */
export default async function llms(): Promise<{ text: string }> {
  // Собираем информацию из ContentLayer для создания llms.txt
  const toolLinks = allTools
    .map(
      (tool) => `- [${tool.title}](/tool/${tool.slug}.md): ${tool.description}`
    )
    .join("\n");

  const caseLinks = allCases
    .map(
      (caseItem) =>
        `- [${caseItem.title}](/case/${caseItem.slug}.md): ${caseItem.description}`
    )
    .join("\n");

  const pageLinks = allPages
    .map(
      (page) =>
        `- [${page.title.split(" - ")[0]}](/${page.slug}.md): ${page.description}`
    )
    .join("\n");

  // Формируем полный llms.txt контент
  const llmsContent = `# SuperDuperAI

## General Description

SuperDuperAI is a professional video creation platform powered by artificial intelligence. Our system combines cutting-edge neural rendering technology with intuitive creative tools, enabling anyone to produce broadcast-quality videos without specialized equipment or training.

## Main Sections

### Tools
${toolLinks}

### Use Cases
${caseLinks}

### Pages
${pageLinks}

## Features

- **Instant Video Generation**: Transform text into professional videos in 30 seconds or less.
- **Character Consistency**: Our patented PersonaLock™ technology ensures perfect appearance continuity for characters.
- **Broadcast-Quality Output**: Generate videos at up to 4K resolution (3840×2160) with 60fps and HDR10+ support.
- **Advanced Style Customization**: Choose from 87 pre-built visual styles or create your own using our StyleLab interface.
- **Precision Editing Suite**: Fine-tune every aspect of your video with frame-accurate controls.
- **Accelerated Rendering**: Our distributed cloud rendering farm processes videos 5.3× faster than competing platforms.

## How It Works

1. **Describe Your Vision**: Begin with a text description, script, or prompt. Our natural language parser identifies key visual elements, characters, and scene transitions.
2. **Watch AI Creation Unfold**: Behind the scenes, our multi-stage rendering pipeline builds your video frame-by-frame, with options to pause and redirect at any stage.
3. **Refine and Distribute**: Review your video in our editor, make adjustments if needed, then export in any format with custom presets for YouTube, TikTok, Instagram, and LinkedIn.

## About llms.txt

This file follows the [llms.txt](https://llmstxt.org/) specification and is designed to optimize content for Large Language Models (LLMs).

## Additional Information

SuperDuperAI combines cutting-edge neural technology with intuitive creative tools, allowing anyone to create broadcast-quality videos.`;

  return {
    text: llmsContent,
  };
}
