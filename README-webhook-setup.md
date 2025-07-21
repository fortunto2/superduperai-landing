# Local Webhook Setup for Development

## Option 1: Stripe CLI (Recommended)

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://github.com/stripe/stripe-cli/releases
```

### 2. Login to Stripe
```bash
stripe login
```

### 3. Forward webhooks to local development
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will:
- Give you a webhook signing secret (starts with `whsec_`)
- Forward all Stripe events to your local server

### 4. Update your .env.local
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

### 5. Test the webhook
```bash
# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

## Option 2: ngrok (Alternative)

### 1. Install ngrok
```bash
npm install -g ngrok
```

### 2. Expose local server
```bash
ngrok http 3000
```

### 3. Add webhook endpoint in Stripe Dashboard
- Go to https://dashboard.stripe.com/webhooks
- Add endpoint: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `payment_intent.succeeded`

## Development Flow

1. Start your Next.js dev server: `pnpm dev`
2. Start Stripe CLI forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Make a test payment
4. Watch webhook events in terminal
5. Use manual controls in payment success page if needed

## Debugging

- Check webhook logs: `stripe logs tail`
- Test specific events: `stripe trigger payment_intent.succeeded`
- View webhook dashboard: https://dashboard.stripe.com/webhooks 