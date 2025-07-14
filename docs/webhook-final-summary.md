# 🎯 Webhook Setup: Complete Guide

## ✅ Current Status

### Test Mode Webhook (Готов)
- **ID:** `we_1RktTOK9tHMoWhKizHFl4GfU`
- **URL:** `https://superduperai.co/api/webhooks/stripe`
- **Secret:** `whsec_Gxu9FEAPZUQRf42btchWKVNDmSEH40kB`
- **Status:** ✅ Активен

### Live Mode Webhook (Нужно создать)
- **Current:** `we_1Q98XkK9tHMoWhKiqGyTBqbB` (старый домен)
- **URL:** `https://editor.superduperai.co/api/v1/stripe/webhook`
- **New needed:** `https://superduperai.co/api/webhooks/stripe`

## 🚀 Next Steps

### 1. Создать Live Mode Webhook

**Через Dashboard:**
1. Зайди в [Stripe Dashboard](https://dashboard.stripe.com)
2. Переключись в **Live Mode** (toggle в левом верхнем углу)
3. Перейди в **Developers** → **Webhooks**
4. Нажми **"Add endpoint"**
5. Заполни:
   - URL: `https://superduperai.co/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
6. Скопируй webhook secret

### 2. Обновить Environment Variables

**Продакшн:**
```bash
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_new_live_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

**Локальная разработка:**
```bash
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_listen_command
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

## 🧪 Testing

### Local Testing
```bash
# Запуск тестового скрипта
./scripts/test-webhook-local.sh

# Или вручную:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
pnpm dev
stripe trigger checkout.session.completed
```

### Production Testing
После создания live webhook:
1. Создай реальный платеж в test mode
2. Проверь логи в Stripe Dashboard
3. Убедись что VEO3 генерация запускается

## 📁 Files Created/Modified

### Created:
- `docs/webhook-setup.md` - Полная инструкция
- `docs/webhook-summary.md` - Краткая сводка
- `docs/webhook-production-setup.md` - Продакшн setup
- `docs/webhook-final-summary.md` - Итоговая сводка
- `scripts/test-webhook.sh` - Общий тестовый скрипт
- `scripts/test-webhook-local.sh` - Локальное тестирование

### Modified:
- `env.example` - Добавлены webhook secrets
- `src/app/api/webhooks/stripe/route.ts` - Улучшен error handling

## 🔧 Webhook Handler Features

### Events Handled:
- ✅ `checkout.session.completed` - Основное событие для запуска генерации
- ✅ `payment_intent.succeeded` - Альтернативное событие
- ✅ `payment_intent.payment_failed` - Обработка неудачных платежей

### Functionality:
- ✅ Signature verification
- ✅ Metadata extraction
- ✅ VEO3 generation trigger
- ✅ Error handling and logging
- ✅ Development mode debugging

## 📊 Monitoring

### Stripe Dashboard:
- [Test Webhooks](https://dashboard.stripe.com/test/webhooks)
- [Live Webhooks](https://dashboard.stripe.com/webhooks)

### CLI Commands:
```bash
# Check test mode webhooks
stripe webhook_endpoints list

# Check live mode webhooks
stripe webhook_endpoints list --live

# Test webhook locally
stripe trigger checkout.session.completed
```

## 🎉 Summary

**Готово:**
- ✅ Test mode webhook создан и настроен
- ✅ Webhook handler обновлен для обработки всех событий
- ✅ Локальное тестирование настроено
- ✅ Документация создана
- ✅ Скрипты для тестирования готовы

**Осталось сделать:**
- 🔄 Создать live mode webhook через Dashboard
- 🔄 Обновить продакшн environment variables
- 🔄 Протестировать в продакшне

**Результат:**
Полная система webhook для обработки Stripe платежей с автоматическим запуском VEO3 генерации! 🚀 