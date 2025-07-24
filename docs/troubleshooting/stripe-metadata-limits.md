# Stripe Metadata Limits and Long Prompt Handling

## Problem
Stripe has strict limits on metadata that can cause checkout session creation to fail silently:
- **500 characters** per metadata value
- **50 keys** maximum per object
- **8KB total** metadata size (approximate)

## Our Solution

### Long Prompt Strategy
1. **Short prompts (≤400 chars)**: Store directly in Stripe metadata
2. **Long prompts (>400 chars)**: Store in Redis KV, use reference in metadata

### Implementation
```typescript
const isLongPrompt = promptToStore.length > 400;

if (isLongPrompt) {
  metadataPrompt = `[PROMPT:${promptToStore.length}chars]`;
} else {
  metadataPrompt = promptToStore;
}
```

## Troubleshooting Null Metadata

### Symptoms
- Checkout session created successfully
- `session.metadata` returns `null`
- Webhook receives empty metadata
- Video generation fails

### Diagnosis
```bash
# Check if metadata is null
curl -s "https://api.stripe.com/v1/checkout/sessions/cs_xxx" \
  -u "sk_xxx:" | jq '.metadata'

# Should return object, not null
```

### Common Causes
1. **Metadata too large** - exceeds Stripe limits
2. **Special characters** - invalid JSON in metadata values
3. **API errors** - Stripe silently truncates oversized metadata

### Prevention
- Always validate metadata size before sending to Stripe
- Use KV storage for large data
- Implement fallback handling in webhooks

## Recovery Process

### If Metadata is Null
1. **Check Redis KV** - prompt might still be stored
2. **Manual intervention** - use debug scripts
3. **Regenerate** - create new checkout with fixed metadata

### Debug Commands
```bash
# Check what's in Redis
node scripts/redis-session-debug.js cs_xxx

# Check Stripe session
curl -s "https://api.stripe.com/v1/checkout/sessions/cs_xxx" \
  -u "sk_xxx:" | jq '.metadata'
```

## Best Practices

### Metadata Design
- Keep values under 400 characters
- Use references for large data
- Always have fallback handling
- Log metadata size before creation

### Error Handling
```typescript
try {
  const session = await stripe.checkout.sessions.create({
    // ... other options
    metadata: validatedMetadata
  });
} catch (error) {
  console.error('Stripe session creation failed:', error);
  // Implement fallback or retry logic
}
```

This ensures robust handling of large prompts and prevents silent failures. 