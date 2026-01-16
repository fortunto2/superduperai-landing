# Stripe Webhook Setup Guide

## Development (Local Testing)

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://docs.stripe.com/stripe-cli
```

### 2. Login to Stripe
```bash
stripe login
```

### 3. Forward events to local server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Test webhook
```bash
stripe trigger checkout.session.completed
```

## Production Setup

### Option 1: Create Webhook via Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your endpoint URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events to send: `checkout.session.completed`
6. Click **Add endpoint**

### Option 2: Create Webhook via API (Programmatically)

```bash
# Set your environment variables
export STRIPE_SECRET_KEY="sk_test_your_secret_key"
export WEBHOOK_URL="https://your-domain.com/api/webhooks/stripe"

# Create webhook endpoint
curl https://api.stripe.com/v1/webhook_endpoints \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=payment_intent.succeeded" \
  -d "enabled_events[]=payment_intent.payment_failed" \
  -d "url=${WEBHOOK_URL}" \
  -d "api_version=2025-06-30.basil"
```

### Option 3: Create Webhook via Stripe CLI

```bash
# Login to Stripe CLI
stripe login

# Create webhook endpoint
stripe webhook_endpoints create \
  --enabled-event checkout.session.completed \
  --enabled-event payment_intent.succeeded \
  --enabled-event payment_intent.payment_failed \
  --url "https://your-domain.com/api/webhooks/stripe"
```

### 2. Get Webhook Secret

1. Click on your newly created webhook endpoint
2. Find **Signing secret** (starts with `whsec_`)
3. Copy this secret

**✅ Webhook уже создан для superduperai.co:**
- **Webhook ID:** `we_1RktTOK9tHMoWhKizHFl4GfU`
- **URL:** `https://superduperai.co/api/webhooks/stripe`
- **Secret:** `whsec_Gxu9FEAPZUQRf42btchWKVNDmSEH40kB`
- **Events:** `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Environment Variables

Add these variables to your production environment:

```bash
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### 4. Security Considerations

- Always verify webhook signatures
- Use HTTPS endpoints only
- Store webhook secrets securely
- Implement idempotency for webhook handlers
- Log webhook events for debugging

## Webhook Events Handled

- `checkout.session.completed` - When payment is successful
- `payment_intent.succeeded` - Alternative payment success event
- `payment_intent.payment_failed` - When payment fails

## Testing Webhook Locally

```bash
# Terminal 1: Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2: Start Next.js dev server
pnpm dev

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check that `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure raw body is passed to `stripe.webhooks.constructEvent`

2. **Webhook not receiving events**
   - Verify endpoint URL is correct and accessible
   - Check that events are selected in Stripe Dashboard
   - Ensure endpoint returns 200 status code

3. **Local testing not working**
   - Make sure Stripe CLI is logged in: `stripe login`
   - Check that local server is running on correct port
   - Verify webhook endpoint exists at `/api/webhooks/stripe`

### Debug Webhook Events

Check webhook delivery in Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View **Recent deliveries** tab
4. Check response status and logs 