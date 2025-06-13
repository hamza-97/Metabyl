import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useUserStore } from '../../store/userStore';

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
};

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$79.99',
    period: 'per year',
    savings: 'Save 33%',
    isPopular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$199.99',
    period: 'one-time payment',
    savings: 'Best value',
  },
];

const PaywallScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';

  // Get state and actions from store
  const subscriptionPlan = useUserStore((state) => state.subscriptionPlan);
  const setSubscriptionPlan = useUserStore((state) => state.setSubscriptionPlan);
  const setPremiumStatus = useUserStore((state) => state.setPremiumStatus);
  const setHasCompletedOnboarding = useUserStore((state) => state.setHasCompletedOnboarding);

  const handleSubscribe = () => {
    // Process subscription
    setPremiumStatus(true);
    setHasCompletedOnboarding(true);
    navigation.navigate('MainApp');
  };

  const handleContinueFree = () => {
    // Skip subscription and continue with limited features
    setPremiumStatus(false);
    setHasCompletedOnboarding(true);
    navigation.navigate('MainApp');
  };

  const features = [
    'Unlimited AI-powered meal plans',
    'Personalized recipe recommendations',
    'Automatic shopping lists',
    'Nutritional information',
    'Save favorite recipes',
  ];

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Unlock Full Access
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
            Get personalized meal plans tailored to your preferences
          </Text>
        </View>

        <View style={styles.featureSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Icon name="check-circle" size={20} color="#5DB075" style={styles.featureIcon} />
              <Text style={[styles.featureText, isDarkMode && styles.textLight]}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plansSection}>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                isDarkMode && styles.planCardDark,
                subscriptionPlan === plan.id && styles.selectedPlan,
                plan.isPopular && styles.popularPlan,
              ]}
              onPress={() => setSubscriptionPlan(plan.id)}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              <View style={styles.planInfo}>
                <Text style={[styles.planName, isDarkMode && styles.textLight]}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, isDarkMode && styles.textLight]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.planPeriod, isDarkMode && styles.textLightSecondary]}>
                    {plan.period}
                  </Text>
                </View>
                {plan.savings && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
              </View>
              {subscriptionPlan === plan.id && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.freeButton} onPress={handleContinueFree}>
          <Text style={[styles.freeButtonText, isDarkMode && styles.textLight]}>
            Continue with limited version
          </Text>
        </TouchableOpacity>
        <Text style={[styles.termsText, isDarkMode && styles.textLightSecondary]}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions will automatically renew unless canceled before the renewal date.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featureSection: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
  },
  plansSection: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  planCardDark: {
    backgroundColor: '#2A2A2A',
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#5DB075',
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: '#5DB075',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#5DB075',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 5,
  },
  planPeriod: {
    fontSize: 14,
    color: '#666666',
  },
  savingsBadge: {
    backgroundColor: '#E8F5EF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  savingsText: {
    color: '#5DB075',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subscribeButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  freeButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  freeButtonText: {
    color: '#5DB075',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default PaywallScreen; 
