#!/usr/bin/env node

/**
 * Скрипт для генерации llms.txt файла
 * Запускается как пребилд шаг
 */

/* eslint-disable */
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Заранее определенные данные для llms.txt
const toolsData = [
  {
    title: 'Vibe Filmmaking',
    slug: 'vibe-filmmaking',
    description: 'Create videos based on mood or aesthetic instead of detailed scripts.'
  },
  {
    title: 'Agent Director',
    slug: 'agent-director',
    description: 'A paradigm where AI agents handle different aspects of video creation.'
  },
  {
    title: 'Image Generator',
    slug: 'image-generator',
    description: 'Transform text into professional images and videos.'
  }
];

const casesData = [
  {
    title: 'Creators & Influencers',
    slug: 'creators-influencers',
    description: 'Content production for bloggers and influencers.'
  },
  {
    title: 'Musicians & Artists',
    slug: 'musicians-artists',
    description: 'Create music videos based on the vibe of your tracks.'
  },
  {
    title: 'Small Businesses',
    slug: 'small-businesses',
    description: 'Video advertising without agencies.'
  },
  {
    title: 'Agencies & Teams',
    slug: 'agencies-teams',
    description: 'Rapid prototyping and collaborative workflows.'
  },
  {
    title: 'Video Storytelling',
    slug: 'video-story',
    description: 'Telling stories through video.'
  }
];

const pagesData = [
  {
    title: 'About',
    slug: 'about',
    description: 'Information about SuperDuperAI and the technologies behind the platform.'
  },
  {
    title: 'Pricing',
    slug: 'pricing',
    description: 'Available subscription options and features.'
  },
  {
    title: 'Privacy',
    slug: 'privacy',
    description: 'Information about data handling and privacy.'
  },
  {
    title: 'Terms',
    slug: 'terms',
    description: 'Legal terms of service agreement.'
  },
  {
    title: 'Creators',
    slug: 'creators',
    description: 'Special information for content creators.'
  }
];

// Создаем директорию public, если её нет
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Генерируем ссылки на инструменты
const toolLinks = toolsData
  .map(tool => `- [${tool.title}](/tool/${tool.slug}.md): ${tool.description}`)
  .join('\n');

// Генерируем ссылки на кейсы
const caseLinks = casesData
  .map(caseItem => `- [${caseItem.title}](/case/${caseItem.slug}.md): ${caseItem.description}`)
  .join('\n');

// Генерируем ссылки на страницы
const pageLinks = pagesData
  .map(page => `- [${page.title}](/${page.slug}.md): ${page.description}`)
  .join('\n');

// Создаем содержимое файла
const content = `# SuperDuperAI

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

// Путь к файлу в public
const filePath = path.join(publicDir, 'llms.txt');

// Записываем файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Generated llms.txt successfully'); 