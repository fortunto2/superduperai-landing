# Technical Specification: SuperDuperAI Multi-Landing Frontend

This document outlines the technical requirements, stack, and architecture for the `superduperai.co` multi-language landing page project.

## 1. Project Goal

- Develop a high-performance, SEO-optimized multi-landing page website (`superduperai.co`).
- Serve thousands of automatically generated, translated landing pages targeting specific user search queries (e.g., "AI video generation", "how to create custom avatar").
- Drive traffic and user acquisition for the main editor application (`editor.superduperai.co`).
- Include a main marketing landing page (based on `docs/marketing.md`) and a user-facing blog.
- Ensure content can be managed and updated automatically via API.

## 2. Technology Stack

- **Framework:** Next.js (v14+ with App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui (built on Radix UI & Tailwind CSS)
- **Styling:** Tailwind CSS v4.x
  - Используется новый пакет `@tailwindcss/postcss` вместо прямого плагина `tailwindcss`
  - В postcss.config.mjs должен использоваться формат `'@tailwindcss/postcss': {}`
  - Для CSS-переменных в tailwind.config.mjs использовать прямые ссылки на переменные CSS (var(--color))
  - Избегать использования директивы @apply с border-border и другими устаревшими классами
  - При проблемах с миграцией обращаться к официальной документации Tailwind CSS 4.x
- **Internationalization (i18n):** `next-intl` # под вопросом в самом конце сделать
- **Content Backend:** Strapi (v4/v5) - Headless CMS, API-first approach. Hosted separately.
- **Data Fetching (Strapi):** REST API or GraphQL (to be decided based on query complexity)
- **Analytics:** Google Analytics 4
- **Error Tracking:** Sentry
- **Linting/Formatting:** ESLint, Prettier
- **Package Manager:** yarn

## 3. Architecture & Core Concepts

- **Hosting:**
    - **Frontend (Next.js):** Static Site Generation (SSG) with `output: 'export'` or similar static export. Deployed to Cloudflare R2 or Cloudflare Pages for optimal performance and CDN benefits.
    - **Backend (Strapi):** Hosted independently (e.g., Docker on VPS, Render, Strapi Cloud). Must be scalable to handle API requests for potentially millions of content entries.
- **Content Flow (API-First):**
    - Content (articles, landing page sections, blog posts) originates from external services/editors.
    - Automated scripts/services handle:
        - Translation into ~100 target languages (using external APIs like DeepL, Google Translate, ChatGPT).
        - Pushing original content and translations to Strapi via its API, utilizing Strapi's built-in localization features.
    - Strapi acts as the structured content repository. The Strapi admin panel is used primarily for defining content types, managing API keys, and occasional manual checks, *not* for bulk content entry.
- **Routing & i18n:**
    - `next-intl` will manage internationalized routing (e.g., `/en/page-slug`, `/es/page-slug`). Locale detection via middleware.
    - Dedicated `messages/` directory for static UI translations (buttons, labels, etc.).
    - Dynamic page content fetched from Strapi based on the current locale.
- **Rendering Strategy:**
    - **Primary:** Static Site Generation (SSG - `getStaticProps` equivalent in App Router or `output: 'export'`). All pages are pre-rendered at build time by fetching data from Strapi. This ensures maximum performance and SEO-friendliness.
    - **Updates:** Trigger rebuilds of the Next.js site when significant content updates occur in Strapi (via webhooks or scheduled jobs). Incremental Static Regeneration (ISR) might be considered for specific sections if near real-time updates are needed, but SSG is preferred for cost and simplicity with R2 hosting.
- **SEO:**
    - Dynamically generate `<title>`, `meta description`, canonical tags, and Open Graph tags for each page based on Strapi content.
    - Implement JSON-LD structured data for relevant content types (Articles, Blog Posts).
    - Generate dynamic `sitemap.xml` based on available pages and locales in Strapi.
    - Ensure fast load times via SSG and optimized assets.
- **Authentication:**
    - **Not Required** on `superduperai.co`. User authentication (via Auth0) is handled exclusively within the `editor.superduperai.co` application.
- **External Integrations:**
    - **Strapi:** Core integration for all dynamic content.
    - **Google Analytics:** Track page views and user behavior.
    - **Sentry:** Monitor frontend errors.
    - **Translation Services API:** Used by automation scripts (external to this frontend project).
    - **Stripe:** No direct integration on the landing pages, but CTAs will link to the editor app where Stripe is used.

## 4. Project Structure

```
app/                      # Корневая папка приложения
└── src/                  # Основные исходные файлы
    ├── app/              # Next.js App Router (файлы и папки роутинга)
    │   ├── [locale]/     # Динамический сегмент для локализации (через next-intl)
    │   │   ├── (pages)/  # Группа роутов для стандартных/маркетинговых страниц (планируется)
    │   │   │   ├── layout.tsx # Общий layout для страниц в группе (планируется)
    │   │   │   ├── page.tsx   # Главная страница лендинга (планируется для `/[locale]`)
    │   │   │   ├── blog/    # Страница списка блог постов (планируется)
    │   │   │   └── [slug]/  # Динамический роут для под-лендингов/постов блога (планируется)
    │   │   │       └── page.tsx # Компонент страницы для slug (планируется)
    │   │   │
    │   │   ├── favicon.ico   # Иконка сайта
    │   │   ├── globals.css   # Глобальные стили Tailwind
    │   │   ├── layout.tsx    # Корневой layout приложения (включает Providers, Header, Footer)
    │   │   ├── page.tsx      # Главная страница приложения (реальная точка входа `/`)
    │   │   ├── sitemap.xml   # Динамическая карта сайта (обработчик роута)
    │   │   └── error.tsx     # Обработчик ошибок для роутов (планируется)
    │   │
    │   ├── components/       # Переиспользуемые React компоненты
    │   │   ├── blocks/       # Крупные секции страниц (Hero, Features, CTA и т.д.)
    │   │   ├── common/       # Мелкие общие компоненты (Analytics и т.д.)
    │   │   ├── content/      # Компоненты для рендеринга контента из CMS (планируется)
    │   │   ├── layout/       # Компоненты макета (Header, Footer, LanguageSelector)
    │   │   └── ui/           # Компоненты из shadcn/ui (автоматически генерируются)
    │   │
    │   ├── hooks/            # Пользовательские React хуки (пока пусто)
    │   │
    │   ├── lib/              # Утилиты, API клиенты, константы
    │   │   ├── i18n.ts       # Конфигурация/хелперы next-intl
    │   │   ├── seo.ts        # Функции для генерации метаданных
    │   │   ├── strapi.ts     # Функции для работы с Strapi API
    │   │   └── utils.ts      # Общие хелперы
    │   │
    │   ├── messages/         # Файлы переводов для next-intl (статичные тексты UI)
    │   │   ├── en.json
    │   │   └── es.json       # (+ другие языки по необходимости)
    │   │
    │   └── types/            # Определения TypeScript
    │       └── test-setup.d.ts # Определения для тестов
    │       # └── strapi.ts     # Типы для Strapi API (планируется добавить/сгенерировать)
    │
    public/                   # Статические ассеты (доступны напрямую по URL)
    │   ├── avatars/          # Аватары пользователей (для отзывов)
    │   ├── icons/            # Иконки (для фич, UI элементов)
    │   ├── images/           # Изображения (для секций, use cases)
    │   └── ...             # Другие файлы (next.svg, vercel.svg и т.д.)
    │
    scripts/                  # Вспомогательные скрипты
    └── check-code.sh     # Скрипт для проверки кода (lint, type-check)
    │
    tests/                    # Тесты
    └── smoke/            # Smoke-тесты
        └── app.test.tsx  # Тест главной страницы
    # Корневые файлы конфигурации:
    ├── .env.local                # Локальные переменные окружения (не коммитить!)
    ├── .eslintrc.json            # Конфиг ESLint
    ├── next.config.mjs           # Конфиг Next.js
    ├── middleware.ts             # Middleware для next-intl (обработка локалей)
    ├── package.json              # Зависимости и скрипты проекта
    ├── postcss.config.mjs        # Конфиг PostCSS
    ├── tailwind.config.ts        # Конфиг Tailwind CSS
    ├── tsconfig.json             # Конфиг TypeScript
    └── README.md                 # Описание проекта
```

## 5. Content Models (Strapi - High Level)

Strapi needs to be configured with appropriate Content Types. Key examples:

- **LandingPage:**
    - `slug` (string, unique, required)
    - `title` (string, localized, required)
    - `metaDescription` (text, localized)
    - `contentBlocks` (Dynamic Zones - allowing flexible composition using shared components like Hero, FeatureList, Testimonials, RichText, CTA)
    - `relatedSocialLinks` (Component/Repeatable: platform [X, YT, IG, TT], url)
    - ... (other SEO fields: canonicalUrl, openGraphImage, etc.)
- **BlogPost:**
    - `slug` (string, unique, required)
    - `title` (string, localized, required)
    - `publishDate` (datetime)
    - `author` (relation to Users, optional)
    - `excerpt` (text, localized)
    - `content` (Rich Text, localized)
    - `featuredImage` (media)
    - `metaDescription` (text, localized)
    - `relatedSocialLinks` (Component/Repeatable)
    - ... (other SEO fields)
- **Shared Components (within Strapi):**
    - Hero (title, subtitle, ctaButtonText, ctaButtonLink, backgroundImage)
    - FeatureItem (icon, title, description)
    - Testimonial (quote, authorName, authorTitle, authorImage)
    - CTA (title, text, buttonText, buttonLink)
    - RichText (standard markdown/rich text editor)

## 6. Key Implementation Details

- **Strapi API Client (`lib/strapi.ts`):** Create typed functions for fetching data. Handle localization parameters. Implement error handling and potentially caching.
- **Dynamic Page Generation (`app/[locale]/[slug]/page.tsx`):**
    - Use `generateStaticParams` to get all possible `locale` + `slug` combinations from Strapi at build time.
    - The page component will fetch specific page data from Strapi based on the `locale` and `slug` params.
- **Shadcn/ui:** Initialize using the CLI tool and integrate components. Customize theme to match brand.
- **ESLint/Prettier:** Configure strict rules and integrate into the development workflow (e.g., pre-commit hooks).
- **Environment Variables:** Manage all external service URLs, API keys, and IDs securely.
- **Deployment Pipeline:** Set up CI/CD (e.g., GitHub Actions) to automatically build and deploy the Next.js app to Cloudflare upon code changes or triggered by Strapi webhooks.
- **Development Flow:** Use pnpm for all package management operations.

## 7. Non-Functional Requirements

- **Performance:** Target high Lighthouse scores (Performance > 90, SEO > 95). Optimize images and assets.
- **Scalability:** Frontend scales automatically due to static hosting. Strapi backend needs appropriate resource allocation.
- **Maintainability:** Clean, well-documented code. Consistent project structure. Type safety with TypeScript.
- **Security:** Use API tokens for Strapi. Sanitize user inputs if any interactive elements are added later. Keep dependencies updated using `pnpm update -i`.

## 8. Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production (static export)
pnpm build

# Lint code
pnpm lint

# Format code with Prettier
pnpm format

# Check types
pnpm type-check
```

## 9. Конфигурация Tailwind CSS 4.x

Правильная настройка Tailwind CSS 4.x критична для работы проекта:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  // ...
  theme: {
    // ...
    extend: {
      colors: {
        // Правильный формат для Tailwind CSS 4.x
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Вместо устаревшего формата var(--color-border)
      },
    },
  },
  // ...
};
```

В CSS избегайте использования устаревших классов через директивы @apply:

```css
/* ❌ Плохо - может вызвать ошибку в Tailwind CSS 4.x */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
}

/* ✅ Хорошо - использование прямых CSS-свойств */
* {
  border-color: var(--border);
  outline-color: rgb(var(--ring) / 0.5);
}
```

## 10. CI/CD Considerations

- **Build Process:**
  ```yaml
  # Example GitHub Actions step
  - name: Build Next.js site
    run: |
      pnpm install --frozen-lockfile
      pnpm build
  ```

- **Deployment to Cloudflare:**
  - Automate deployment to Cloudflare R2 or Pages after successful build
  - Configure proper caching and CDN settings for optimal performance

## 11. UI Testing & Documentation

- Для всех UI-компонентов обязательно использовать Storybook для визуальной документации и демонстрации всех вариантов (states, edge cases).
- Для компонентов с логикой, пользовательскими сценариями, интеграциями — обязательно писать **простые** unit-тесты (Jest + React Testing Library). Не делать избыточных тестов — только ключевые сценарии и smoke-тесты.
- Для страниц — обязательно smoke-тесты (минимум: страница рендерится без ошибок).
- Для сложных пользовательских сценариев — e2e-тесты (Playwright).
- Storybook — must have для всех маркетинговых и визуальных блоков.
- Все новые компоненты должны сопровождаться Storybook stories и тестами (если есть логика).
- Визуальные тесты (Chromatic) — по согласованию с командой.
- **TDD** можно использовать там, где это действительно ускоряет и упрощает разработку, но не является обязательным.

## Пример:
- Hero, Features, Testimonials, CTA — обязательно должны иметь stories в Storybook.
- Любой компонент с обработкой событий, кастомными хуками, интеграцией с API — должен иметь unit-тесты.

## Обоснование:
- Storybook ускоряет разработку, ревью и коммуникацию с дизайнерами.
- Unit-тесты защищают от регрессий и ошибок в логике.
- Такой подход — стандарт для современных frontend-проектов.

## 12. Установка и обновление компонентов shadcn/ui

### Установка новых компонентов

Чтобы установить новые компоненты из библиотеки shadcn/ui, используйте следующую команду:

```bash
# Установка нового компонента
npx shadcn@latest add <component-name>

# Пример установки компонента button
npx shadcn@latest add button --overwrite
```

Для перезаписи уже существующих компонентов используйте флаг `--overwrite`:

```bash
# Перезапись существующего компонента
npx shadcn@latest add button --overwrite
```

### Особенности для Next.js 15 и React 19

В нашем проекте используется Next.js 15 и React 19, поэтому убедитесь, что:

1. Используется последняя версия CLI `shadcn@latest` 
2. При возникновении конфликтов версий, всегда используйте флаг `--overwrite`
3. После установки компонента проверьте синтаксис кода и наличие точек с запятой (может отличаться от остального кода проекта)

### Поддержка Tailwind CSS 4.x

При использовании компонентов shadcn/ui с Tailwind CSS 4.x:

1. Убедитесь, что компоненты используют правильный синтаксис для CSS-переменных (`var(--variable)`)
2. В случае проблем с совместимостью, проверьте официальную документацию Tailwind CSS 4.x и shadcn/ui

### Структура компонентов

Все компоненты shadcn/ui устанавливаются в директорию `src/components/ui/`. После установки их можно импортировать следующим образом:

```tsx
import { Button } from "@/components/ui/button";

// Использование в компоненте
export default function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

### Customization

Установленные компоненты можно и нужно кастомизировать под требования проекта:

1. Добавляйте новые варианты в существующие компоненты через `buttonVariants` или аналогичные переменные
2. Модифицируйте CSS-классы в определении компонента
3. Используйте `cn()` утилиту для объединения классов

### Проверка компонентов

После установки компонентов обязательно:

1. Запустите проект (`pnpm dev`) и проверьте отображение компонента
2. Проверьте все варианты и размеры компонента
3. Убедитесь, что компонент корректно выглядит на мобильных устройствах
4. Добавьте story в Storybook для документации компонента (если используется)

# Технический стек и требования к фронтенду

## Основной стек

- **Next.js 15+** - React-фреймворк для разработки
- **React 19+** - Библиотека UI
- **Tailwind CSS** - Utility-first CSS фреймворк
- **TypeScript** - Типизация кода
- **shadcn/ui** - Библиотека UI-компонентов

## Требования и стандарты

### Общие требования

- Писать чистый и понятный код, следуя принципам SOLID
- Использовать TypeScript для всех компонентов и функций
- Документировать сложные части кода и интерфейсы
- Следовать правилам форматирования кода (Prettier + ESLint)
- Избегать использования директивы @apply с border-border и другими устаревшими классами
- Обязательно писать юнит-тесты для утилит и хуков

### Tailwind CSS и стили

#### Использование CSS-переменных и цветов

- Использовать CSS-переменные для всех глобальных стилей (цвета, размеры, отступы)
- Для CSS-переменных в tailwind.config.mjs использовать формат `hsl(var(--color-name))` вместо `var(--color-name)`
- Никогда не использовать директиву `@apply` с составными именами классов, такими как `border-border` или `bg-background`
- Для компонентов со сложными стилями предпочтительнее использовать обычный CSS внутри `@layer components`

**Правильно:**
```css
/* В tailwind.config.mjs */
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))"
}

