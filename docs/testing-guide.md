# VEO3 Payment System Testing Guide

## Overview
This guide explains how to test the complete VEO3 payment and video generation system.

## Environment Setup

### Test Mode (Development)
```bash
# Switch to test mode
./scripts/switch-stripe-mode.sh test

# Start dev server
pnpm dev

# Start Stripe CLI webhook listener (in another terminal)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Production Mode
```bash
# Switch to production mode
./scripts/switch-stripe-mode.sh prod

# Build and start production server
pnpm build
pnpm start
```

## Test Prices

### Test Mode Prices
- **Single Video**: `price_1RktnoK9tHMoWhKim5uqXiAe` - $1.00
- **Triple Pack**: `price_1Rkto1K9tHMoWhKinvpEwntH` - $2.00

### Production Mode Prices
- **Single Video**: `price_1Rkse5K9tHMoWhKiQ0tg0b2N` - $1.00
- **Triple Pack**: `price_1Rkse7K9tHMoWhKise2iYOXL` - $2.00

## Testing Scripts

### 1. Test Payment Flow
```bash
./scripts/test-payment-flow.sh
```
This script:
- Creates a checkout session
- Provides test card details
- Shows success/cancel URLs

### 2. Test Webhook Manually
```bash
./scripts/test-webhook.sh
```
Tests the webhook endpoint directly.

### 3. Switch Stripe Modes
```bash
# Switch to test mode
./scripts/switch-stripe-mode.sh test

# Switch to production mode
./scripts/switch-stripe-mode.sh prod
```

## Manual Testing Steps

### 1. Test Checkout Creation
1. Go to `/en/tool/veo3-prompt-generator`
2. Generate a prompt
3. Click "Generate 1 Video ($1)" or "Generate 3 Videos ($2)"
4. Verify checkout session is created

### 2. Test Payment Flow
1. Use test card: `4242 4242 4242 4242`
2. Use any future expiry date (e.g., 12/34)
3. Use any 3-digit CVC (e.g., 123)
4. Complete payment
5. Verify redirect to status page

### 3. Test Webhook Processing
1. Complete a test payment
2. Check webhook logs in Stripe CLI
3. Verify video generation starts
4. Check status page updates

## Test Cards

### Successful Payments
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 8224 6310 005`

### Failed Payments
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`
- **Expired Card**: `4000 0000 0000 0069`

## Webhook Testing

### Local Development
```bash
# Terminal 1: Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2: Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

### Production Testing
Use the Stripe Dashboard to send test webhooks to your production endpoint.

## Status Page Testing

### Test URLs
- Test: `http://localhost:3000/en/veo3-status/[generationId]`
- Production: `https://superduperai.co/en/veo3-status/[generationId]`

### Expected Behavior
1. Shows "Processing..." initially
2. Updates every 5 seconds
3. Shows progress bar
4. Displays video when complete
5. Provides download link

## API Endpoints

### Create Checkout
```bash
curl -X POST http://localhost:3000/api/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1RktnoK9tHMoWhKim5uqXiAe",
    "prompt": "A beautiful sunset over the ocean",
    "videoCount": 1,
    "successUrl": "http://localhost:3000/en/veo3-status/{CHECKOUT_SESSION_ID}",
    "cancelUrl": "http://localhost:3000/en/tool/veo3-prompt-generator"
  }'
```

### Check Generation Status
```bash
curl -X GET http://localhost:3000/api/generate-veo3?id=generation_id
```

### Webhook Endpoint
```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{"type": "checkout.session.completed", "data": {...}}'
```

## Troubleshooting

### Common Issues

1. **400 Webhook Errors**
   - Check webhook secret matches Stripe CLI output
   - Verify environment variables are correct

2. **Invalid Price ID**
   - Ensure using correct prices for test/production mode
   - Check `stripe-config.ts` for current prices

3. **CORS Issues**
   - Verify `NEXT_PUBLIC_BASE_URL` is correct
   - Check success/cancel URLs format

4. **Video Generation Fails**
   - Check `SUPERDUPERAI_API_KEY` is set
   - Verify API endpoint is accessible

### Debug Commands
```bash
# Check environment variables
cat .env.local

# Check Stripe configuration
curl -u "sk_test_...:" https://api.stripe.com/v1/prices

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "ping"}'
```

## Production Deployment

### Environment Variables
```bash
# Production environment
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
SUPERDUPERAI_API_KEY="your_api_key"
NEXT_PUBLIC_BASE_URL="https://superduperai.co"
```

### Webhook Configuration
- URL: `https://superduperai.co/api/webhooks/stripe`
- Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## Monitoring

### Stripe Dashboard
- Monitor payments in real-time
- Check webhook delivery logs
- View customer activity

### Application Logs
- Check Next.js console for errors
- Monitor video generation progress
- Track webhook processing

## Security Considerations

1. **Webhook Signature Verification**
   - Always verify webhook signatures
   - Use different secrets for test/production

2. **API Key Security**
   - Never expose secret keys in client-side code
   - Use environment variables only

3. **Price Validation**
   - Validate price IDs on server-side
   - Check against allowed prices only

4. **CORS Configuration**
   - Restrict origins for API endpoints
   - Validate redirect URLs 