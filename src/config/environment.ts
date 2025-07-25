// Environment configuration for the app
// In production, these should be managed through environment variables

export const ENVIRONMENT = {
  // IAP Configuration
  // Product IDs for in-app purchases
  IAP: {
    PRODUCT_IDS: {
      WEEKLY_SUBSCRIPTION: 'weekly_subscription',
      MONTHLY_SUBSCRIPTION: 'monthly_subscription',
      YEARLY_SUBSCRIPTION: 'yearly_subscription',
    },
  },

  // AI Configuration
  AI: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
  },

  // App Configuration
  APP: {
    NAME: 'Metabyl',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_PURCHASES: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRASH_REPORTING: true,
  },

  // Development Settings
  DEVELOPMENT: {
    ENABLE_DEBUG_LOGS: __DEV__,
    ENABLE_MOCK_DATA: __DEV__,
  },
};

// Helper function to get IAP product IDs
export const getIAPProductIds = () => {
  return ENVIRONMENT.IAP.PRODUCT_IDS;
};

// Helper function to get Gemini API key
export const getGeminiApiKey = () => {
  return ENVIRONMENT.AI.GEMINI_API_KEY;
};

// Helper function to check if purchases are enabled
export const isPurchasesEnabled = (): boolean => {
  return ENVIRONMENT.FEATURES.ENABLE_PURCHASES;
};

// Helper function to check if debug logs are enabled
export const isDebugEnabled = (): boolean => {
  return ENVIRONMENT.DEVELOPMENT.ENABLE_DEBUG_LOGS;
};
