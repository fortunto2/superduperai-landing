# Redis Session Issues Troubleshooting Guide

## Problem: Session Not Found After Payment

### Symptoms
- User completes payment successfully
- Session lookup page shows "File Not Found"
- React hydration error #482 in browser console
- Redis contains prompt data but no webhook status

### Root Cause
Stripe webhook processing failed or was not triggered, leaving session data incomplete in Redis.

## Diagnostic Steps

### 1. Check Redis Data
```bash
# Check if prompt exists
node scripts/redis-analytics.js --prompts --limit 5

# Debug specific session
node scripts/redis-session-debug.js cs_live_xxx
```

### 2. Check API Response
```bash
curl -s "https://superduperai.co/api/webhook-status/cs_live_xxx" | jq .
```

### 3. Expected Redis Keys Structure
```
webhook:cs_live_xxx     # Webhook status data
session:cs_live_xxx     # Quick lookup mapping  
prompt:cs_live_xxx      # Full prompt data
```

## Fix Procedures

### Option 1: Quick Fix (Error Status)
```bash
node scripts/redis-session-debug.js cs_live_xxx --fix
```
This creates webhook status with error state, allowing user to see what happened.

### Option 2: Complete Fix (Generate Video)
```bash
SUPERDUPERAI_TOKEN=your_token node scripts/redis-session-debug.js cs_live_xxx --generate
```
This actually starts video generation for the failed session.

## Prevention Measures

### 1. Webhook Monitoring
- Monitor Stripe webhook delivery in dashboard
- Set up alerts for failed webhooks
- Implement retry mechanisms

### 2. Redis Health Checks
```bash
# Regular Redis connectivity check
redis-cli ping

# Check Redis memory usage
redis-cli info memory
```

### 3. Hydration Error Prevention
- Use `useEffect` for client-side only operations
- Implement proper loading states
- Add `suppressHydrationWarning` only when necessary

## Scripts Reference

### redis-session-debug.js
```bash
# View session data
node scripts/redis-session-debug.js <sessionId>

# Fix with error status
node scripts/redis-session-debug.js <sessionId> --fix

# Generate video
SUPERDUPERAI_TOKEN=<token> node scripts/redis-session-debug.js <sessionId> --generate
```

### redis-analytics.js
```bash
# View recent prompts
node scripts/redis-analytics.js --prompts

# View statistics
node scripts/redis-analytics.js --stats
```

## Common Issues

### 1. SSL Certificate Errors
```
Error: unable to verify the first certificate
```
**Solution**: Use correct API endpoint (dev-editor.superduperai.co)

### 2. Token Not Found
```
Error: SUPERDUPERAI_TOKEN environment variable is not set
```
**Solution**: Set token in environment or pass directly to script

### 3. Hydration Mismatch
```
React error #482: Text content does not match server-rendered HTML
```
**Solution**: Implement client-side only rendering with `useEffect`

## Monitoring

### Key Metrics to Track
- Webhook success rate
- Session lookup success rate
- Video generation success rate
- Redis memory usage

### Logs to Monitor
- Stripe webhook logs
- SuperDuperAI API responses
- Redis connection errors
- Next.js hydration warnings

This guide should help diagnose and fix similar issues in the future. 