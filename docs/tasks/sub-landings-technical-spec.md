# Техническое задание: Реализация маркетинговых подлендингов

## 1. Описание проекта

Проект представляет собой лендинг SuperDuperAI, построенный на базе Next.js с поддержкой темной темы и локализованным контентом. Требуется дополнить проект системой подлендингов для различных инструментов (/tool) и кейсов (/case) с использованием contentlayer2 для управления MDX-контентом.

Используем новый форк https://github.com/timlrx/contentlayer2

## 2. Текущее состояние проекта

### 2.1. Структура проекта

- Проект построен на Next.js 15 с использованием App Router
- Компоненты лендинга размещены в `/src/components/landing/`
- Основной лендинг находится в `/src/app/page.tsx`
- В проекте отсутствует contentlayer2 для работы с MDX

### 2.2. Существующие страницы

- Главная страница `/`
- About `/about`
- Pricing `/pricing`
- Privacy `/privacy`
- Terms `/terms`

## 3. Цели

1. Интегрировать contentlayer2 для управления MDX-контентом
2. Создать систему подлендингов с роутингом и шаблонами
3. Реализовать два типа подлендингов:
   - `/tool` - подлендинги для инструментов (генератор картинок, видео, чатбот и т.п.)
   - `/case` - подлендинги для кейсов (фотографы, креаторы и т.п.)
4. Обеспечить SEO-оптимизацию подлендингов
5. Интегрировать с системой многоязычности

## 4. Технические требования

### 4.1. Установка и настройка contentlayer2

1. Установить необходимые пакеты:

```bash
pnpm add contentlayer2 next-contentlayer2 date-fns rehype-autolink-headings rehype-pretty-code rehype-slug remark-gfm
```

2. Добавить contentlayer2 в конфигурацию Next.js (`next.config.js`):

```javascript
const { withcontentlayer2 } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // существующая конфигурация
};

module.exports = withcontentlayer2(nextConfig);
```

3. Создать файл конфигурации contentlayer2 (`contentlayer2.config.ts`):

```typescript
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// Определение типа документа для Tool
export const Tool = defineDocumentType(() => ({
  name: "Tool",
  filePathPattern: "tool/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    icon: { type: "string", required: false },
    featured: { type: "boolean", required: false, default: false },
    seo: { type: "nested", of: SEO, required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/tool/${doc.slug}`,
    },
  },
}));

