import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserStore } from '../store/userStore';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DietaryPreferencesScreen from '../screens/onboarding/DietaryPreferencesScreen';
import AllergiesScreen from '../screens/onboarding/AllergiesScreen';
import PaywallScreen from '../screens/onboarding/PaywallScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  DietaryPreferences: undefined;
  AllergiesScreen: undefined;
  PaywallScreen: undefined;
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasCompletedOnboarding ? (
            <>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="DietaryPreferences" component={DietaryPreferencesScreen} />
              <Stack.Screen name="AllergiesScreen" component={AllergiesScreen} />
              <Stack.Screen name="PaywallScreen" component={PaywallScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainApp" component={MainTabNavigator} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Navigation; 
