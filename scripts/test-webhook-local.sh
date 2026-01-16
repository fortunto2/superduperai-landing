#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🧪 Local Webhook Testing Setup${NC}"
echo "=================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo "Create .env.local with your Stripe keys:"
    echo ""
    echo "STRIPE_SECRET_KEY=sk_test_your_key"
    echo "STRIPE_WEBHOOK_SECRET=whsec_from_stripe_listen"
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key"
    exit 1
fi

# Check if stripe CLI is available
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI not found${NC}"
    echo "Install it: brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI not logged in${NC}"
    echo "Run: stripe login"
    exit 1
fi

echo -e "${YELLOW}1. Start the webhook listener:${NC}"
echo "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo -e "${YELLOW}2. Copy the webhook secret from the listener output${NC}"
echo "   Example: whsec_a29eb8a5a55092deb183391c121ffa172c208229e8ef3ddc9faac70adfce42f4"
echo ""
echo -e "${YELLOW}3. Update .env.local with the webhook secret${NC}"
echo "   STRIPE_WEBHOOK_SECRET=whsec_from_stripe_listen_output"
echo ""
echo -e "${YELLOW}4. Start the dev server:${NC}"
echo "   pnpm dev"
echo ""
echo -e "${YELLOW}5. Test the webhook:${NC}"
echo "   stripe trigger checkout.session.completed"
echo ""

echo -e "${GREEN}✅ Follow these steps to test webhook locally${NC}"

# Optional: Start webhook listener if user wants
echo -e "\n${YELLOW}Start webhook listener now? (y/n)${NC}"
read -r answer

if [[ $answer == "y" || $answer == "Y" ]]; then
    echo -e "${GREEN}Starting webhook listener...${NC}"
    echo -e "${YELLOW}Copy the webhook secret and update .env.local${NC}"
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
fi 