# Redis-Only Session Architecture

## Overview

Полностью переработанная архитектура хранения данных сессий, где **все данные хранятся только в Redis**, а Stripe metadata используется минимально.

## Проблемы старой архитектуры

### ❌ Stripe Metadata Dependency
- **Лимиты**: 500 символов на поле, 50 полей максимум
- **Длинные промпты**: 3000+ символов не помещались
- **Null metadata**: Stripe молча обрезал данные при превышении лимитов
- **Сложность**: Нужно было синхронизировать KV и metadata

### ❌ Сложная логика обработки
```typescript
// Старый подход - сложно!
if (isLongPrompt) {
  metadataPrompt = `[PROMPT:${promptToStore.length}chars]`;
} else {
  metadataPrompt = promptToStore;
}

// В webhook
const prompt = await getFullPrompt(sessionId, metadataPrompt, hasLongPrompt);
```

## Новая архитектура

### ✅ Redis-Only Storage
```typescript
interface SessionData {
  prompt: string;           // Полный промпт любой длины
  videoCount: number;       // Количество видео
  duration: number;         // Длительность
  resolution: string;       // Разрешение
  style: string;           // Стиль
  toolSlug: string;        // Инструмент
  toolTitle: string;       // Название инструмента
  createdAt: string;       // Дата создания
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;         // ID файла после генерации
  error?: string;          // Ошибка если есть
}
```

### ✅ Минимальная Stripe Metadata
```typescript
// Только самое необходимое
const metadata = {
  video_count: quantity.toString(),
  tool: 'veo3-generator'
};
```

## Ключевые компоненты

### 1. Session Storage (`src/lib/kv.ts`)
```typescript
// Сохранение данных сессии
export async function storeSessionData(sessionId: string, data: SessionData): Promise<void>

// Получение данных сессии  
export async function getSessionData(sessionId: string): Promise<SessionData | null>

// Обновление данных сессии
export async function updateSessionData(sessionId: string, updates: Partial<SessionData>): Promise<void>
```

### 2. Checkout Creation (`src/app/api/create-checkout/route.ts`)
```typescript
// Сохраняем ВСЕ в Redis
const sessionData: SessionData = {
  prompt: prompt || '',
  videoCount: quantity,
  duration: 8,
  resolution: '1280x720',
  style: 'cinematic',
  toolSlug: toolSlug || 'veo3-prompt-generator',
  toolTitle: toolTitle || 'Free VEO3 Viral Prompt Generator',
  createdAt: new Date().toISOString(),
  status: 'pending'
};

await storeSessionData(session.id, sessionData);
```

### 3. Webhook Processing (`src/app/api/webhooks/stripe/route.ts`)
```typescript
// Получаем ВСЕ из Redis
const sessionData = await getSessionData(sessionId);

if (!sessionData) {
  console.error('❌ No session data found in Redis');
  return;
}

// Генерируем видео с данными из Redis
const fileId = await generateVideoWithSuperDuperAI(
  sessionData.prompt, 
  sessionData.duration, 
  sessionData.resolution, 
  sessionData.style
);

// Обновляем статус в Redis
await updateSessionData(sessionId, { 
  status: 'processing', 
  fileId 
});
```

### 4. Status API (`src/app/api/webhook-status/[sessionId]/route.ts`)
```typescript
// Возвращаем данные из Redis
const sessionData = await getSessionData(sessionId);

return NextResponse.json({
  status: sessionData.status,
  fileId: sessionData.fileId,
  error: sessionData.error,
  toolSlug: sessionData.toolSlug,
  toolTitle: sessionData.toolTitle,
  prompt: sessionData.prompt,
  timestamp: sessionData.createdAt
});
```

## Преимущества новой архитектуры

### 🚀 Простота
- **Один источник данных**: Только Redis
- **Нет синхронизации**: Не нужно сопоставлять KV и metadata
- **Прямой доступ**: Webhook сразу получает все данные

### 📈 Надежность
- **Нет лимитов**: Промпты любой длины
- **Нет null metadata**: Все данные гарантированно сохраняются
- **Единая логика**: Одинаковая обработка везде

### 🔧 Масштабируемость
- **Легко расширять**: Добавить новые поля в SessionData
- **Версионирование**: Можно добавить версии структуры
- **Мониторинг**: Легко отслеживать состояние сессий

## Redis Key Structure

```
session:cs_live_xxx -> SessionData object
session:cs_test_xxx -> SessionData object
```

**Время жизни**: 30 дней

## Migration Notes

### Что изменилось
1. **Убрали зависимость от Stripe metadata** для промптов
2. **Упростили webhook handler** - только Redis
3. **Унифицировали API** - один формат данных
4. **Убрали сложную логику** getFullPrompt, hasLongPrompt

### Обратная совместимость
- Старые сессии с null metadata будут показывать ошибку
- Новые сессии работают только через Redis
- API `/webhook-status/[sessionId]` сохраняет тот же формат ответа

## Troubleshooting

### Проблема: Session Not Found
```bash
# Проверить данные в Redis
node scripts/redis-session-debug.js cs_live_xxx

# Если данных нет - checkout не сохранил данные
# Проверить логи создания checkout сессии
```

### Проблема: Webhook не обрабатывает сессию
```bash
# Проверить что данные есть в Redis
curl -s "https://superduperai.co/api/webhook-status/cs_live_xxx" | jq .

# Должен вернуть объект с данными, не null
```

## Best Practices

### 1. Всегда проверяйте наличие данных
```typescript
const sessionData = await getSessionData(sessionId);
if (!sessionData) {
  console.error('❌ No session data found');
  return;
}
```

### 2. Обновляйте статус по мере обработки
```typescript
await updateSessionData(sessionId, { status: 'processing' });
// ... генерация видео ...
await updateSessionData(sessionId, { status: 'processing', fileId });
```

### 3. Логируйте важные события
```typescript
console.log('📊 Retrieved session data:', {
  promptLength: sessionData.prompt.length,
  videoCount: sessionData.videoCount,
  tool: sessionData.toolSlug
});
```

Эта архитектура решает все проблемы с Stripe metadata и делает систему намного проще и надежнее! 🚀 