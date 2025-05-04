# Деплой на Cloudflare Workers

Этот документ описывает настройку деплоя Next.js проекта на Cloudflare Workers с использованием адаптера OpenNext.

## Подготовка проекта

### 1. Установка необходимых зависимостей

```bash
pnpm add @opennextjs/cloudflare@latest wrangler@latest --dev
```

### 2. Конфигурационный файл OpenNext

Создайте файл `open-next.config.ts` в корне проекта:

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
```

### 3. Конфигурация Wrangler

Создайте файл `wrangler.toml` в корне проекта:

```toml
# Конфигурация Cloudflare Workers для проекта на Next.js 15

name = "landing"
compatibility_date = "2025-03-25"
compatibility_flags = ["nodejs_compat"]
main = ".open-next/worker.js"

# Настройки Workers для оптимальной работы с Next.js
workers_dev = true

# Доступ к ассетам
[assets]
directory = ".open-next/assets"
binding = "ASSETS"

# Настройки окружения для Next.js
[vars]
NEXT_SKIP_CSP = "1"
NEXT_DISABLE_COMPRESSION = "1"

# Логи для диагностики
[observability.logs]
enabled = true
```

### 4. Дополнительная конфигурация для Cloudflare

Создайте файл `cloudflare.conf.ts` для дополнительных настроек:

```typescript
// Настройка для Cloudflare Pages и Workers
// См. документацию: https://developers.cloudflare.com/pages/platform/functions/

const config = {
  // Опционально указываем каталоги, которые необходимо исключить из сборки
  // includeFiles: [],
  // excludeFiles: [],
  
  // Настройки для правильной обработки маршрутов
  build: {
    // Пропускаем проверку директивы content-security-policy
    bypassCSP: true,
    // Отключаем сжатие ответов, что помогает избежать проблем с RSC
    bypassCompression: true,
  },
  
  // Улучшаем кэширование для статических ресурсов
  caching: {
    // Включаем агрессивное кэширование для статики
    cacheControl: {
      // Настройка для статических ресурсов
      bypassCache: false,
      edgeTTL: 60 * 60 * 24 * 365, // 1 год для статики
      browserTTL: 60 * 60 * 24 * 30, // 30 дней для браузерного кэша
      // Используем stale-while-revalidate для улучшения производительности
      staleWhileRevalidate: 60 * 60 * 24, // 1 день
    },
  },
  
  // Отключаем сжатие для запросов RSC
  compatibilityFlags: ["NO_RESPONSE_COMPRESSION"],
};

export default config;
```

### 5. Обновление package.json

Добавьте следующие скрипты в `package.json`:

```json
"scripts": {
  "build": "NEXT_TELEMETRY_DISABLED=1 next build",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
}
```

### 6. Настройка CI с GitHub Actions

Для автоматического деплоя при пуше в основную ветку создайте файл `.github/workflows/cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install

      - name: Build and Deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: pnpm deploy
