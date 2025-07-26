import { useRoute } from '@react-navigation/native';
import { useMemo } from 'react';

// Define the onboarding flow order - only the screens that should show progress bar
const ONBOARDING_SCREENS = [
  'HouseholdSetupScreen',
  'DietaryPreferencesScreen',
  'CookingSkillScreen',
  'FinalPersonalizationScreen',
  'DoctorInfo',
];

export const useOnboardingProgress = () => {
  const route = useRoute();
  const currentScreenName = route.name;

  const progress = useMemo(() => {
    const currentIndex = ONBOARDING_SCREENS.indexOf(currentScreenName);
    const currentStep = currentIndex >= 0 ? currentIndex + 1 : 1;
    const totalSteps = ONBOARDING_SCREENS.length;

    return {
      currentStep,
      totalSteps,
      currentScreenName,
      progressPercentage: (currentStep / totalSteps) * 100,
    };
  }, [currentScreenName]);

  return progress;
};