// Определение типа документа для Case
export const Case = defineDocumentType(() => ({
  name: "Case",
  filePathPattern: "case/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    category: { type: "string", required: true },
    image: { type: "string", required: false },
    featured: { type: "boolean", required: false, default: false },
    seo: { type: "nested", of: SEO, required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/case/${doc.slug}`,
    },
  },
}));

// SEO тип
const SEO = defineDocumentType(() => ({
  name: "SEO",
  fields: {
    title: { type: "string", required: false },
    description: { type: "string", required: false },
    keywords: { type: "list", of: { type: "string" }, required: false },
    ogImage: { type: "string", required: false },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Tool, Case],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "one-dark-pro",
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
```

### 4.2. Структура контента

1. Создать директорию для хранения MDX-контента:

```
src/
  content/
    tool/
      image-generator.mdx
      video-generator.mdx
      chatbot.mdx
    case/
      photographers.mdx
      creators.mdx
      marketers.mdx
```

2. Пример структуры MDX-файла для инструмента:

```mdx
---
title: "AI Image Generator"
description: "Create stunning images with our AI-powered generator"
date: 2023-10-15
slug: "image-generator"
icon: "image"
featured: true
seo:
  title: "AI Image Generator | SuperDuperAI"
  description: "Create stunning images instantly with our AI-powered image generator"
  keywords:
    - AI
    - image generator
    - AI art
---

# AI Image Generator

Create stunning images with our advanced AI technology.

<FeatureGrid>
  <Feature
    title="High Quality"
    description="Generate images in 4K resolution"
    icon="quality"
  />
  <Feature
    title="Fast"
    description="Get results in seconds"
    icon="speed"
  />
  <Feature
    title="Customizable"
    description="Fine-tune your results"
    icon="settings"
  />
</FeatureGrid>

## How It Works

Our image generator uses the latest AI models to create images from text descriptions.

<Steps>
  <Step
    number="1"
    title="Enter a prompt"
  >
    Describe what you want to create
  </Step>
  <Step
    number="2"
    title="Select style"
  >
    Choose from various artistic styles
  </Step>
  <Step
    number="3"
    title="Generate"
  >
    Get your image in seconds
  </Step>
</Steps>
```

### 4.3. Компоненты для MDX

1. Создать компоненты для использования в MDX:

   - `src/components/content/mdx-components.tsx` - компоненты для рендеринга MDX
   - `src/components/content/feature-grid.tsx` - сетка фич
   - `src/components/content/feature.tsx` - компонент фичи
   - `src/components/content/steps.tsx` - компонент шагов
   - `src/components/content/step.tsx` - компонент шага
   - `src/components/content/cta-box.tsx` - блок с призывом к действию

2. Пример реализации MDX-компонентов:

```typescript
// src/components/content/mdx-components.tsx
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { FeatureGrid } from './feature-grid';
import { Feature } from './feature';
import { Steps } from './steps';
import { Step } from './step';
import { CTABox } from './cta-box';

const components = {
  h1: ({ className, ...props }) => (
    <h1 className={`text-4xl font-bold mt-8 mb-4 ${className}`} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={`text-3xl font-bold mt-8 mb-4 ${className}`} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={`text-2xl font-bold mt-8 mb-4 ${className}`} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={`my-4 leading-7 ${className}`} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={`list-disc pl-6 my-4 ${className}`} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={`list-decimal pl-6 my-4 ${className}`} {...props} />
  ),
  FeatureGrid,
  Feature,
  Steps,
  Step,
  CTABox
};

interface MDXProps {
  code: string;
}

export function MDXContent({ code }: MDXProps) {
  const MDXComponent = useMDXComponent(code);
  return <MDXComponent components={components} />;
}
```

### 4.4. Роутинг и страницы

1. Создать страницы для подлендингов:

```typescript
// src/app/tool/[slug]/page.tsx
import { allTools } from 'contentlayer2/generated';
import { MDXContent } from '@/components/content/mdx-components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = allTools.find((tool) => tool.slug === params.slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.seo?.title || tool.title,
    description: tool.seo?.description || tool.description,
    keywords: tool.seo?.keywords || [],
  };
}

export async function generateStaticParams() {
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolPage({ params }: PageProps) {
  const tool = allTools.find((tool) => tool.slug === params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <article className="prose dark:prose-invert max-w-none">
        <MDXContent code={tool.body.code} />
      </article>
    </div>
  );
}
```

2. Аналогично создать страницу для кейсов:

```typescript
// src/app/case/[slug]/page.tsx
import { allCases } from "contentlayer2/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// ... аналогично ToolPage
```

3. Создать страницы-индексы для списков инструментов и кейсов:

```typescript
// src/app/tool/page.tsx
import { allTools } from 'contentlayer2/generated';
import Link from 'next/link';

export const metadata = {
  title: 'AI Tools | SuperDuperAI',
  description: 'Explore our advanced AI tools for content creation',
};

export default function ToolsPage() {
  const sortedTools = allTools.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <Link
            href={tool.url}
            key={`${tool.locale}-${tool.slug}`}
            className="card-block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### 4.5. Интеграция с многоязычностью

1. Расширить структуру контента для поддержки разных языков:

```
src/
  content/
    en/
      tool/
        image-generator.mdx
      case/
        photographers.mdx
    ru/
      tool/
        image-generator.mdx
      case/
        photographers.mdx
```

2. Обновить конфигурацию contentlayer2:

```typescript
// contentlayer2.config.ts
// ... существующие импорты

export const Tool = defineDocumentType(() => ({
  name: "Tool",
  filePathPattern: "{en,ru}/tool/**/*.mdx",
  contentType: "mdx",
  fields: {
    // ... существующие поля
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/tool/${doc.slug}`,
    },
  },
}));

export const Case = defineDocumentType(() => ({
  name: "Case",
  filePathPattern: "{en,ru}/case/**/*.mdx",
  contentType: "mdx",
  fields: {
    // ... существующие поля
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/case/${doc.slug}`,
    },
  },
}));

// ... остальной код
```

3. Обновить роутинг для поддержки многоязычности:

```typescript
// src/app/[lang]/tool/[slug]/page.tsx
import { allTools } from 'contentlayer2/generated';
import { MDXContent } from '@/components/content/mdx-components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = allTools.find(
    (tool) => tool.slug === params.slug && tool.locale === params.lang
  );

  if (!tool) {
    return {};
  }

  return {
    title: tool.seo?.title || tool.title,
    description: tool.seo?.description || tool.description,
    keywords: tool.seo?.keywords || [],
  };
}

export async function generateStaticParams() {
  const paths = [];

  for (const tool of allTools) {
    paths.push({
      lang: tool.locale,
      slug: tool.slug,
    });
  }

  return paths;
}

export default function ToolPage({ params }: PageProps) {
  const tool = allTools.find(
    (tool) => tool.slug === params.slug && tool.locale === params.lang
  );

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <article className="prose dark:prose-invert max-w-none">
        <MDXContent code={tool.body.code} />
      </article>
    </div>
  );
}
```

## 5. План реализации

1. **Этап 1: Настройка contentlayer2 (2 дня)**

   - Установка и настройка contentlayer2
   - Создание базовой конфигурации для типов документов
   - Настройка преобразования MDX

2. **Этап 2: Разработка компонентов для MDX (3 дня)**

   - Создание базовых MDX-компонентов
   - Разработка специальных компонентов (FeatureGrid, Steps, CTABox)
   - Стилизация компонентов

3. **Этап 3: Создание роутинга и страниц (2 дня)**

   - Разработка страниц для отдельных инструментов и кейсов
   - Создание индексных страниц для категорий
   - Настройка SEO-метаданных

4. **Этап 4: Интеграция многоязычности (2 дня)**

   - Обновление конфигурации contentlayer2 для поддержки локализации
   - Адаптация роутинга для многоязычности
   - Тестирование переключения между языками

5. **Этап 5: Наполнение контентом и тестирование (3 дня)**
   - Создание примеров MDX-контента
   - Тестирование всех функций
   - Оптимизация производительности

## 6. Ожидаемые результаты

1. Полностью функциональная система подлендингов на базе contentlayer2
2. Возможность создания и редактирования контента в формате MDX
3. Поддержка многоязычности для всех подлендингов
4. SEO-оптимизация для всех страниц
5. Единый стиль оформления, соответствующий основному лендингу

## 7. Критерии приемки

1. MDX-контент корректно отображается на всех типах подлендингов
2. Роутинг работает для всех языков и типов подлендингов
3. SEO-метаданные корректно генерируются для всех страниц
4. Компоненты для MDX поддерживают все необходимые функции
5. Система соответствует общему дизайну проекта
