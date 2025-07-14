# VEO3 Payment System

## Overview
Complete payment integration for VEO3 video generation with Stripe checkout, webhook processing, and real-time status tracking.

## Features
- ✅ Stripe checkout integration
- ✅ Webhook handling for payment events
- ✅ Real-time video generation status
- ✅ Automatic environment detection (test/production)
- ✅ Progress tracking and download links
- ✅ Mobile-responsive payment UI

## Architecture

### Payment Flow
```
User → Payment Button → Stripe Checkout → Webhook → Video Generation → Status Page
```

### Components
1. **Payment Buttons** (`src/components/ui/veo3-payment-buttons.tsx`)
2. **Checkout API** (`src/app/api/create-checkout/route.ts`)
3. **Webhook Handler** (`src/app/api/webhooks/stripe/route.ts`)
4. **Video Generation API** (`src/app/api/generate-veo3/route.ts`)
5. **Status Page** (`src/app/[locale]/veo3-status/[generationId]/page.tsx`)

## Pricing Structure

### Test Mode
- **Single Video**: $1.00 (`price_1RktnoK9tHMoWhKim5uqXiAe`)
- **Triple Pack**: $2.00 (`price_1Rkto1K9tHMoWhKinvpEwntH`) - Save $1!

### Production Mode
- **Single Video**: $1.00 (`price_1Rkse5K9tHMoWhKiQ0tg0b2N`)
- **Triple Pack**: $2.00 (`price_1Rkse7K9tHMoWhKise2iYOXL`) - Save $1!

## Environment Configuration

### Required Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..." # or sk_live_...
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # or pk_live_...

# SuperDuperAI API
SUPERDUPERAI_API_KEY="your_api_key"
SUPERDUPERAI_API_URL="https://api.superduperai.co"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # or https://superduperai.co
```

### Auto-Detection
The system automatically detects test/production mode based on the `STRIPE_SECRET_KEY` prefix:
- `sk_test_` → Test mode
- `sk_live_` → Production mode

## API Endpoints

### 1. Create Checkout Session
**POST** `/api/create-checkout`

```json
{
  "priceId": "price_1RktnoK9tHMoWhKim5uqXiAe",
  "prompt": "A beautiful sunset over the ocean",
  "videoCount": 1,
  "successUrl": "http://localhost:3000/en/veo3-status/{CHECKOUT_SESSION_ID}",
  "cancelUrl": "http://localhost:3000/en/tool/veo3-prompt-generator"
}
```

### 2. Video Generation
**POST** `/api/generate-veo3`
```json
{
  "prompt": "A beautiful sunset over the ocean",
  "videoCount": 1
}
```

**GET** `/api/generate-veo3?id=generation_id`
Returns generation status and progress.

### 3. Stripe Webhook
**POST** `/api/webhooks/stripe`
Handles Stripe webhook events:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create-checkout/route.ts     # Checkout session creation
│   │   ├── generate-veo3/route.ts       # Video generation API
│   │   └── webhooks/stripe/route.ts     # Webhook handler
│   └── [locale]/
│       └── veo3-status/
│           └── [generationId]/
│               └── page.tsx             # Status page
├── components/
│   ├── ui/
│   │   └── veo3-payment-buttons.tsx     # Payment buttons
│   └── veo3/
│       └── veo3-status-client.tsx       # Status client component
├── lib/
│   └── stripe-config.ts                 # Price configuration
└── data/
    └── generations/                     # Generation status files
```

## Testing

### Quick Start
```bash
# Switch to test mode
./scripts/switch-stripe-mode.sh test

# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test payment flow
./scripts/test-payment-flow.sh
```

### Test Cards
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Manual Testing
1. Go to `/en/tool/veo3-prompt-generator`
2. Generate a prompt
3. Click payment button
4. Complete checkout with test card
5. Verify redirect to status page
6. Check real-time updates

## Webhook Configuration

### Test Mode
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Secret: `whsec_a29eb8a5a55092deb183391c121ffa172c208229e8ef3ddc9faac70adfce42f4`

### Production Mode
- **URL**: `https://superduperai.co/api/webhooks/stripe`
- **Events**: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- **Secret**: `whsec_tEq8i6JwTQEs4HJD3qDkd5BjJ9zm6WuY`

## Status Page Features

### Real-time Updates
- Polls every 5 seconds
- Shows generation progress
- Displays estimated completion time
- Auto-refreshes on completion

### Progress States
1. **Processing** - Initial state
2. **Generating** - Video creation in progress
3. **Completed** - Video ready for download
4. **Failed** - Generation failed with error

### UI Components
- Progress bar with percentage
- Status messages
- Video preview
- Download button
- Error handling

## Security Features

### Webhook Verification
- Stripe signature verification
- Environment-specific secrets
- Request validation

### Price Validation
- Server-side price verification
- Environment-specific prices
- Zod schema validation

### API Security
- Request rate limiting
- Input sanitization
- Error handling

## Monitoring

### Stripe Dashboard
- Real-time payment monitoring
- Webhook delivery logs
- Customer management
- Dispute handling

### Application Logs
- Webhook processing logs
- Video generation progress
- Error tracking
- Performance metrics

## Troubleshooting

### Common Issues

1. **Webhook 400 Errors**
   - Check webhook secret matches CLI output
   - Verify environment variables

2. **Invalid Price ID**
   - Ensure correct test/production prices
   - Check `stripe-config.ts`

3. **Video Generation Fails**
   - Verify `SUPERDUPERAI_API_KEY`
   - Check API endpoint accessibility

4. **Status Page Not Updating**
   - Check generation file permissions
   - Verify API endpoints

### Debug Commands
```bash
# Check environment
cat .env.local

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "ping"}'

# Check generation status
curl -X GET http://localhost:3000/api/generate-veo3?id=test_id
```

## Performance Optimizations

### Caching
- Generation status caching
- Static asset optimization
- CDN integration

### Database
- File-based status storage
- Cleanup of old generations
- Efficient status queries

### UI/UX
- Loading states
- Error boundaries
- Mobile optimization
- Accessibility features

## Future Enhancements

### Planned Features
- [ ] Email notifications
- [ ] Bulk video generation
- [ ] Advanced progress tracking
- [ ] Video preview thumbnails
- [ ] Generation history
- [ ] User accounts
- [ ] Subscription plans
- [ ] API rate limiting

### Technical Improvements
- [ ] Database integration
- [ ] Redis caching
- [ ] Queue system
- [ ] Monitoring dashboard
- [ ] A/B testing
- [ ] Analytics integration

## Support

### Documentation
- [Testing Guide](./testing-guide.md)
- [Webhook Setup](./webhook-setup.md)
- [Production Setup](./webhook-production-setup.md)

### Scripts
- `./scripts/switch-stripe-mode.sh` - Environment switching
- `./scripts/test-payment-flow.sh` - Payment testing
- `./scripts/test-webhook.sh` - Webhook testing

### Contact
For technical support or questions, please refer to the project documentation or contact the development team. 