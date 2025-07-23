# React Native IAP Integration - Technical Documentation

This document provides technical details about the react-native-iap integration implemented in the Metabyl app.

## Overview

The react-native-iap integration provides a complete subscription management system for the Metabyl app, allowing users to purchase and manage premium subscriptions directly through the native app stores.

## Architecture

### Core Components

1. **IAPService** (`src/config/iapService.ts`)

   - Singleton service for managing all IAP operations
   - Handles initialization, purchases, and subscription status
   - Provides error handling and logging

2. **User Store Integration** (`src/store/userStore.ts`)

   - Extended with IAP-specific actions
   - Manages subscription state and premium status
   - Provides actions for purchasing and restoring subscriptions

3. **Paywall Screen** (`src/screens/onboarding/PaywallScreen.tsx`)

   - Updated to use real IAP purchases
   - Includes loading states and error handling
   - Supports restore purchases functionality

4. **Subscription Management Screen** (`src/screens/profile/SubscriptionScreen.tsx`)
   - New screen for managing subscriptions
   - Shows current subscription status
   - Provides restore purchases functionality

## Implementation Details

### IAP Service

The `IAPService` class provides the following key methods:

```typescript
// Initialize IAP connection
async initialize(): Promise<void>

// Get available subscription products
async getSubscriptions(): Promise<Subscription[]>

// Purchase a subscription
async purchaseSubscription(productId: string): Promise<boolean>

// Restore previous purchases
async restorePurchases(): Promise<boolean>

// Check if user has active subscription
async checkIfUserHasActiveSubscription(): Promise<boolean>

// Get the current subscription plan
async getActiveSubscriptionPlan(): Promise<string | null>
```

### User Store Extensions

The user store has been extended with IAP-specific actions:

```typescript
// Check subscription status from IAP
checkSubscriptionStatus: () => Promise<void>;

// Purchase a subscription
purchaseSubscription: (productId: string) => Promise<boolean>;

// Restore previous purchases
restorePurchases: () => Promise<boolean>;
```

### Product Configuration

The app supports three subscription tiers:

```typescript
export const PRODUCT_IDS = {
  WEEKLY_SUBSCRIPTION: 'weekly_subscription',
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  YEARLY_SUBSCRIPTION: 'yearly_subscription',
};
```

## Environment Configuration

The integration uses environment-based configuration for product IDs:

```typescript
// src/config/environment.ts
export const ENVIRONMENT = {
  IAP: {
    PRODUCT_IDS: {
      WEEKLY_SUBSCRIPTION: 'weekly_subscription',
      MONTHLY_SUBSCRIPTION: 'monthly_subscription',
      YEARLY_SUBSCRIPTION: 'yearly_subscription',
    },
  },
  // ... other configuration
};
```

## Error Handling

The implementation includes comprehensive error handling:

1. **Network Errors**: Graceful handling of network connectivity issues
2. **Purchase Failures**: User-friendly error messages for failed purchases
3. **Invalid Products**: Validation of product configurations
4. **Restore Failures**: Proper handling when no purchases are found to restore

## Testing

### Development Testing

1. **Sandbox Testing (iOS)**:

   - Use sandbox test accounts from App Store Connect
   - Test on physical devices (not simulator)
   - Verify purchase flow and receipt validation

2. **Test Account Testing (Android)**:
   - Use test accounts from Google Play Console
   - Test on physical devices
   - Verify subscription management

### Debug Mode

The integration includes debug logging:

```typescript
console.log('IAP initialized successfully');
console.log('Purchase completed successfully');
```

## Security Considerations

1. **Product ID Management**: Product IDs are managed through environment variables
2. **Receipt Validation**: Server-side receipt validation should be implemented
3. **Purchase Verification**: All purchases are verified through native app stores

## Performance Optimizations

1. **Lazy Initialization**: IAP is initialized only when needed
2. **Caching**: Subscription status is cached in the user store
3. **Error Recovery**: Automatic retry mechanisms for failed operations

## Integration Points

### App Initialization

IAP is initialized in `App.tsx`:

```typescript
useEffect(() => {
  AsyncStorage.clear();

  // Initialize IAP
  IAPService.initialize().catch((error: any) => {
    console.error('Failed to initialize IAP:', error);
  });
}, []);
```

### Navigation Integration

The subscription screen is accessible through:

- Settings screen → Subscription
- Direct navigation to 'Subscription' screen

### State Management

Subscription state is managed through Zustand store:

- `isPremium`: Boolean indicating premium status
- `subscriptionPlan`: String indicating current plan
- Actions for purchasing and restoring subscriptions

## Dependencies

The integration requires the following dependencies:

```json
{
  "react-native-iap": "^12.0.0"
}
```

## Platform-Specific Configuration

### iOS Configuration

1. **Pod Installation**: react-native-iap pods are automatically linked
2. **App Store Connect**: In-app purchases must be configured
3. **Sandbox Testing**: Requires sandbox test accounts

### Android Configuration

1. **Gradle Dependencies**: react-native-iap is automatically linked
2. **Google Play Console**: Subscription products must be configured
3. **Test Accounts**: Requires test accounts for testing

## Monitoring and Analytics

The integration provides hooks for monitoring:

1. **Purchase Events**: Track successful and failed purchases
2. **Subscription Status**: Monitor subscription lifecycle
3. **Error Tracking**: Log and monitor errors

## Future Enhancements

Potential improvements for the integration:

1. **Promotional Offers**: Support for promotional pricing
2. **Family Sharing**: iOS family sharing support
3. **Subscription Management**: Advanced subscription management features
4. **A/B Testing**: Support for testing different pricing strategies
5. **Analytics Integration**: Enhanced analytics and reporting

## Troubleshooting

### Common Issues

1. **Purchase Fails**: Verify product IDs match exactly
2. **Sandbox Not Working**: Ensure using sandbox test accounts
3. **Receipt Validation**: Implement server-side validation
4. **Subscription Status**: Check product configuration

### Debug Information

Enable debug logging to troubleshoot issues:

```typescript
// Check console for detailed IAP logs
if (__DEV__) {
  console.log('IAP debug logs enabled');
}
```

## Support Resources

- [React Native IAP Documentation](https://github.com/dooboolab/react-native-iap)
- [React Native IAP Support](https://github.com/dooboolab/react-native-iap/issues)
