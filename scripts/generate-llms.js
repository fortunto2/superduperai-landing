#!/usr/bin/env node

/**
 * Скрипт для генерации llms.txt файла
 * Запускается как пребилд шаг
 */

/* eslint-disable */
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Функция для извлечения метаданных из MDX файла
function extractMdxMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*["']([^"']+)["']/);
    const descriptionMatch = frontmatter.match(/description:\s*["']([^"']+)["']/);
    const slugMatch = frontmatter.match(/slug:\s*["']([^"']+)["']/);

    if (!titleMatch || !descriptionMatch || !slugMatch) {
      return null;
    }

    return {
      title: titleMatch[1],
      description: descriptionMatch[1],
      slug: slugMatch[1]
    };
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return null;
  }
}

// Функция для динамического чтения содержимого из директории
function getContentData(contentDir, sectionName = 'content') {
  if (!fs.existsSync(contentDir)) {
    console.warn(`Warning: Directory ${contentDir} not found, skipping ${sectionName}`);
    return [];
  }

  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));
  const content = [];

  console.log(`📁 Reading ${sectionName} from ${contentDir}:`);
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const metadata = extractMdxMetadata(filePath);
    
    if (metadata) {
      content.push(metadata);
      console.log(`   ✓ ${metadata.title} (${metadata.slug})`);
    } else {
      console.log(`   ✗ ${file} - missing metadata`);
    }
  }

  // Сортируем по алфавиту для консистентности
  content.sort((a, b) => a.title.localeCompare(b.title));

  console.log(`   📊 Found ${content.length} valid ${sectionName}\n`);
  return content;
}

// Создаем директорию public, если её нет
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('🔄 Generating llms.txt dynamically from MDX files...\n');

// Получаем данные динамически из всех разделов (без fallback)
const toolsData = getContentData(
  path.join(__dirname, '../src/content/tool/en'),
  'tools'
);

const casesData = getContentData(
  path.join(__dirname, '../src/content/case/en'),
  'use cases'
);

const pagesData = getContentData(
  path.join(__dirname, '../src/content/pages/en'),
  'pages'
);

const blogsData = getContentData(
  path.join(__dirname, '../src/content/blog/en'),
  'blog posts'
);

const docsData = getContentData(
  path.join(__dirname, '../src/content/docs/en'),
  'documentation'
);

// Генерируем ссылки только если есть данные
const toolLinks = toolsData.length > 0 
  ? toolsData.map(tool => `- [${tool.title}](/tool/${tool.slug}.md): ${tool.description}`).join('\n')
  : '- No tools available';

const caseLinks = casesData.length > 0
  ? casesData.map(caseItem => `- [${caseItem.title}](/case/${caseItem.slug}.md): ${caseItem.description}`).join('\n')
  : '- No use cases available';

const pageLinks = pagesData.length > 0
  ? pagesData.map(page => `- [${page.title}](/${page.slug}.md): ${page.description}`).join('\n')
  : '- No pages available';

const blogLinks = blogsData.length > 0
  ? blogsData.map(blog => `- [${blog.title}](/blog/${blog.slug}.md): ${blog.description}`).join('\n')
  : '- No blog posts available';

const docLinks = docsData.length > 0
  ? docsData.map(doc => `- [${doc.title}](/docs/${doc.slug}.md): ${doc.description}`).join('\n')
  : '- No documentation available';

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

### Blog
${blogLinks}

### Documentation
${docLinks}

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
console.log(`📝 Content summary:`);
console.log(`   - ${toolsData.length} tools`);
console.log(`   - ${casesData.length} use cases`);
console.log(`   - ${pagesData.length} pages`);
console.log(`   - ${blogsData.length} blog posts`);
console.log(`   - ${docsData.length} documentation pages`);
console.log(`   - Total: ${toolsData.length + casesData.length + pagesData.length + blogsData.length + docsData.length} items`);

// Проверяем на возможные проблемы
const totalItems = toolsData.length + casesData.length + pagesData.length + blogsData.length + docsData.length;
if (totalItems === 0) {
  console.warn('⚠️  Warning: No content found in any section. Check MDX files and frontmatter.');
} 