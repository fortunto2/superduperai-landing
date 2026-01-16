# SuperDuperAI Coding Rules

## Технический стек и ограничения
- Next.js 15.3 с Turbopack и App Router
- TypeScript обязателен для всех файлов
- Tailwind CSS 4.x для стилизации
- React Server Components по умолчанию (используйте "use client" только при необходимости)
- Cloudflare Workers с @opennextjs/cloudflare (НЕ Cloudflare Pages)

## Основные правила кодирования

### Общие принципы
- Следуйте структуре проекта, размещайте новые файлы в соответствующих директориях
- Придерживайтесь принципа DRY (Don't Repeat Yourself)
- Избегайте добавления новых зависимостей, если не обязательно
- Оптимизируйте производительность (минимизируйте JS bundle, используйте Server Components)

### Компоненты и стилизация
- Используйте темную тему (#0F172A фон, #ADFF2F акцент)
- Для ссылок ВСЕГДА используйте:
  ```tsx
  import { default as Link } from '@/components/ui/optimized-link';
  ```
- Используйте shadcn/ui и custom компоненты из `/components/ui`
- Все компоненты должны быть доступны (WCAG 2.1 AA)
- Компоненты лендинга должны быть в `/components/landing/`
- MDX-компоненты должны быть в `/components/content/`

### Оптимизация и SEO
- Каждая страница должна иметь метатеги через Next.js metadata API
- Используйте структурированные данные Schema.org
- Оптимизируйте изображения через next/image
- Все статические страницы должны иметь настройки:
  ```ts
  export const dynamic = 'force-static';
  export const revalidate = false;
  ```

### ContentLayer и MDX
- Не используйте клиентские компоненты в MDX напрямую
- Создавайте обертки для клиентских компонентов
- Соблюдайте схему данных ContentLayer для Tool, Case, Page
- Не используйте вложенные компоненты в MDX
- MDX-контент размещайте в `/src/content/`

### Cloudflare деплой
- Оптимизируйте размер бандлов (лимит 3 МБ на Worker)
- Используйте API-роуты для динамического контента
- Не используйте функции Next.js, несовместимые с Cloudflare (Edge, ISR)

### Производительность
- Оптимизируйте для Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- Используйте SSR только где необходимо
- Lazy load для тяжелых компонентов ниже первого экрана
- Префетч для критичных ресурсов

## Ссылки на документацию
- Полный PRD: [[docs/product_requirements_updated.md]]
- Руководство по ContentLayer: [[docs/tasks/contentlayer-integration.md]]
- SEO-стратегия: [[docs/seo/keywords.md]]
- Чеклист тестирования: [[docs/tasks/testing-checklist.md]] 

## Структура проекта

```
SuperDuperAI/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # Locale-based routing
│   │   │   ├── (landing)/       # Route group for landing pages
│   │   │   │   ├── layout.tsx   # Layout for landing pages
│   │   │   │   └── page.tsx     # Main landing page component
│   │   │   ├── layout.tsx       # Layout for localized routes
│   │   │   ├── not-found.tsx    # Custom 404 page
│   │   │   ├── sitemap.ts       # Sitemap generation
│   │   │   └── template.tsx     # Template for localized routes
│   │   ├── api/                 # API endpoints
│   │   ├── favicon.ico          # Favicon
│   │   ├── globals.css          # Global CSS styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── opengraph-image.tsx  # OpenGraph image generation
│   │   └── page.tsx             # Root page
│   ├── components/              # React components
│   │   ├── content/             # Components for MDX content
│   │   ├── landing/             # Components for the landing page
│   │   └── ui/                  # General UI components
│   ├── config/                  # Configuration files
│   │   ├── dictionaries/        # i18n dictionaries
│   │   ├── i18n-config.ts       # i18n configuration
│   │   └── site.ts              # Site-wide configuration
│   ├── content/                 # Content collections for Contentlayer
│   │   ├── blog/                # Blog posts
│   │   ├── case/                # Case studies
│   │   ├── docs/                # Documentation pages
│   │   ├── homes/               # Home page content
│   │   ├── pages/               # Static pages
│   │   └── tool/                # Tool pages
│   ├── hooks/                   # Custom React hooks
│   │   └── use-translation.ts   # Hook for translations
│   ├── lib/                     # Library functions and utilities
│   │   ├── constants.ts         # Project constants
│   │   ├── generate-og-image.tsx # OG image generation utility
│   │   ├── get-dictionary.ts    # Function to get i18n dictionaries
│   │   ├── get-valid-locale.ts  # Function to validate locales
│   │   ├── metadata.ts          # Metadata generation utilities
│   │   ├── user-identifier.ts   # User identification logic
│   │   └── utils.ts             # General utility functions
│   ├── middleware.ts            # Next.js middleware
│   ├── tests/                   # Test files
│   └── types/                   # TypeScript type definitions
│       └── translation.d.ts   # Types for translations
├── public/                      # Static assets
│   ├── images/                  # Images
│   ├── markdown/                # Raw markdown files (if any)
│   ├── llms.txt                 # LLM instructions file
│   └── robots.txt               # Robots.txt file
├── docs/                        # Project documentation
│   ├── api/                     # API documentation
│   ├── seo/                     # SEO documentation
│   └── tasks/                   # Task descriptions
├── scripts/                     # Node.js scripts
├── .contentlayer/               # Generated files from Contentlayer
├── .next/                       # Next.js build output
└── ... (config files)           # Configuration files
```

## Дерево документации SuperDuperAI

### 1. Основные требования и концепция
- [[docs/product_requirements_updated.md|Полный PRD]] - главный документ проекта
  - **Ключевые концепции**: Vibe Filmmaking, Agent-Director Paradigm
  - **Целевая аудитория**: Контент-креаторы, Маркетологи, Музыканты, Малый бизнес
  - **Структура лендинга**: Hero, Features, How it Works, Use Cases, Testimonials, CTA

- [[docs/project_quick_reference.md|Краткий справочник]] - концентрированная версия для быстрого доступа
  - **Технический стек**: Next.js 15.3, TypeScript, Tailwind CSS, ContentLayer
  - **Текущий статус**: что готово, что в процессе, что запланировано
  - **Команды разработки**: pnpm install, pnpm dev, pnpm lint, pnpm build, pnpm preview

### 2. Технические руководства и правила

#### 2.1 Кодовая база
- [[.cursor/rules/superduperai.md|Правила разработки Cursor]] - правила для AI-кодинга
  - **Технический стек и ограничения**: Next.js, TypeScript, Tailwind, Server Components
  - **Компоненты и стилизация**: темная тема, оптимизированные ссылки
  - **Производительность**: Core Web Vitals, Lazy loading, SSR

#### 2.2 Инфраструктура и деплой
- [[docs/tasks/cloudflare-deployment.md|Деплой на Cloudflare]] - настройка Cloudflare Worker
  - **Важно**: использовать OpenNext + Workers, не Pages!
  - **Ограничения**: лимит 3 МБ на Worker
  - **Статические страницы**: настройки force-static и revalidate: false

#### 2.3 Контент-менеджмент
- [[docs/tasks/contentlayer-integration.md|Интеграция ContentLayer]] - настройка и использование MDX
  - **Схемы документов**: Tool, Case, Page, Home
  - **Правила MDX**: избегать клиентских компонентов, не вкладывать компоненты
  - **Структура контента**: /src/content/tool/, /case/, /pages/

### 3. SEO и маркетинг

#### 3.1 SEO-стратегия
- [[docs/seo/keywords.md|Стратегия ключевых слов]] - оптимизация под поисковые системы
  - **Метатеги**: уникальные для каждой страницы
  - **Schema.org**: разметка для разных типов контента
  - **OpenGraph**: генерация изображений для соцсетей

- [[docs/seo/metadata-guide.md|Руководство по метаданным]] - настройка метаданных страниц
  - **Оптимальная длина**: title (50-60 символов), description (120-155 символов)
  - **Иерархия заголовков**: H1 → H2 → H3

- [[docs/seo/schema-org-guide.md|Руководство по Schema.org]] - структурированные данные
  - **Типы разметки**: Organization, WebSite, Product, Article

#### 3.2 Маркетинговые материалы
- [[docs/marketing.md|Маркетинговая стратегия]] - материалы для продвижения
  - **Основной месседж**: "Turn Vibes into Videos – Instantly"
  - **Точки боли**: ограниченные ресурсы, сложность традиционных инструментов
  - **Отзывы**: "We saved weeks", "My music video, no budget, huge vibe"

#### 3.3 Аналитика
- [[docs/analytics.md|Аналитика и метрики]] - отслеживание эффективности
  - **Бизнес-метрики**: конверсия > 3%, время на сайте > 2 минуты
  - **Технические метрики**: PageSpeed > 90, Core Web Vitals в зеленой зоне
  - **Настройка**: Google Analytics 4, Search Console

### 4. Тестирование и оптимизация
- [[docs/tasks/testing-checklist.md|Чеклист тестирования]] - проверка перед запуском
  - **Устройства**: мобильные (320-480px), планшеты (481-768px), десктопы (769px+)
  - **Доступность**: WCAG 2.1 AA, контраст, клавиатурная навигация
  - **Производительность**: LCP < 2.5s, CLS < 0.1, FID < 100ms

### 5. Справочные материалы
- [[docs/saas.md|SaaS бизнес-модель]] - информация по модели подписки
  - **Тарифные планы**: Free, Pro, Team, Enterprise
  - **Ценообразование**: экономия vs. традиционное видеопроизводство
  - **Retention**: стратегии удержания пользователей

### Порядок использования документации
1. Начните с [[docs/project_quick_reference.md|Краткого справочника]] для общего понимания
2. Изучите [[docs/product_requirements_updated.md|Полный PRD]] для детального погружения
3. Используйте [[.cursor/rules/superduperai.md|Правила разработки]] при написании кода
4. Обращайтесь к специфическим документам по мере необходимости (SEO, деплой и т.д.)


