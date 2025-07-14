# Security Guide - VEO3 API Protection

## 🚨 Проблема: Кража кредитов API

Ранее API эндпоинт `/api/enhance-prompt` был уязвим для злоупотреблений:
- ❌ Отсутствие CORS защиты
- ❌ Нет проверки Origin/Referer
- ❌ Отсутствие rate limiting
- ❌ Нет авторизации
- ❌ Прямой доступ к Azure OpenAI

## 🔒 Решения безопасности

### 1. CORS Protection

```typescript
const ALLOWED_ORIGINS = [
  'https://superduperai.com',
  'https://www.superduperai.com',
  'http://localhost:3000', // только development
];
```

**Защита:**
- Проверка `Origin` заголовка
- Проверка `Referer` как fallback
- Блокировка запросов с неавторизованных доменов

### 2. Rate Limiting

**API Endpoint Level:**
- 10 запросов в 15 минут на IP+Origin
- In-memory хранение (для production - Redis)

**Global Middleware Level:**
- 100 запросов в минуту на IP
- Защита всех API маршрутов

### 3. API Key Protection (опционально)

```bash
# .env.local
VEO3_API_KEY=your-secret-key-here
```

**Использование:**
```bash
curl -X POST /api/enhance-prompt \
  -H "X-API-Key: your-secret-key" \
  -d '{"prompt": "test"}'
```

### 4. Security Headers

Автоматически добавляются через middleware:
```typescript
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: no-store (для API)
```

## 📊 Мониторинг

### Логирование блокировок
```typescript
console.warn(`Blocked request from unauthorized origin: ${requestOrigin}`);
```

### Rate limit tracking
- IP-based счетчики
- Автоматическая очистка устаревших записей
- Graceful handling переполнения

## 🚀 Развертывание

### Development
```bash
NODE_ENV=development
# CORS разрешен с localhost
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
VEO3_API_KEY=your-production-key
```

### Cloudflare Workers
- Автоматическая защита от DDoS
- IP reputation filtering
- Bot management

## 🔧 Настройки производительности

### Rate Limit Cleanup
```typescript
if (Math.random() < 0.01) { // 1% вероятность
  // Очистка устаревших записей
}
```

### Memory Management
- Автоматическое удаление истекших токенов
- Оптимизированное хранение по ключу IP+Origin

## ⚠️ Дополнительные рекомендации

1. **Redis для production** - заменить in-memory на Redis
2. **Webhook для алертов** - уведомления о подозрительной активности  
3. **Captcha integration** - для дополнительной защиты
4. **JWT tokens** - для авторизованных пользователей
5. **Audit logging** - полный лог всех запросов

## 📈 Метрики безопасности

Отслеживайте:
- Количество блокированных запросов
- Top origins нарушителей
- Pattern анализ атак
- Azure OpenAI usage costs

## 🔄 Регулярные проверки

- [ ] Ротация API ключей (ежемесячно)
- [ ] Анализ логов безопасности (еженедельно)
- [ ] Обновление ALLOWED_ORIGINS при изменении доменов
- [ ] Мониторинг Azure OpenAI биллинга

---

**Результат:** API теперь защищён от несанкционированного использования с других доменов, что предотвращает кражу Azure OpenAI кредитов. 