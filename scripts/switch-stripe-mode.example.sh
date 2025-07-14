#!/bin/bash

# Script to switch between Stripe test and production modes
# Copy this file to switch-stripe-mode.sh and add your actual keys

if [ "$1" = "test" ]; then
    echo "Switching to Stripe TEST mode..."
    echo "# Stripe Configuration - TEST MODE" > .env.local
    echo "STRIPE_SECRET_KEY=\"sk_test_YOUR_TEST_SECRET_KEY_HERE\"" >> .env.local
    echo "STRIPE_WEBHOOK_SECRET=\"whsec_YOUR_TEST_WEBHOOK_SECRET_HERE\"" >> .env.local
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE\"" >> .env.local
    echo "" >> .env.local
    echo "# SuperDuperAI API Configuration" >> .env.local
    echo "SUPERDUPERAI_TOKEN=\"your_token_here\"" >> .env.local
    echo "SUPERDUPERAI_URL=\"https://dev-editor.superduperai.co\"" >> .env.local
    echo "" >> .env.local
    echo "# Next.js Configuration" >> .env.local
    echo "NEXT_PUBLIC_BASE_URL=\"http://localhost:3000\"" >> .env.local
    echo "NEXT_PUBLIC_APP_URL=\"http://localhost:3000\"" >> .env.local
    echo "✅ Switched to TEST mode"
    
elif [ "$1" = "prod" ]; then
    echo "Switching to Stripe PRODUCTION mode..."
    echo "# Stripe Configuration - PRODUCTION MODE" > .env.local
    echo "STRIPE_SECRET_KEY=\"sk_live_YOUR_LIVE_SECRET_KEY_HERE\"" >> .env.local
    echo "STRIPE_WEBHOOK_SECRET=\"whsec_YOUR_LIVE_WEBHOOK_SECRET_HERE\"" >> .env.local
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE\"" >> .env.local
    echo "" >> .env.local
    echo "# SuperDuperAI API Configuration" >> .env.local
    echo "SUPERDUPERAI_TOKEN=\"your_production_token_here\"" >> .env.local
    echo "SUPERDUPERAI_URL=\"https://api.superduperai.co\"" >> .env.local
    echo "" >> .env.local
    echo "# Next.js Configuration" >> .env.local
    echo "NEXT_PUBLIC_BASE_URL=\"https://superduperai.co\"" >> .env.local
    echo "NEXT_PUBLIC_APP_URL=\"https://superduperai.co\"" >> .env.local
    echo "✅ Switched to PRODUCTION mode"
    
else
    echo "Usage: $0 [test|prod]"
    echo "  test - Switch to test mode for local development with Stripe CLI"
    echo "  prod - Switch to production mode for live deployment"
    echo ""
    echo "Note: Copy this file to switch-stripe-mode.sh and add your actual Stripe keys"
    exit 1
fi

echo ""
echo "Current .env.local contents:"
cat .env.local 