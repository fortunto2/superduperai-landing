/**
 * Скрипт для генерации статических MD файлов из MDX файлов
 * Запускается после сборки проекта
 */

/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Функция для преобразования MDX в Markdown (аналогичная той, что используется в API)
function mdxToMarkdown(content) {
  // Сохраняем frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch
    ? `---\n${frontmatterMatch[1]}\n---\n\n`
    : "";

  // Удаляем импорты и экспорты
  let markdown = content
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "")
    .replace(/^export\s+.*?$/gm, "");

  // Обрабатываем компоненты с атрибутами title и description
  markdown = markdown.replace(
    /<(\w+)[\s\S]*?title=["']([^"']*)["'][\s\S]*?description=["']([^"']*)["'][\s\S]*?\/?>/g,
    (_, name, title, description) => `### ${title}\n\n${description}\n\n`
  );

  // Обрабатываем секции компонентов
  markdown = markdown.replace(
    /<(\w+)[\s\S]*?>([\s\S]*?)<\/\1>/g,
    (_, name, content) => content
  );

  // Удаляем оставшиеся JSX теги
  markdown = markdown.replace(/<[^>]*\/?>/g, "");

  // Сохраняем код блоки и удаляем фигурные скобки только вне их
  const codeBlocks = [];
  let codeBlockIndex = 0;
  
  // Сохраняем код блоки
  markdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlockIndex++}__`;
  });
  
  // Удаляем фигурные скобки с выражениями только вне код блоков
  markdown = markdown.replace(/\{[^{}]*\}/g, "");
  
  // Восстанавливаем код блоки
  codeBlocks.forEach((block, index) => {
    markdown = markdown.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Удаляем лишние пустые строки
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  // Возвращаем frontmatter на место
  return frontmatter + markdown;
}

// Функция для рекурсивного обхода директорий
function processDirectory(dirPath, outputBasePath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Создаем соответствующую директорию в выходном пути
      const relativePath = path.relative(path.join(process.cwd(), 'src', 'content'), dirPath);
      const outputDir = path.join(outputBasePath, relativePath, item);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      processDirectory(itemPath, outputBasePath);
    } else if (item.endsWith('.mdx')) {
      try {
        // Читаем MDX файл
        const content = fs.readFileSync(itemPath, 'utf8');
        
        // Преобразуем в Markdown
        const markdown = mdxToMarkdown(content);
        
        // Определяем путь для сохранения MD файла
        const relativePath = path.relative(path.join(process.cwd(), 'src', 'content'), dirPath);
        const outputFileName = item.replace('.mdx', '.md');
        const outputPath = path.join(outputBasePath, relativePath, outputFileName);
        
        // Создаем директории, если они не существуют
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Сохраняем MD файл
        fs.writeFileSync(outputPath, markdown);
        console.log(`Generated: ${outputPath}`);
      } catch (error) {
        console.error(`Error processing ${itemPath}:`, error);
      }
    }
  }
}

// Основная функция
function generateMarkdownFiles() {
  console.log('Generating Markdown files from MDX...');
  
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const outputDir = path.join(process.cwd(), 'public', 'markdown');
  
  // Создаем директорию для MD файлов, если она не существует
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Обрабатываем все MDX файлы
  processDirectory(contentDir, outputDir);
  
  console.log('Markdown generation completed!');
}

generateMarkdownFiles(); 