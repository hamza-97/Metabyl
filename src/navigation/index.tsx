import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserStore } from '../store/userStore';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DietaryPreferencesScreenOnboarding from '../screens/onboarding/DietaryPreferencesScreen';
import AllergiesScreen from '../screens/onboarding/AllergiesScreen';
import { QuestionnaireScreen } from '../screens/QuestionnaireScreen';
import { HouseholdSizeScreen } from '../screens/questionnaire/HouseholdSizeScreen';
import { ChildrenQuestionScreen } from '../screens/questionnaire/ChildrenQuestionScreen';
import { DietaryPreferencesScreen } from '../screens/questionnaire/DietaryPreferencesScreen';
import { CookingSkillScreen } from '../screens/questionnaire/CookingSkillScreen';
import { ShoppingPreferencesScreen } from '../screens/questionnaire/ShoppingPreferencesScreen';
import { FinalPersonalizationScreen } from '../screens/questionnaire/FinalPersonalizationScreen';
import { FinalPersonalizationTwoScreen } from '../screens/questionnaire/FinalPersonalizationTwoScreen';
import PaywallScreen from '../screens/onboarding/PaywallScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AuthenticationChoiceScreen from '../screens/auth/AuthenticationChoiceScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  DietaryPreferences: undefined;
  AllergiesScreen: undefined;
  Questionnaire: undefined;
  HouseholdSizeScreen: undefined;
  ChildrenQuestionScreen: undefined;
  DietaryPreferencesScreen: undefined;
  CookingSkillScreen: undefined;
  ShoppingPreferencesScreen: undefined;
  FinalPersonalizationScreen: undefined;
  FinalPersonalizationTwoScreen: undefined;
  AuthChoice: undefined;
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
              <Stack.Screen name="DietaryPreferences" component={DietaryPreferencesScreenOnboarding} />
              <Stack.Screen name="AllergiesScreen" component={AllergiesScreen} />
              <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
              <Stack.Screen name="HouseholdSizeScreen" component={HouseholdSizeScreen} />
              <Stack.Screen name="ChildrenQuestionScreen" component={ChildrenQuestionScreen} />
              <Stack.Screen name="DietaryPreferencesScreen" component={DietaryPreferencesScreen} />
              <Stack.Screen name="CookingSkillScreen" component={CookingSkillScreen} />
              <Stack.Screen name="ShoppingPreferencesScreen" component={ShoppingPreferencesScreen} />
              <Stack.Screen name="FinalPersonalizationScreen" component={FinalPersonalizationScreen} />
              <Stack.Screen name="FinalPersonalizationTwoScreen" component={FinalPersonalizationTwoScreen} />
              <Stack.Screen name="AuthChoice" component={AuthenticationChoiceScreen} />
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
