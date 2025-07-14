/**
 * Stripe Configuration
 * Automatically selects the correct prices based on environment
 */

const isProduction = process.env.NODE_ENV === 'production';
const isLiveMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');

export const STRIPE_PRICES = {
  // Production prices (live mode)
  production: {
    single: 'price_1Rkse5K9tHMoWhKiQ0tg0b2N',  // $1.00 for 1 video
    triple: 'price_1Rkse7K9tHMoWhKise2iYOXL',  // $2.00 for 3 videos
  },
  // Test prices (test mode)
  test: {
    single: 'price_1RktnoK9tHMoWhKim5uqXiAe',  // $1.00 for 1 video (TEST)
    triple: 'price_1Rkto1K9tHMoWhKinvpEwntH',  // $2.00 for 3 videos (TEST)
  },
};

// Auto-select prices based on environment
export const getCurrentPrices = () => {
  if (isLiveMode) {
    return STRIPE_PRICES.production;
  }
  return STRIPE_PRICES.test;
};

// Helper functions
export const getSingleVideoPrice = () => getCurrentPrices().single;
export const getTripleVideoPrice = () => getCurrentPrices().triple;

// Export current prices for easy access
export const CURRENT_PRICES = getCurrentPrices();

// Log current configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🏪 Stripe Configuration:', {
    isProduction,
    isLiveMode,
    currentPrices: CURRENT_PRICES,
  });
} 