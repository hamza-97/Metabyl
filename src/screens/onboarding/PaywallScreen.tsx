import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserStore } from '../../store/userStore';

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  isPopular?: boolean;
};

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: '$2.99',
    period: 'per week',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    isPopular: true,
  },
];

const PaywallScreen = () => {
  // Get state and actions from store
  const subscriptionPlan = useUserStore((state) => state.subscriptionPlan);
  const setSubscriptionPlan = useUserStore((state) => state.setSubscriptionPlan);
  const setPremiumStatus = useUserStore((state) => state.setPremiumStatus);
  const setHasCompletedOnboarding = useUserStore((state) => state.setHasCompletedOnboarding);

  // Set default selection to monthly
  React.useEffect(() => {
    if (!subscriptionPlan) {
      setSubscriptionPlan('monthly');
    }
  }, [subscriptionPlan, setSubscriptionPlan]);

  const handleSubscribe = () => {
    setPremiumStatus(true);
    setHasCompletedOnboarding(true);
    // navigation.navigate('MainApp');
  };

  const handleContinueFree = () => {
    setPremiumStatus(false);
    setHasCompletedOnboarding(true);
    // navigation.navigate('MainApp');
  };

  const features = [
    'Free trial for new users',
    'All meal plans and features',
    'Cancel anytime from the app',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.overlay} />
      <ImageBackground
        source={require('../../../assets/img/1.jpg')}
        style={styles.backgroundImage}
      >

        
        <ScrollView contentContainerStyle={styles.safeArea}>
          {/* Green Header */}
          <View style={styles.greenHeader}>
            <Text style={styles.greenHeaderText}>Metabyl</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleContinueFree}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enjoy full access</Text>
              <Text style={styles.subtitle}>with Metabyl</Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Icon name="check" size={24} color="white" style={styles.checkIcon} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Subscription Plans */}
            <View style={styles.plansContainer}>
              {subscriptionPlans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planButton,
                    subscriptionPlan === plan.id && styles.selectedPlan,
                  ]}
                  onPress={() => setSubscriptionPlan(plan.id)}
                >
                  <View style={styles.planContent}>
                    <View style={styles.planInfo}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planPrice}>
                        {plan.price} <Text style={styles.planPeriod}>{plan.period}</Text>
                      </Text>
                    </View>
                    <View style={[
                      styles.radioButton,
                      subscriptionPlan === plan.id && styles.radioButtonSelected
                    ]}>
                      {subscriptionPlan === plan.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                  {plan.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>

            {/* Continue Free Button */}
            <TouchableOpacity style={styles.continueButton} onPress={handleContinueFree}>
              <Text style={styles.continueButtonText}>Maybe Later</Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              3 days free, then {subscriptionPlan === 'weekly' ? '$2.99/week' : '$9.99/month'}. Cancel anytime.
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  safeArea: {
    flex: 1,
  },
  greenHeader: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  greenHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 12,
    fontWeight:'bold'
  },
  featureText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  plansContainer: {
    marginBottom: 24,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  planButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    width:'45%'
  },
  selectedPlan: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#FFFFFF',
  },
  planContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  popularBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  continueButton: {
    paddingVertical: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PaywallScreen; 
