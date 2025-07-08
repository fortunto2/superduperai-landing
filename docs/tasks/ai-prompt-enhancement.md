# AI Prompt Enhancement для VEO3 Generator

## Обзор

Добавлена новая функция AI-powered расширения промптов в VEO3 Generator, которая использует Azure OpenAI API для улучшения пользовательских промптов.

## 🔒 Безопасность API

### Меры защиты от кражи кредитов:

1. **CORS Protection** - проверка Origin/Referer заголовков
2. **Rate Limiting** - ограничение запросов (10 запросов в 15 минут)
3. **API Key Authentication** (опционально) - дополнительная защита
4. **IP-based tracking** - отслеживание запросов по IP

### Настройка безопасности:

```bash
# Обязательные переменные
AZURE_OPENAI_RESOURCE_NAME=your-resource
AZURE_OPENAI_API_KEY=your-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Опциональная API ключ защита
VEO3_API_KEY=your-secret-key
```

### Разрешённые домены:
```typescript
const ALLOWED_ORIGINS = [
  'https://superduperai.com',
  'https://www.superduperai.com',
  'http://localhost:3000' // только в development
];
```

### Rate Limiting:
- **Лимит**: 10 запросов в 15 минут на IP+Origin
- **Хранение**: In-memory (для production рекомендуется Redis)
- **Очистка**: Автоматическая с вероятностью 1%

## Архитектура

### Компоненты

1. **API Endpoint**: `/api/enhance-prompt` - серверный endpoint для обработки запросов
2. **SimpleVeo3Generator**: обновлённый компонент с 3-шаговым интерфейсом
3. **Environment Variables**: конфигурация Azure OpenAI

### Технологии

- **AI SDK**: Vercel AI SDK v4.3.16
- **Azure Provider**: @ai-sdk/azure v1.3.23
- **Validation**: Zod v3.25.67
- **Azure OpenAI**: GPT-4o модель

## Пользовательский Flow

### Шаг 1: Prompt Builder
Пользователь создаёт базовый промпт используя:
- Описание сцены
- Персонажи и действия
- Речь персонажей (12 языков)
- Стили, камеры, освещение, настроение
- Продолжительность

### Шаг 2: Generated Prompt
- Отображается сгенерированный базовый промпт
- Кнопка "Copy Basic" для копирования
- Кнопка "AI Enhance" для улучшения промпта

### Шаг 3: AI Enhanced Prompt
- Показывается улучшенный AI промпт
- Кнопка копирования расширенного промпта
- Индикатор загрузки во время обработки

## Техническая реализация

### API Endpoint (`/api/enhance-prompt/route.ts`)

```typescript
// Использует Azure OpenAI через AI SDK
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
});

// Валидация с Zod
const enhancePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

// Генерация через generateText
const { text } = await generateText({
  model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'),
  system: `Expert video prompt engineer for VEO3...`,
  prompt: `Please enhance this VEO3 video prompt: "${prompt}"`,
  maxTokens: 200,
});
```

### Компонент Updates

```typescript
// Новые состояния
const [enhancedPrompt, setEnhancedPrompt] = useState("");
const [isEnhancing, setIsEnhancing] = useState(false);
const [enhanceError, setEnhanceError] = useState("");

// Функция расширения
const enhancePrompt = async () => {
  const response = await fetch('/api/enhance-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: generatedPrompt }),
  });
  const data = await response.json();
  setEnhancedPrompt(data.enhancedPrompt);
};
```

## Environment Variables

Необходимые переменные окружения в `.env.local`:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_RESOURCE_NAME=your-azure-resource-name
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

## System Prompt для AI Enhancement

AI использует специализированный system prompt для улучшения промптов:

### Основные принципы:
1. Сохранение оригинального замысла
2. Добавление кинематографических деталей
3. Улучшение описания действий и эмоций
4. Техническая специфика для VEO3
5. Ограничение в 500 символов для оптимальной работы VEO3

### Пример улучшения:

**Исходный промпт:**
```
A cozy coffee shop in the morning, featuring A young woman reading a book who is slowly sipping coffee while turning pages, says in english: "What a beautiful morning", Shot with medium shot, golden hour, cinematic style, peaceful mood, Duration: 10 seconds.
```

**Улучшенный промпт:**
```
Warm morning sunlight streams through large café windows, illuminating steam rising from a ceramic mug. A young woman in a cream sweater sits at a wooden table, her fingers delicately turning book pages as she savors her coffee. "What a beautiful morning," she whispers with a gentle smile. Medium shot with shallow depth of field, golden hour backlighting creates a cinematic halo effect. Peaceful, contemplative atmosphere. 10 seconds.
```

## UI/UX Особенности

### Визуальные индикаторы:
- **Loader2 icon**: анимированная иконка загрузки
- **Wand2 icon**: иконка AI-магии для кнопки Enhancement
- **Error handling**: красный текст для ошибок
- **3-column layout**: Step 1 → Step 2 → Step 3

### Адаптивность:
- На мобильных: вертикальная раскладка
- На планшетах и десктопах: 3-колоночная сетка
- Примеры промптов: отдельная секция внизу

## Обработка ошибок

1. **Валидация входных данных** с Zod
2. **Network errors** с user-friendly сообщениями
3. **Azure API errors** с fallback обработкой
4. **Empty prompt protection** - проверка наличия базового промпта

## Performance

- **Caching**: нет кеширования (каждый запрос уникален)
- **Token limit**: 200 токенов для ответа
- **Timeout**: стандартный timeout для fetch
- **Rate limiting**: зависит от Azure OpenAI limits

## Безопасность

- **Environment variables**: критичные данные в .env.local
- **Input validation**: Zod схемы для всех входных данных
- **Error sanitization**: не раскрываем внутренние ошибки API
- **CORS**: Next.js API routes с встроенной защитой

## Deployment Notes

### Cloudflare Workers
- AI SDK совместим с Edge Runtime
- Environment variables должны быть настроены в Cloudflare
- Azure OpenAI endpoints доступны из Cloudflare Edge

### Environment Setup
1. Создать Azure OpenAI resource
2. Deploy GPT-4o модель
3. Получить API key и resource name
4. Настроить переменные окружения

## Будущие улучшения

1. **Caching**: Redis кеш для популярных промптов
2. **Multiple models**: поддержка разных AI моделей
3. **Batch processing**: обработка нескольких промптов
4. **User preferences**: персонализация стиля улучшений
5. **Analytics**: трекинг использования AI enhancement
6. **A/B testing**: сравнение разных system prompts

## Мониторинг

Рекомендуется отслеживать:
- **API response times**: время ответа Azure OpenAI
- **Error rates**: частота ошибок enhancement
- **Usage patterns**: популярные типы промптов
- **Token consumption**: расход токенов Azure OpenAI 