# Production Webhook Setup Guide

## 🚀 Создание Webhook для Live Mode

### Шаг 1: Переключение в Live Mode

1. Зайди в [Stripe Dashboard](https://dashboard.stripe.com)
2. В левом верхнем углу переключи режим с **"Test data"** на **"Live data"**
3. Подтверди переключение

### Шаг 2: Создание Webhook Endpoint

1. Перейди в **Developers** → **Webhooks**
2. Нажми **"Add endpoint"**
3. Заполни данные:
   - **Endpoint URL:** `https://superduperai.co/api/webhooks/stripe`
   - **Description:** `VEO3 Payment Processing`
   - **Events to send:** Выбери следующие события:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
4. Нажми **"Add endpoint"**

### Шаг 3: Получение Webhook Secret

1. Нажми на созданный endpoint
2. В разделе **"Signing secret"** нажми **"Reveal"**
3. Скопируй secret (начинается с `whsec_`)

### Шаг 4: Настройка Environment Variables

Добавь в продакшн окружение:

```bash
# Live Mode Keys
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

## 📋 Текущие Webhook Endpoints

### Test Mode
- **ID:** `we_1RktTOK9tHMoWhKizHFl4GfU`
- **URL:** `https://superduperai.co/api/webhooks/stripe`
- **Secret:** `whsec_Gxu9FEAPZUQRf42btchWKVNDmSEH40kB`

### Live Mode
- **ID:** `we_1Q98XkK9tHMoWhKiqGyTBqbB` (старый, для editor.superduperai.co)
- **URL:** `https://editor.superduperai.co/api/v1/stripe/webhook`
- **Status:** Активен, но для старого домена

### Новый Live Mode Webhook (нужно создать)
- **URL:** `https://superduperai.co/api/webhooks/stripe`
- **Events:** `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🔧 Локальное Тестирование

Для локального тестирования используй webhook secret из CLI:

```bash
# Запуск webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Webhook secret будет показан в консоли, например:
# whsec_a29eb8a5a55092deb183391c121ffa172c208229e8ef3ddc9faac70adfce42f4
```

Добавь этот secret в `.env.local`:

```bash
# Для локального тестирования
STRIPE_WEBHOOK_SECRET=whsec_a29eb8a5a55092deb183391c121ffa172c208229e8ef3ddc9faac70adfce42f4
```

## 🔍 Troubleshooting

### 400 Error при локальном тестировании
- Убедись что используешь правильный webhook secret из `stripe listen`
- Проверь что dev server запущен на порту 3000
- Убедись что endpoint доступен по пути `/api/webhooks/stripe`

### Webhook не работает в продакшне
- Проверь что URL доступен и возвращает 200
- Убедись что используешь правильный webhook secret из Dashboard
- Проверь логи в Stripe Dashboard → Webhooks → Recent deliveries

## 📊 Monitoring

### Stripe Dashboard
- [Test Mode Webhooks](https://dashboard.stripe.com/test/webhooks)
- [Live Mode Webhooks](https://dashboard.stripe.com/webhooks)

### Проверка статуса
```bash
# Test mode
stripe webhook_endpoints list

# Live mode  
stripe webhook_endpoints list --live
``` 