/* В globals.css */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

**Неправильно:**
```css
/* В tailwind.config.mjs */
colors: {
  border: "var(--border)",
  background: "var(--background)"
}

/* В globals.css */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### Структура стилей

- Использовать модульный подход к стилизации компонентов
- Глобальные стили размещать только в `globals.css`
- Стили компонентов организовывать через `@layer components` в глобальных стилях

### React/Next.js

- Использовать функциональные компоненты и хуки
- Применять Server Components, где это возможно
- Использовать App Router для маршрутизации
- Обеспечивать правильную мемоизацию с React.memo, useMemo, useCallback

### Библиотеки компонентов

- Основная библиотека UI-компонентов: shadcn/ui
- Устанавливать компоненты из библиотеки через CLI:
  ```bash
  npx shadcn-ui@latest add button
  ```
- При необходимости кастомизации компонентов, создавать обертки над существующими
- Не изменять стандартные компоненты библиотеки без крайней необходимости

### Структура проекта

```
app/
├── .next/                   # Next.js build output
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/
│   ├── app/                 # App Router
│   │   ├── globals.css      # Глобальные стили Tailwind
│   │   ├── layout.tsx       # Корневой лейаут
│   │   └── page.tsx         # Главная страница
│   ├── components/          # Компоненты React
│   │   ├── blocks/          # Блоки страниц
│   │   ├── common/          # Общие компоненты
│   │   ├── layout/          # Лейауты и сетки
│   │   └── ui/              # UI-компоненты
│   ├── hooks/               # React хуки
│   ├── lib/                 # Утилиты и хелперы
│   ├── services/            # Сервисы для API
│   ├── stores/              # Состояние приложения
│   └── utils/               # Полезные функции
├── tailwind.config.ts       # Конфиг Tailwind CSS
├── tsconfig.json            # Конфиг TypeScript
├── package.json             # Зависимости и скрипты
└── next.config.mjs          # Конфиг Next.js
```

## Инструменты для разработки

- **VS Code** - основная IDE
- **ESLint + Prettier** - линтинг и форматирование
- **Jest + React Testing Library** - тестирование
- **Vercel** - деплой и хостинг

## Оптимизация и производительность

- Использовать изображения в формате WebP/AVIF через next/image
- Минимизировать клиентский JavaScript
- Оптимизировать шрифты и иконки
- Использовать динамический импорт и ленивую загрузку
- Следить за размером бандла через анализаторы

## Доступность (a11y)

- Обеспечивать правильную семантику HTML
- Поддерживать навигацию с клавиатуры
- Использовать ARIA-атрибуты, где необходимо
- Обеспечивать достаточный контраст текста и фона
- Тестировать с помощью инструментов, таких как axe

## Пример использования Tailwind с CSS-переменными

```tsx
// tailwind.config.mjs
const config = {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        background: "hsl(var(--background))"
      }
    }
  }
}

// globals.css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --secondary: 210 40% 96.1%;
    --background: 0 0% 100%;
  }
  
  .dark {
    --primary: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --background: 222.2 84% 4.9%;
  }
  
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--primary));
  }
}

// Component.tsx
export function Button() {
  return (
    <button className="bg-primary text-white">
      Click me
    </button>
  )
}
```
