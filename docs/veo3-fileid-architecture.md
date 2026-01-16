# VEO3 FileId-Based Architecture

## Overview

Обновленная архитектура VEO3 генерации видео теперь использует fileId-based подход, аналогичный чатботу. Это обеспечивает более надежное отслеживание статуса генерации и интеграцию с SuperDuperAI API.

## Key Changes

### 1. FileId-Based Tracking

**Раньше:**
- Использовали собственные ID и заглушки
- Нет реальной связи с SuperDuperAI API
- Проблемы с отслеживанием статуса

**Теперь:**
- Используем fileId из SuperDuperAI API
- Прямая проверка статуса через `/api/v1/file/{fileId}`
- Консистентность с чатботом

### 2. Data Structure

```typescript
interface GenerationStatus {
  success: boolean;
  generationId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  prompt: string;
  videoCount: number;
  createdAt: string;
  paymentIntentId?: string;
  sessionId?: string;
  customerEmail?: string;
  videos?: Array<{
    fileId: string;           // 🔑 Key: SuperDuperAI fileId
    url?: string;             // Available when completed
    thumbnailUrl?: string;    // Available when completed
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
  error?: string;
}
```

### 3. API Workflow

```mermaid
graph TD
    A[Payment Success] --> B[POST /api/generate-veo3]
    B --> C[SuperDuperAI API Call]
    C --> D[Receive fileId]
    D --> E[Save Generation Data]
    E --> F[Return fileIds to Client]
    
    G[Status Check] --> H[GET /api/generate-veo3?generationId=xxx]
    H --> I[Load Generation Data]
    I --> J[Check Each fileId Status]
    J --> K[GET /api/v1/file/{fileId}]
    K --> L[Update Status & URLs]
    L --> M[Return Updated Data]
```

## Implementation Details

### 1. Video Generation (`/api/generate-veo3`)

```typescript
// POST - Start generation
const fileIds = await generateVideoWithSuperDuperAI(prompt, videoCount);

// Create video entries with fileIds
const videos = fileIds.map(fileId => ({
  fileId,
  status: 'processing' as const,
  url: undefined,
  thumbnailUrl: undefined
}));

// Save to storage
await saveGenerationData({ ...data, videos });
```

### 2. Status Checking

```typescript
// GET - Check status
for (const video of generationData.videos) {
  const fileStatus = await checkFileStatus(video.fileId);
  
  if (fileStatus.status === 'completed' && fileStatus.url) {
    // Video is ready
    updatedVideos.push({
      ...video,
      url: fileStatus.url,
      thumbnailUrl: fileStatus.thumbnailUrl,
      status: 'completed'
    });
  }
}
```

### 3. File Status API (`/api/file/[id]`)

```typescript
// Proxy to SuperDuperAI API
const response = await fetch(`${config.url}/api/v1/file/${fileId}`, {
  headers: {
    'Authorization': `Bearer ${config.token}`
  }
});

const fileData = await response.json();
return NextResponse.json(fileData);
```

## Benefits

### ✅ Advantages

1. **Real-time Status**: Проверка статуса через SuperDuperAI API
2. **Consistency**: Единый подход с чатботом
3. **Reliability**: fileId всегда доступен сразу после создания
4. **Scalability**: Легко добавить новые типы файлов
5. **Debugging**: Четкое отслеживание через fileId

### 🔧 Technical Improvements

- **No Mock Data**: Реальная интеграция с SuperDuperAI
- **Persistent Storage**: Данные генерации сохраняются в `.veo3-generations/`
- **Auto-refresh**: Автоматическое обновление статуса каждые 5 секунд
- **Error Handling**: Корректная обработка ошибок API

## File Structure

```
.veo3-generations/
├── veo3_1752528615204_okpo8wdgyr.json
├── veo3_1752528615205_abcdef123.json
└── .gitkeep
```

### Example Generation File

```json
{
  "generationId": "veo3_1752528615204_okpo8wdgyr",
  "prompt": "A beautiful sunset over mountains with birds flying",
  "videoCount": 1,
  "status": "completed",
  "progress": 100,
  "createdAt": "2024-01-20T10:30:00.000Z",
  "paymentIntentId": "pi_test_123456789",
  "sessionId": "cs_test_987654321",
  "customerEmail": "test@example.com",
  "videos": [
    {
      "fileId": "92ea7c4b-c99b-4e04-b455-5c8fa20b9ba9",
      "url": "https://files.superduperai.co/video/completed.mp4",
      "thumbnailUrl": "https://files.superduperai.co/thumbnails/thumb.jpg",
      "status": "completed"
    }
  ]
}
```

## Usage Examples

### 1. Check Generation Status

```bash
curl -X GET "http://localhost:3000/api/generate-veo3?generationId=veo3_1752528615204_okpo8wdgyr"
```

### 2. Check Individual File Status

```bash
curl -X GET "http://localhost:3000/api/file/92ea7c4b-c99b-4e04-b455-5c8fa20b9ba9"
```

### 3. Access Status Page

```
http://localhost:3000/en/veo3-status/veo3_1752528615204_okpo8wdgyr
```

## Migration Notes

### From Old System

1. **Data Structure**: Обновлена структура данных для videos
2. **API Endpoints**: Добавлен `/api/file/[id]` proxy
3. **Status Component**: Полностью переписан для новой структуры
4. **Error Handling**: Улучшена обработка ошибок

### Environment Variables

```env
# SuperDuperAI API Configuration
SUPERDUPERAI_TOKEN=your_superduperai_token
SUPERDUPERAI_URL=https://dev-editor.superduperai.co
```

## Future Enhancements

1. **SSE Integration**: Добавить real-time updates через Server-Sent Events
2. **Webhooks**: Интеграция с SuperDuperAI webhooks
3. **Caching**: Кеширование статуса файлов
4. **Batch Operations**: Массовая проверка статуса
5. **Analytics**: Отслеживание времени генерации

## Troubleshooting

### Common Issues

1. **Generation Not Found**: Проверьте `.veo3-generations/` папку
2. **FileId Empty**: Проверьте SuperDuperAI API response
3. **Status Stuck**: Проверьте SuperDuperAI API connectivity
4. **Old Links**: Старые ссылки не работают после очистки кеша

### Debug Commands

```bash
# Check generation file
cat .veo3-generations/veo3_1752528615204_okpo8wdgyr.json

# Test file status
curl -X GET "http://localhost:3000/api/file/FILE_ID"

# Check SuperDuperAI API
curl -H "Authorization: Bearer $SUPERDUPERAI_TOKEN" \
  "https://dev-editor.superduperai.co/api/v1/file/FILE_ID"
```

## Conclusion

FileId-based архитектура обеспечивает надежную и масштабируемую систему генерации видео с реальной интеграцией SuperDuperAI API. Это решение устраняет проблемы с отслеживанием статуса и обеспечивает консистентность с остальными компонентами системы. 