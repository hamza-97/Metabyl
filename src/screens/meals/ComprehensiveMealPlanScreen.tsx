import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ComprehensiveMealPlanDisplay } from '../../components/common/ComprehensiveMealPlanDisplay';
import { RootStackParamList } from '../../navigation';

// Add navigation type
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ComprehensiveMealPlanScreenRouteProp = RouteProp<RootStackParamList, 'ComprehensiveMealPlan'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ComprehensiveMealPlanScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute<ComprehensiveMealPlanScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { mealPlan } = route.params;

  // Handler for recipe card press
  const handleRecipePress = (meal: { name: string; imageUrl?: string }, mealType: string, dayIndex: number) => {
    // Generate a unique id for the recipe (e.g., hash of name + day + mealType)
    const recipeId: number = Math.abs((meal.name + dayIndex + mealType).split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0));
    navigation.navigate('RecipeDetail', { 
      recipeId, 
      recipeTitle: meal.name,
      imageUrl: meal.imageUrl 
    });
  };
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainApp')} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#5DB075" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>Weekly Meal Plan</Text>
      </View>
      <ComprehensiveMealPlanDisplay mealPlan={mealPlan} onRecipePress={handleRecipePress} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  textLight: {
    color: '#FFF',
  },
});

export default ComprehensiveMealPlanScreen; 
