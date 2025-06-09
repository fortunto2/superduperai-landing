# SuperDuperAI Лендинг: Краткий справочник

## О проекте
SuperDuperAI — платформа для генерации видео с помощью AI по принципу Vibe Filmmaking. Пользователи описывают вайб/настроение, AI создаёт профессиональное видео.

**Ключевые концепции**:
- Vibe Filmmaking (описание атмосферы вместо технических деталей)
- Agent-Director Paradigm (пользователь как режиссёр, AI как исполнитель)

## Технический стек
- **Фреймворк**: Next.js 15.3 + App Router + Turbopack
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS 3.x + shadcn/ui
- **Контент**: ContentLayer2 + MDX
- **Деплой**: Cloudflare Workers с @opennextjs/cloudflare (не Pages!)
- **Иконки**: Lucide

## Структура проекта
```
src/
├── app/                   # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── [slug]/            # Статические страницы
│   ├── case/[slug]/       # Кейсы
│   ├── tool/[slug]/       # Инструменты
│   └── api/               # API-эндпоинты
├── components/            
│   ├── landing/           # Секции лендинга
│   ├── content/           # MDX-компоненты
│   └── ui/                # UI-компоненты
├── content/               # MDX-контент
└── lib/                   # Утилиты
```

## Основные правила разработки

### 1. Стилизация
- Тёмная тема по умолчанию (цвета: тёмно-синий #0F172A, акцент зелёный #ADFF2F)
- Шрифты: Lexend (заголовки), Inter (текст)
- Визуальные эффекты: gradients, glassmorphism, микроанимации

### 2. Ссылки
- Для внутренних ссылок используйте:
```tsx
import { default as Link } from '@/components/ui/optimized-link';
```

### 3. Cloudflare деплой
- Используем Workers с OpenNext, НЕ Cloudflare Pages
- Для статических страниц: 
```ts
export const dynamic = 'force-static';
export const revalidate = false;
```

### 4. ContentLayer + MDX
- MDX-компоненты должны быть серверными (не Client Components)
- Не используйте вложенные компоненты в MDX
- Подробности: [[docs/tasks/contentlayer-integration.md|Интеграция ContentLayer]]

### 5. SEO
- Каждая страница должна иметь метатеги
- Используйте Schema.org и OpenGraph
- Следите за ключевыми словами из [[docs/seo/keywords.md|стратегии SEO]]

### 6. Разработка
```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера (используйте только при необходимости)
pnpm dev

# Линтинг
pnpm lint

# Сборка проекта
pnpm build

# Запуск проверки сборки Cloudflare
pnpm preview
```

## Текущий статус
- ✅ Базовая инфраструктура настроена
- ✅ Лендинг базовые секции готовы
- ✅ UI/UX основа реализована 
- ⚠️ SEO-оптимизация в процессе
- 🔄 ContentLayer интеграция запланирована
- ⚠️ API-эндпоинты в процессе
- ✅ Cloudflare деплой настроен

## Полная документация
Детальное описание всех требований и принципов: [[docs/product_requirements_updated.md|Полный PRD]] 