# React Native IAP Integration Setup Guide

This guide will help you complete the react-native-iap integration for your Metabyl app.

## 1. App Store Connect Setup (iOS)

### Create In-App Purchases

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Go to "Features" → "In-App Purchases"
4. Create the following subscription products:

#### Weekly Subscription

- Product ID: `weekly_subscription`
- Type: Auto-Renewable Subscription
- Price: $2.99/week
- Subscription Group: Create a new group

#### Monthly Subscription

- Product ID: `monthly_subscription`
- Type: Auto-Renewable Subscription
- Price: $9.99/month
- Subscription Group: Same as weekly

#### Yearly Subscription

- Product ID: `yearly_subscription`
- Type: Auto-Renewable Subscription
- Price: $99.99/year
- Subscription Group: Same as weekly

### Configure Subscription Groups

1. In App Store Connect, go to "Features" → "Subscription Groups"
2. Create a subscription group for your app
3. Add all three subscription products to the same group
4. Set the monthly subscription as the primary product

## 2. Google Play Console Setup (Android)

### Create In-App Products

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Go to "Monetization" → "Products" → "Subscriptions"
4. Create the following subscription products:

#### Weekly Subscription

- Product ID: `weekly_subscription`
- Name: Weekly Subscription
- Price: $2.99/week
- Billing period: 1 week

#### Monthly Subscription

- Product ID: `monthly_subscription`
- Name: Monthly Subscription
- Price: $9.99/month
- Billing period: 1 month

#### Yearly Subscription

- Product ID: `yearly_subscription`
- Name: Yearly Subscription
- Price: $99.99/year
- Billing period: 1 year

## 3. Testing Setup

### Sandbox Testing (iOS)

1. Create sandbox test users in App Store Connect
2. Use these test accounts to test purchases
3. Make sure to test on a physical device (not simulator)

### Test Account Setup (Android)

1. Add test accounts in Google Play Console
2. Use these accounts to test purchases
3. Test on physical devices

## 4. Code Configuration

### Update Product IDs

Make sure the product IDs in `src/config/iapService.ts` match exactly with what you've configured in App Store Connect and Google Play Console:

```typescript
export const PRODUCT_IDS = {
  WEEKLY_SUBSCRIPTION: 'weekly_subscription',
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  YEARLY_SUBSCRIPTION: 'yearly_subscription',
};
```

### Testing the Integration

1. Build and run the app on a physical device
2. Navigate to the paywall screen
3. Test the purchase flow with sandbox/test accounts
4. Verify that subscription status is properly updated

## 5. Production Deployment

### App Store Review

1. Submit your app for App Store review
2. Make sure all in-app purchases are properly configured
3. Provide clear descriptions for each subscription tier

### Google Play Review

1. Submit your app for Google Play review
2. Ensure all subscription products are active
3. Test the purchase flow thoroughly

## 6. Analytics and Monitoring

### Purchase Analytics

1. Monitor subscription metrics in App Store Connect/Google Play Console
2. Set up alerts for failed purchases
3. Track conversion rates and revenue

### Error Handling

The current implementation includes error handling for:

- Failed purchases
- Network errors
- Invalid product configurations

## 7. Additional Features to Consider

### Promotional Offers

- Configure promotional pricing in App Store Connect
- Set up introductory offers for new subscribers

### Family Sharing (iOS)

- Enable family sharing for subscriptions
- Configure family sharing settings in App Store Connect

### Subscription Management

- Add a subscription management screen
- Allow users to change subscription plans
- Implement cancellation flow

## 8. Troubleshooting

### Common Issues

1. **Purchase fails**: Check product IDs match exactly
2. **Sandbox not working**: Ensure using sandbox test accounts
3. **Receipt validation**: Verify server-side receipt validation
4. **Subscription status**: Check product configuration

### Debug Mode

The app includes debug logging for IAP. Check the console for detailed logs during development.

## 9. Security Considerations

### Receipt Validation

- Implement server-side receipt validation
- Store purchase receipts securely
- Validate subscription status on app launch

### Product Configuration

- Never commit product IDs to version control
- Use environment variables for production
- Validate product IDs on app startup

## 10. Next Steps

After completing this setup:

1. Test all purchase flows thoroughly
2. Monitor analytics and user behavior
3. Optimize pricing based on user feedback
4. Consider implementing A/B testing for different pricing strategies

## Support

For additional help:

- [React Native IAP Documentation](https://github.com/dooboolab/react-native-iap)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
