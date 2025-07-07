# LangSmith Integration для VEO3 Generator

## Обзор

Добавлена интеграция LangSmith для трейсинга и мониторинга AI операций в VEO3 Prompt Enhancement API. LangSmith предоставляет observability для LLM вызовов и помогает анализировать производительность AI агентов.

## Технические детали

### Интеграция

- **Основные пакеты**: 
  - `langsmith` v0.3.39
  - `@vercel/otel` v1.13.0 (для OpenTelemetry)
- **Peer dependencies (автоматически установлены)**:
  - `@opentelemetry/api-logs` v0.52.1
  - `@opentelemetry/resources` v1.30.1
  - `@opentelemetry/sdk-logs` v0.52.1
  - `@opentelemetry/sdk-metrics` v1.30.1
- **Метод**: `AISDKExporter` из `langsmith/vercel` с `@vercel/otel`
- **Инструментация**: `instrumentation.ts` с `registerOTel()`
- **Endpoint**: `/api/enhance-prompt` route.ts

### Конфигурация переменных окружения

```bash
# LangSmith Configuration for AI Tracing and Observability  
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY="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"
LANGCHAIN_PROJECT="super-landing"
```

### Код интеграции

**1. Инструментация (`instrumentation.ts`):**
```typescript
import { registerOTel } from '@vercel/otel';
import { AISDKExporter } from 'langsmith/vercel';

export function register() {
  registerOTel({
    serviceName: 'super-landing-veo3',
    traceExporter: new AISDKExporter(),
  });
}
```

**2. В `generateObject` вызове:**
```typescript
experimental_telemetry: AISDKExporter.getSettings({
  runName: 'VEO3_Prompt_Enhancement',
  metadata: {
    user_id: 'veo3_generator',
    prompt_type: 'video_enhancement', 
    model_used: model,
    focus_types: focusTypes.join(','),
    character_limit: customLimit,
    has_moodboard: moodboard?.enabled || false
  }
})
```

## Отслеживаемые метрики

LangSmith автоматически трекит:

1. **Время выполнения** - длительность AI запросов
2. **Токены** - входные и выходные токены
3. **Модель** - используемая AI модель (gpt-4.1)
4. **Метаданные**:
   - Тип фокуса (character, action, cinematic, safe)
   - Лимит символов
   - Наличие moodboard
   - Пользовательские данные

## Использование

Трейсинг активируется автоматически при:
- Установленной переменной `LANGSMITH_TRACING=true`
- Валидном API ключе LangSmith

Все AI вызовы в VEO3 Enhancement API будут отправляться в LangSmith проект "super-landing" для мониторинга и анализа.

## Преимущества

- **Observability**: Полная видимость AI операций
- **Debugging**: Легче находить проблемы в промптах
- **Оптимизация**: Анализ производительности и качества
- **Мониторинг**: Отслеживание использования токенов и затрат 