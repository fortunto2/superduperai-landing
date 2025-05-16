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

### API маршрут

API-маршрут расположен в `src/app/api/markdown/[...params]/route.ts` и обрабатывает запросы вида `/api/markdown/[type]/[locale]/[slug].md`.

```typescript
// Основная функция преобразования MDX в Markdown
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

### Обработка запросов

API-маршрут принимает параметры из URL и использует их для поиска соответствующего MDX файла:

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

После нахождения файла, он преобразуется в Markdown и отправляется клиенту с соответствующими заголовками:

```typescript
// Преобразуем MDX в чистый Markdown
const markdown = await mdxToMarkdown(filePath);

// Устанавливаем заголовки для plaintext
const headers = new Headers();
headers.set("Content-Type", "text/markdown; charset=utf-8");
headers.set("Content-Disposition", `inline; filename="${slug}.md"`);

// Возвращаем содержимое файла
return new NextResponse(markdown, {
  status: 200,
  headers,
});
```

## Альтернативные подходы

### Использование библиотеки mdx-to-md

Изначально была попытка использовать библиотеку `mdx-to-md`, которая специализируется на преобразовании MDX в Markdown:

```typescript
import { mdxToMd } from "mdx-to-md";

// Преобразование MDX в Markdown
const markdown = await mdxToMd(filePath);
```

Однако эта библиотека пыталась выполнить MDX код, что приводило к ошибкам при отсутствии определенных компонентов:

```
Error serving markdown file: [Error: Expected component `PricingSection` to be defined: you likely forgot to import, pass, or provide it.]
```

### Преимущества текущего решения

1. **Независимость от компонентов** — не требует наличия определений компонентов
2. **Простота** — использует только стандартные модули Node.js
3. **Гибкость** — легко настраивается под конкретные компоненты проекта
4. **Производительность** — обработка происходит быстро, без выполнения кода

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
3. **Кеширование** — сохранение результатов преобразования для повышения производительности
4. **Конфигурируемость** — вынесение правил преобразования в конфигурационный файл
