# Техническое задание: Реализация динамических OpenGraph и метаданных в Next.js

## Цель проекта

Разработать комплексную систему SEO-метаданных и динамических OpenGraph изображений для всех разделов сайта SuperDuperAI. Система должна обеспечивать корректные метаданные и уникальные, брендированные изображения для различных типов страниц, улучшая представление сайта в поисковых системах, социальных сетях и мессенджерах.

## Требования

### I. Метаданные

1. Разработать универсальный набор метаданных для всех типов страниц
2. Обеспечить поддержку SEO-оптимизации, OpenGraph и Twitter Cards
3. Реализовать динамическое формирование метаданных на основе контента страницы
4. Внедрить правильные структурированные данные (Schema.org)
5. Обеспечить работоспособность в соответствии с требованиями Next.js 15

### II. OpenGraph изображения

1. Централизованный API-эндпоинт для генерации OG-изображений
2. Уникальный визуальный стиль для каждого типа страницы
3. Динамическая интеграция контента страницы в OG-изображения
4. Оптимизация производительности и кэширование

## Спецификация компонентов

### 1. Библиотека метаданных

Создать библиотеку `metadata.ts`, которая должна:
- Определять типы страниц (home, page, tool, case)
- Генерировать базовые метаданные (title, description)
- Формировать расширенные SEO-метаданные (canonical URL, robots)
- Генерировать OpenGraph и Twitter метаданные
- Формировать структурированные данные по Schema.org
- Обеспечивать возможность переопределения метаданных для конкретных страниц

Структура базовых метаданных:
```typescript
{
  title: string;
  description: string;
  keywords?: string[];
  authors?: Author[];
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
  };
}
```

### 2. Генератор OpenGraph метаданных

Разработать функцию `generateOpenGraph`, которая должна:
- Принимать базовые метаданные и тип страницы
- Формировать объект OpenGraph метаданных в соответствии со стандартом
- Генерировать URL для динамических OG-изображений
- Добавлять дополнительные OpenGraph метаданные (og:type, og:locale и т.д.)

Структура OpenGraph метаданных:
```typescript
{
  title: string;
  description: string;
  url: string;
  siteName: string;
  images: [
    {
      url: string;
      width: number;
      height: number;
      alt: string;
    }
  ];
  locale: string;
  type: 'website' | 'article' | 'product';
}
```

### 3. Генератор OG-изображений

Разработать библиотеку `generate-og-image.tsx` со следующими функциями:
- Генерация изображений размером 1200×630 пикселей
- Поддержка параметров: заголовок, описание, категория, тип страницы
- Уникальные градиенты фона в зависимости от типа страницы
- Адаптивный размер текста с обрезкой длинных описаний
- Брендированные элементы в соответствии с дизайн-системой

### 4. API-маршрут для OG-изображений

Реализовать Edge API-маршрут `/api/og`, который должен:
- Принимать параметры через URL: title, description, pageType, category
- Генерировать соответствующее изображение с правильным градиентом
- Корректно обрабатывать ошибки и предоставлять запасной вариант
- Поддерживать кэширование

### 5. Интеграционный слой

Создать функцию-хелпер `createMetadata`, которая:
- Принимает базовые метаданные и параметры страницы
- Объединяет все типы метаданных в единый объект
- Совместима с системой метаданных Next.js 15
- Поддерживает как статические, так и динамические метаданные

## Подключение метаданных к страницам

### Статические метаданные

Для страниц с статическими метаданными следует использовать объект `metadata`:

```typescript
// src/app/about/page.tsx
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'About Our Company',
  description: 'Learn more about SuperDuperAI and our mission',
  pageType: 'page'
});

export default function AboutPage() {
  // ...
}
```

### Динамические метаданные

Для динамических страниц использовать функцию `generateMetadata`:

```typescript
// src/app/tool/[slug]/page.tsx
import { createMetadata } from '@/lib/metadata';
import { getToolBySlug } from '@/lib/tools';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  
  return createMetadata({
    title: tool.title,
    description: tool.description,
    pageType: 'tool',
    category: 'Tool'
  });
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  // ...
}
```

## Типы страниц и их метаданные

1. **Главная страница**: 
   - Метаданные: основной заголовок сайта, ключевое описание продукта
   - OG-изображение: градиент красно-пурпурный
   - Schema.org: Organization, WebSite

2. **Статические страницы** (`/about`, `/privacy` и т.д.): 
   - Метаданные: название страницы, описание раздела
   - OG-изображение: градиент сине-розовый
   - Schema.org: WebPage

3. **Страницы инструментов** (`/tool/[slug]`): 
   - Метаданные: название инструмента, описание возможностей
   - OG-изображение: градиент сине-фиолетовый
   - Schema.org: Product, SoftwareApplication

4. **Кейсы** (`/case/[slug]`): 
   - Метаданные: название кейса, краткое описание результатов
   - OG-изображение: градиент зелено-синий
   - Schema.org: Article, Case

## Тестирование метаданных

### Инструменты для тестирования

1. Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
2. Twitter Card Validator: https://cards-dev.twitter.com/validator
3. LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
4. Schema.org Validator: https://validator.schema.org/
5. Google Rich Results Test: https://search.google.com/test/rich-results

### Тестовые URL для OG-изображений

- Главная страница: `/api/og?title=SuperDuperAI&description=AI%20Video%20Generation&pageType=home`
- Инструмент: `/api/og?title=Video%20Editor&description=Powerful%20AI%20Video%20Editor&pageType=tool&category=Tool`
- Кейс: `/api/og?title=Startup%20Success&description=How%20startup%20X%20uses%20our%20AI&pageType=case&category=Startup`

## Технические требования

- Использовать API `ImageResponse` из пакета `next/og` для генерации изображений
- Интегрировать метаданные с использованием Metadata API из Next.js 15
- Размер OG-изображений: 1200×630 пикселей (стандарт для Open Graph)
- Поддерживать динамическую обрезку длинных описаний
- Обеспечить корректное формирование URL-параметров с экранированием специальных символов
- Оптимизировать для работы в Next.js 15 с Turbopack
- Обеспечить совместимость со сборкой Cloudflare через @opennextjs/cloudflare

## Примеры кода

### Пример библиотеки metadata.ts

```typescript
// src/lib/metadata.ts
import { Metadata } from 'next';

export type PageType = 'home' | 'page' | 'tool' | 'case';

interface MetadataParams {
  title: string;
  description: string;
  pageType: PageType;
  category?: string;
  image?: string;
}

export function createMetadata({
  title,
  description,
  pageType,
  category,
  image
}: MetadataParams): Metadata {
  const ogImage = image || `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&pageType=${pageType}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: pageType === 'tool' ? 'product' : pageType === 'case' ? 'article' : 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}
```

### Пример API-маршрута

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getGradientByPageType } from '@/lib/metadata';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'SuperDuperAI';
    const description = searchParams.get('description') || 'AI-powered video generation';
    const pageType = searchParams.get('pageType') || 'home';
    const category = searchParams.get('category');
    
    const gradient = getGradientByPageType(pageType as PageType);
    
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: gradient,
            padding: '40px',
          }}
        >
          {category && (
            <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 16 }}>
              {category}
            </div>
          )}
          <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 24 }}>
            {title}
          </div>
          <div style={{ fontSize: 36, opacity: 0.9 }}>
            {description}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
```

## Полезные ссылки и ресурсы

- [Документация Next.js по метаданным](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [OpenGraph протокол](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Документация Next.js по OG-изображениям](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Schema.org](https://schema.org/docs/schemas.html) 