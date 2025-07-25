import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ComprehensiveMealPlanDisplay } from '../../components/common/ComprehensiveMealPlanDisplay';
import { RootStackParamList } from '../../navigation';

type ComprehensiveMealPlanScreenRouteProp = RouteProp<RootStackParamList, 'ComprehensiveMealPlan'>;

const ComprehensiveMealPlanScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute<ComprehensiveMealPlanScreenRouteProp>();
  const { mealPlan } = route.params;

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ComprehensiveMealPlanDisplay mealPlan={mealPlan} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
});

export default ComprehensiveMealPlanScreen; 
