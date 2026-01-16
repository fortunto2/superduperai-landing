#!/bin/bash

echo "🧪 Testing Complete Payment Flow..."

# Test data
PROMPT="Test video: A beautiful sunset over the ocean"
VIDEO_COUNT="1"
PRICE_ID="price_1RktnoK9tHMoWhKim5uqXiAe"  # $1.00 for 1 video (TEST)

echo "📝 Creating checkout session..."
echo "Prompt: $PROMPT"
echo "Video Count: $VIDEO_COUNT"
echo "Price ID: $PRICE_ID"

# Create checkout session
RESPONSE=$(curl -s -X POST http://localhost:3000/api/create-checkout \
  -H "Content-Type: application/json" \
  -d "{
    \"priceId\": \"$PRICE_ID\",
    \"prompt\": \"$PROMPT\",
    \"videoCount\": $VIDEO_COUNT,
    \"successUrl\": \"http://localhost:3000/en/veo3-status/{CHECKOUT_SESSION_ID}\",
    \"cancelUrl\": \"http://localhost:3000/en/tool/veo3-prompt-generator\"
  }")

echo ""
echo "📋 Checkout Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Extract session ID from response
SESSION_ID=$(echo "$RESPONSE" | jq -r '.sessionId' 2>/dev/null)

if [ "$SESSION_ID" != "null" ] && [ -n "$SESSION_ID" ]; then
    echo ""
    echo "✅ Checkout session created: $SESSION_ID"
    echo "💳 Checkout URL: https://checkout.stripe.com/pay/$SESSION_ID"
    echo ""
    echo "🔗 To complete the test:"
    echo "1. Open the checkout URL in your browser"
    echo "2. Use test card: 4242 4242 4242 4242"
    echo "3. Use any future date for expiry"
    echo "4. Use any 3-digit CVC"
    echo "5. Complete the payment"
    echo ""
    echo "🎯 After payment, you should be redirected to:"
    echo "   http://localhost:3000/en/veo3-status/[generationId]"
else
    echo ""
    echo "❌ Failed to create checkout session"
    echo "Response: $RESPONSE"
fi 