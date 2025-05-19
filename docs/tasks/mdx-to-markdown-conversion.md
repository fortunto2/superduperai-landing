# Преобразование MDX в чистый Markdown

## Обзор

В проекте SuperDuperAI Landing реализован механизм для преобразования MDX файлов в чистый Markdown при просмотре исходного кода контента. Это позволяет пользователям видеть содержимое файлов без JSX компонентов, заменяя их на текстовое представление.

## Проблема

MDX файлы содержат JSX компоненты, которые при просмотре исходного кода выглядят как XML-теги:

```mdx
<FeatureGrid>
  <Feature
    title="Specialized AI Agents"
    description="Each task handled by an AI expert trained for that specific role"
    icon="settings"
  />
  <Feature
    title="Creative Control"
    description="You direct the vision while AI handles technical execution"
    icon="edit"
  />
</FeatureGrid>
```

Это затрудняет чтение и понимание контента, особенно для редакторов и контент-менеджеров, которые не знакомы с JSX синтаксисом.

## Решение

Реализован API-маршрут, который преобразует MDX в чистый Markdown с помощью регулярных выражений. Основные преобразования:

1. Сохранение frontmatter (метаданных в начале файла)
2. Удаление импортов и экспортов
3. Извлечение заголовков и описаний из компонентов
4. Обработка вложенных компонентов
5. Удаление оставшихся JSX тегов и выражений

## Техническая реализация

### Функция преобразования

Основная функция преобразования MDX в Markdown расположена в `src/app/api/markdown/[...params]/route.ts`:

```typescript
async function mdxToMarkdown(filePath: string): Promise<string> {
  // Читаем содержимое файла
  const content = fs.readFileSync(filePath, "utf8");

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

  // Удаляем фигурные скобки с выражениями
  markdown = markdown.replace(/\{[^{}]*\}/g, "");

  // Удаляем лишние пустые строки
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  // Возвращаем frontmatter на место
  return frontmatter + markdown;
}
```

### API маршрут

API-маршрут обрабатывает запросы вида `/api/markdown/[type]/[locale]/[slug].md`:

```typescript
// Извлекаем параметры из пути
const type = urlParams[0]; // тип (tool, case, page)
const locale = urlParams[1]; // локаль (en, ru)
const slug = urlParams[2].replace(/\.md$/, ""); // slug без расширения .md

// Строим путь к файлу
const filePath = path.join(
  process.cwd(),
  "src",
  "content",
  type,
  locale,
  `${slug}.mdx`
);
```

## Предварительная генерация MD файлов

Для оптимизации производительности реализована предварительная генерация MD файлов при сборке проекта. Это позволяет:

1. **Снизить нагрузку на сервер** — не нужно выполнять преобразование при каждом запросе
2. **Улучшить скорость ответа** — статические файлы отдаются быстрее
3. **Эффективно кэшировать** — статические файлы хорошо кэшируются на CDN

### Скрипт генерации

Скрипт `scripts/generate-markdown.js` запускается автоматически после сборки проекта через `postbuild` хук в `package.json`:

```json
"scripts": {
  "postbuild": "node scripts/generate-markdown.js"
}
```

Скрипт рекурсивно обходит все MDX файлы в директории `src/content`, преобразует их в Markdown и сохраняет в соответствующих поддиректориях в `public/markdown/`:

```javascript
function generateMarkdownFiles() {
  console.log("Generating Markdown files from MDX...");

  const contentDir = path.join(process.cwd(), "src", "content");
  const outputDir = path.join(process.cwd(), "public", "markdown");

  // Создаем директорию для MD файлов, если она не существует
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Обрабатываем все MDX файлы
  processDirectory(contentDir, outputDir);

  console.log("Markdown generation completed!");
}
```

### Интеграция с API

API-маршрут модифицирован для проверки наличия предварительно сгенерированного файла:

```typescript
// Сначала проверяем, есть ли предварительно сгенерированный MD файл
const preGeneratedPath = path.join(
  process.cwd(),
  "public",
  "markdown",
  type,
  locale,
  `${slug}.md`
);

let markdown;

if (fs.existsSync(preGeneratedPath)) {
  // Если предварительно сгенерированный файл существует, используем его
  markdown = fs.readFileSync(preGeneratedPath, "utf8");
} else {
  // Если нет, генерируем на лету
  // ... код преобразования MDX в MD ...
}
```

Это обеспечивает надежную работу системы даже при добавлении новых MDX файлов между деплоями.

## Примеры преобразования

### Исходный MDX

```mdx
---
title: "About SuperDuperAI - Our Mission and Team"
description: "Learn about SuperDuperAI's mission, technology, and vision."
---

import { CTABox } from "@/components/ui/cta-box";

# About SuperDuperAI

<FeatureGrid>
  <Feature
    title="Mission-Driven"
    description="Creating technology that expands human capabilities."
    icon="star"
  />
  <Feature
    title="AI Excellence"
    description="Pushing the boundaries of what's possible with generative AI."
    icon="sparkles"
  />
</FeatureGrid>

## Our Mission

Our mission is to innovate responsibly by creating technology solutions.

<CTABox>Schedule a demo today!</CTABox>
```

### Результат преобразования

```markdown
---
title: "About SuperDuperAI - Our Mission and Team"
description: "Learn about SuperDuperAI's mission, technology, and vision."
---

# About SuperDuperAI

### Mission-Driven

Creating technology that expands human capabilities.

### AI Excellence

Pushing the boundaries of what's possible with generative AI.

## Our Mission

Our mission is to innovate responsibly by creating technology solutions.

Schedule a demo today!
```

## Интеграция с системой просмотра Markdown

Данное решение интегрировано с существующей системой просмотра исходного Markdown, описанной в [markdown-viewer-implementation.md](./markdown-viewer-implementation.md). Пользователи могут просматривать исходный Markdown, добавляя `.md` в конце URL или используя Ctrl+клик на ссылках.

## Дальнейшие улучшения

1. **Расширенная поддержка компонентов** — добавление обработки для других типов компонентов
2. **Локализация заголовков** — адаптация заголовков под выбранный язык
3. **Кеширование** — дополнительное кэширование для повышения производительности
4. **Конфигурируемость** — вынесение правил преобразования в конфигурационный файл
5. **Инкрементальная генерация** — обновление только изменившихся файлов при сборке
