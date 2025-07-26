import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgressBar from './OnboardingProgressBar';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';

interface OnboardingScreenWrapperProps {
  children: React.ReactNode;
  showProgressBar?: boolean;
  showPercentage?: boolean;
}

const OnboardingScreenWrapper: React.FC<OnboardingScreenWrapperProps> = ({
  children,
  showProgressBar = true,
  showPercentage = true,
}) => {
  const { currentStep, totalSteps } = useOnboardingProgress();

  return (
    <View style={styles.container}>
      {showProgressBar && (
        <OnboardingProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          showPercentage={showPercentage}
        />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});

export default OnboardingScreenWrapper; 