```

### 7. Автоматический импорт через интерфейс Cloudflare

Cloudflare предлагает удобный способ автоматического импорта и деплоя проекта через веб-интерфейс:

1. Перейдите в раздел Workers & Pages на панели управления Cloudflare
2. Нажмите на кнопку "Create application"
3. Выберите опцию "Connect to Git"
4. Подключите свой GitHub/GitLab/Bitbucket аккаунт, если еще не сделали этого
5. Выберите нужный репозиторий из списка
6. Cloudflare автоматически определит тип проекта и предложит настройки сборки
7. Настройте следующие параметры:
   - **Production branch**: `main` (или ваша основная ветка)
   - **Build command**: `pnpm deploy`
   - **Build directory**: `.open-next/assets` (для статических ассетов)
   - **Environment variables**: добавьте необходимые переменные окружения

> **Примечание**: Добавьте скриншот интерфейса Cloudflare Workers & Pages в директорию `/docs/assets/` с именем `cloudflare-import-repo.png` и обновите ссылку ниже.

![Интерфейс импорта репозитория Cloudflare](../assets/cloudflare-import-repo.png)

Этот способ позволяет полностью настроить CI/CD без необходимости ручной настройки GitHub Actions и автоматически триггерит новые деплои при коммитах в выбранную ветку.

## Требования к версиям

- Next.js: 15.x (рекомендуется 15.3.0+)
- Node.js: 20.x (рекомендуется 20.10.0 или выше)

## Рабочий процесс

1. **Локальная разработка**:
   ```bash
   pnpm dev
   ```

2. **Тестирование в локальном окружении Cloudflare**:
   ```bash
   pnpm preview
   ```

3. **Деплой на Cloudflare Workers**:
   ```bash
   pnpm deploy
   ```

## Важные замечания

1. Локфайл должен быть актуальным и соответствовать установленным зависимостям. При обновлении пакетов обязательно обновляйте локфайл:
   ```bash
   pnpm install
   ```

2. Для аутентификации при деплое нужно иметь установленные переменные окружения:
   - `CLOUDFLARE_API_TOKEN` 
   - `CLOUDFLARE_ACCOUNT_ID`

3. При первом деплое может потребоваться создать проект в панели Cloudflare

## Стратегии рендеринга и ценообразование

### Тарифы Cloudflare Pages и Workers

При использовании OpenNext с Cloudflare ваш проект получает гибридный деплой:
- **Статические ассеты** (JS, CSS, изображения) размещаются в Cloudflare Pages
- **Серверные функции** (SSR и API routes) размещаются как Cloudflare Workers

Согласно [документации Cloudflare](https://developers.cloudflare.com/pages/functions/pricing/):

1. **Бесплатный тариф**:
   - 100,000 запросов к Functions (Pages Functions + Workers) в день
   - Лимит сбрасывается в полночь по UTC
   - **Статические ассеты**: бесплатно и без ограничений

2. **Платный тариф**:
   - Запросы к Functions тарифицируются по тарифам Workers
   - **Статические ассеты**: по-прежнему бесплатно и без ограничений

### Оптимизация для бесплатного тарифа

Для того чтобы максимально эффективно использовать бесплатный тариф и обеспечить отличный SEO:

1. **Максимизируйте статический рендеринг**:
   
   Добавьте в `next.config.js` следующие настройки:
   
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     /* config options here */
     eslint: {
       // Отключаем встроенную проверку ESLint при сборке
       ignoreDuringBuilds: true,
     },
     images: {
       unoptimized: true
     },
     // Устанавливаем вывод в standalone для оптимальной работы с Cloudflare
     output: 'standalone',
     // Оптимизация импортов пакетов
     experimental: {
       optimizePackageImports: [
         'react', 
         'react-dom',
         'lucide-react',
         'framer-motion',
         '@radix-ui/react-accordion',
         '@radix-ui/react-slot',
         'clsx',
         'tailwind-merge'
       ]
     },
     // Увеличиваем таймаут для статической генерации
     staticPageGenerationTimeout: 120
   };

   module.exports = nextConfig;
   ```

2. **Настройте страницы для правильного режима рендеринга**:

   В файле `src/app/page.tsx` (и других страницах):

   ```javascript
   // В начале файла страницы:
   
   // Указываем статический режим рендеринга
   export const dynamic = 'force-static';
   export const revalidate = false;
   
   export default function Home() {
     // Компоненты страницы
   }
   ```

   Для страниц с редким обновлением или частично динамических:

   ```javascript
   // Страница с редким обновлением (ISR) - кэшируется на 1 час
   export const revalidate = 3600;
   
   // Динамическая страница (SSR) - рендерится на сервере при каждом запросе
   export const dynamic = 'force-dynamic';
   ```

### Сравнение стратегий рендеринга для SEO и стоимости

| Стратегия                 | SEO          | Использование Functions | Актуальность данных | Рекомендуется для                 |
|---------------------------|--------------|-------------------------|---------------------|-----------------------------------|
| Статический (SSG)         | Отлично      | Минимальное             | Только при деплое   | Лендинги, документация, блоги     |
| Инкрементальный (ISR)     | Отлично      | Среднее                 | По расписанию       | Каталоги товаров, списки контента |
| Серверный (SSR)           | Хорошо       | Максимальное            | Всегда актуальны    | Персонализированные страницы      |

## Рекомендации для лендинга

Для лендинга оптимальная стратегия:

1. **Максимально использовать статический рендеринг (SSG)** для всех страниц:
   - Лучшая производительность
   - Минимальное использование лимитов Functions
   - Отличная индексация поисковиками

2. **Использовать SSR только для персонализированных разделов**, если они необходимы:
   - Формы обратной связи с капчей
   - Персонализированные демонстрационные разделы

## Преимущества этого подхода

1. **Полная поддержка Next.js**: работают Server Components, API Routes и другие фишки Next.js
2. **Производительность**: использование Cloudflare Workers обеспечивает низкую задержку по всему миру
3. **Масштабируемость**: автоматическое масштабирование без необходимости настройки
4. **Экономичность**: платите только за фактическое использование
5. **SEO-оптимизация**: статический рендеринг обеспечивает максимально быструю загрузку и индексацию

## Официальная документация

Для более подробной информации смотрите:
- [Официальная документация Cloudflare по Next.js](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)
- [Документация OpenNext](https://opennext.js.org/)
- [Ценообразование Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/pricing/) 