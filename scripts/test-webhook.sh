#!/bin/bash

echo "🧪 Testing Stripe Webhook..."

# Test webhook with sample checkout session data
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1234567890,v1=test_signature" \
  -d '{
    "id": "evt_test_webhook",
    "object": "event",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "object": "checkout.session",
        "amount_total": 100,
        "currency": "usd",
        "customer": "cus_test_123",
        "metadata": {
          "prompt": "Test video prompt",
          "videoCount": "1"
        },
        "payment_status": "paid",
        "status": "complete"
      }
    }
  }'

echo ""
echo "✅ Webhook test completed. Check the logs above for response." 