/**
 * API Keys Configuration
 *
 * ⚠️ IMPORTANT: Replace placeholder values with your actual API keys
 */

export const API_KEYS = {
  // 🔑 SPOONACULAR API KEY
  // Get your API key from: https://spoonacular.com/food-api/console#Dashboard
  // Free tier: 150 requests/day
  // Pricing: https://spoonacular.com/food-api/pricing
  SPOONACULAR: 'YOUR_SPOONACULAR_API_KEY_HERE',

  // You can add other API keys here as needed
  // EXAMPLE: 'YOUR_OTHER_API_KEY_HERE',
};

/**
 * Configuration validation
 */
export const validateApiKeys = () => {
  const missingKeys: string[] = [];

  if (API_KEYS.SPOONACULAR === 'YOUR_SPOONACULAR_API_KEY_HERE') {
    missingKeys.push('SPOONACULAR');
  }

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️ Missing API keys: ${missingKeys.join(', ')}\n` +
        'Please update src/config/apiKeys.ts with your actual API keys.',
    );
  }

  return missingKeys.length === 0;
};

// Auto-validate on import in development
if (__DEV__) {
  validateApiKeys();
}
