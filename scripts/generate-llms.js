#!/usr/bin/env node

/**
 * Скрипт для генерации llms.txt файла
 * Запускается как пребилд шаг
 */

/* eslint-disable */
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Создаем директорию public, если её нет
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Создаем содержимое файла
const content = `# SuperDuperAI LLMs Information
Version: ${packageJson.version}
Last Updated: ${new Date().toISOString()}

## Models
- GPT-4 Turbo: Video content generation
- DALL-E 3: Image creation
- Stable Diffusion XL: Visual effects
- Whisper: Audio transcription

## Supported Languages
- English (en)
- Russian (ru)

## Runtime Information
- Next.js: ${packageJson.dependencies.next}
- React: ${packageJson.dependencies.react}
- Node: ${process.version}

## Contact
For more information about our LLM implementations, contact support@superduperai.com
`;

// Путь к файлу в public
const filePath = path.join(publicDir, 'llms.txt');

// Записываем файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Generated llms.txt successfully'); 