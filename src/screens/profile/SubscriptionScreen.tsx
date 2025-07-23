import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserStore } from '../../store/userStore';
import { SUBSCRIPTION_PLANS } from '../../config/iapService';

const SubscriptionScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  const isPremium = useUserStore((state) => state.isPremium);
  const subscriptionPlan = useUserStore((state) => state.subscriptionPlan);
  const checkSubscriptionStatus = useUserStore((state) => state.checkSubscriptionStatus);
  const restorePurchases = useUserStore((state) => state.restorePurchases);

  useEffect(() => {
    checkSubscriptionStatus().finally(() => {
      setIsCheckingStatus(false);
    });
  }, [checkSubscriptionStatus]);

  const handleRestorePurchases = async () => {
    setIsLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Success', 'Your purchases have been restored successfully!');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPlanInfo = () => {
    if (!subscriptionPlan) return null;
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscriptionPlan);
  };

  const currentPlan = getCurrentPlanInfo();

  if (isCheckingStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DB075" />
        <Text style={styles.loadingText}>Checking subscription status...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Subscription</Text>
          <Text style={styles.subtitle}>
            Manage your Metabyl subscription
          </Text>
        </View>

        {/* Current Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon 
              name={isPremium ? "crown" : "account"} 
              size={24} 
              color={isPremium ? "#FFD700" : "#666"} 
            />
            <Text style={styles.statusTitle}>
              {isPremium ? 'Premium Member' : 'Free User'}
            </Text>
          </View>
          
          {isPremium && currentPlan ? (
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{currentPlan.name} Plan</Text>
              <Text style={styles.planPrice}>
                {currentPlan.price} {currentPlan.period}
              </Text>
              <Text style={styles.planDescription}>
                You have access to all premium features
              </Text>
            </View>
          ) : (
            <Text style={styles.freeDescription}>
              Upgrade to premium to unlock all features
            </Text>
          )}
        </View>

        {/* Available Plans */}
        {!isPremium && (
          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Available Plans</Text>
            {SUBSCRIPTION_PLANS.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planCardName}>{plan.name}</Text>
                  {plan.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planCardPrice}>
                  {plan.price} {plan.period}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, isLoading && styles.disabledButton]}
            onPress={handleRestorePurchases}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Restore Purchases</Text>
              </>
            )}
          </TouchableOpacity>

          {isPremium && (
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                Alert.alert(
                  'Manage Subscription',
                  'To manage your subscription, please go to your device settings:\n\niOS: Settings > Apple ID > Subscriptions\nAndroid: Google Play Store > Menu > Subscriptions',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Icon name="settings" size={20} color="#5DB075" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Manage Subscription
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color="#5DB075" />
              <Text style={styles.featureText}>Unlimited meal plans</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color="#5DB075" />
              <Text style={styles.featureText}>Advanced recipe filtering</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color="#5DB075" />
              <Text style={styles.featureText}>Priority customer support</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color="#5DB075" />
              <Text style={styles.featureText}>Exclusive recipes</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color="#5DB075" />
              <Text style={styles.featureText}>Nutritional insights</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  planInfo: {
    marginTop: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#5DB075',
    fontWeight: '500',
  },
  freeDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  popularBadge: {
    backgroundColor: '#5DB075',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planCardPrice: {
    fontSize: 14,
    color: '#666',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5DB075',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#5DB075',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default SubscriptionScreen; 
