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
name = "demo-landing"
compatibility_date = "2025-05-03"
compatibility_flags = ["nodejs_compat"]
main = ".open-next/worker.js"

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

### 4. Обновление package.json

Добавьте следующие скрипты в `package.json`:

```json
"scripts": {
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
}
```

### 5. Конфигурация для CI/CD

Создайте файл `.cloudflare/pages.toml` для настройки CI/CD:

```toml
[build]
command = "pnpm deploy"
[build.environment]
NODE_VERSION = "20.10.0"

[install]
command = "pnpm install"

[site]
bucket = ".open-next/assets"
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
    runs-on: upnpmtu-latest
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
        uses: oven-sh/setup-pnpm@v1
        with:
          pnpm-version: latest

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

- Next.js: 14.2.0 или выше (рекомендуется 15.x)
- Node.js: 20.x (рекомендуется 20.10.0)

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

## Преимущества этого подхода

1. **Полная поддержка Next.js**: работают Server Components, API Routes и другие фишки Next.js
2. **Производительность**: использование Cloudflare Workers обеспечивает низкую задержку по всему миру
3. **Масштабируемость**: автоматическое масштабирование без необходимости настройки
4. **Экономичность**: платите только за фактическое использование

## Официальная документация

Для более подробной информации смотрите:
- [Официальная документация Cloudflare по Next.js](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)
- [Документация OpenNext](https://opennext.js.org/) 