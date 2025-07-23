import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IAPService from '../config/iapService';

interface UserState {
  // User profile
  name: string | null;
  email: string | null;

  // Authentication
  authMethod: 'apple' | 'google' | 'local' | null;
  isLoggedIn: boolean;

  // Onboarding status
  hasCompletedOnboarding: boolean;

  // Preferences
  dietaryPreference: string | null;
  allergies: string[];
  measurementUnit: 'metric' | 'imperial';

  // Subscription
  isPremium: boolean;
  subscriptionPlan: string | null;

  // Actions
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAuthMethod: (method: 'apple' | 'google' | 'local') => void;
  setLoggedIn: (status: boolean) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  setDietaryPreference: (preference: string) => void;
  setAllergies: (allergies: string[]) => void;
  toggleAllergy: (allergyId: string) => void;
  setPremiumStatus: (status: boolean) => void;
  setSubscriptionPlan: (plan: string) => void;
  setMeasurementUnit: (unit: 'metric' | 'imperial') => void;
  resetUser: () => void;
  checkSubscriptionStatus: () => Promise<void>;
  purchaseSubscription: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      // Initial state
      name: null,
      email: null,
      authMethod: null,
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      dietaryPreference: null,
      allergies: [],
      measurementUnit: 'metric', // Default to metric
      isPremium: false,
      subscriptionPlan: null,

      // Actions
      setName: name => set({ name }),
      setEmail: email => set({ email }),
      setAuthMethod: method => set({ authMethod: method }),
      setLoggedIn: status => set({ isLoggedIn: status }),
      setHasCompletedOnboarding: status =>
        set({ hasCompletedOnboarding: status }),
      setDietaryPreference: preference =>
        set({ dietaryPreference: preference }),
      setAllergies: allergies => set({ allergies }),
      toggleAllergy: allergyId =>
        set(state => {
          if (state.allergies.includes(allergyId)) {
            return {
              allergies: state.allergies.filter(id => id !== allergyId),
            };
          } else {
            return { allergies: [...state.allergies, allergyId] };
          }
        }),
      setPremiumStatus: status => set({ isPremium: status }),
      setSubscriptionPlan: plan => set({ subscriptionPlan: plan }),
      setMeasurementUnit: unit => set({ measurementUnit: unit }),
      checkSubscriptionStatus: async () => {
        try {
          const hasActiveSubscription =
            await IAPService.checkIfUserHasActiveSubscription();
          const activePlan = await IAPService.getActiveSubscriptionPlan();

          set({
            isPremium: hasActiveSubscription,
            subscriptionPlan: activePlan,
          });
        } catch (error) {
          console.error('Failed to check subscription status:', error);
        }
      },
      purchaseSubscription: async (productId: string) => {
        try {
          const success = await IAPService.purchaseSubscription(productId);
          if (success) {
            const activePlan = await IAPService.getActiveSubscriptionPlan();
            set({
              isPremium: true,
              subscriptionPlan: activePlan,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to purchase subscription:', error);
          return false;
        }
      },
      restorePurchases: async () => {
        try {
          const success = await IAPService.restorePurchases();
          if (success) {
            const hasActiveSubscription =
              await IAPService.checkIfUserHasActiveSubscription();
            const activePlan = await IAPService.getActiveSubscriptionPlan();

            set({
              isPremium: hasActiveSubscription,
              subscriptionPlan: activePlan,
            });
            return hasActiveSubscription;
          }
          return false;
        } catch (error) {
          console.error('Failed to restore purchases:', error);
          return false;
        }
      },
      resetUser: () =>
        set({
          name: null,
          email: null,
          authMethod: null,
          isLoggedIn: false,
          dietaryPreference: null,
          allergies: [],
          measurementUnit: 'metric',
          isPremium: false,
          subscriptionPlan: null,
        }),
    }),
    {
      name: 'metabyl-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
