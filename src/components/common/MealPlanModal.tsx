import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MealPlanOption, SingleMealRequest } from '../../types/mealPlan';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import { useUserStore } from '../../store/userStore';
import { 
  spoonacularAPI, 
  mapDietaryPreferences, 
  mapAllergies, 
  mapCookingTime,
  RecipeSearchParams
} from '../../config/spoonacularApi';

interface Props {
  visible: boolean;
  onClose: () => void;
  onMealPlanGenerated?: (mealPlan: any) => void;
}

const MEAL_PLAN_OPTIONS: MealPlanOption[] = [
  {
    id: 'single',
    title: 'Single Meal',
    subtitle: 'Generate one delicious meal',
    icon: 'food',
  },
  {
    id: 'weekly',
    title: '7-Day Plan',
    subtitle: 'Full weekly meal planning',
    icon: 'calendar-week',
    isPremium: false, // Will be true later
  },
];

const MEAL_TYPES = [
  { id: 'any', name: 'Any Meal', icon: 'food' },
  { id: 'breakfast', name: 'Breakfast', icon: 'coffee' },
  { id: 'lunch', name: 'Lunch', icon: 'food-variant' },
  { id: 'dinner', name: 'Dinner', icon: 'silverware-fork-knife' },
] as const;

// Map our meal types to Spoonacular API meal types
const mapMealTypeToApiType = (mealType: 'any' | 'breakfast' | 'lunch' | 'dinner'): RecipeSearchParams['type'] => {
  switch (mealType) {
    case 'breakfast':
      return 'breakfast';
    case 'lunch':
      return 'main course';
    case 'dinner':
      return 'main course';
    default:
      return undefined;
  }
};

export const MealPlanModal: React.FC<Props> = ({ visible, onClose, onMealPlanGenerated }) => {
  const [step, setStep] = useState<'select' | 'single-config' | 'generating'>('select');
  const [selectedOption, setSelectedOption] = useState<'single' | 'weekly' | null>(null);
  const [singleMealRequest, setSingleMealRequest] = useState<SingleMealRequest>({
    servings: 2,
    mealType: 'any',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const { responses } = useQuestionnaireStore();
  const { isPremium, allergies, dietaryPreference } = useUserStore();

  const handleOptionSelect = (optionId: 'single' | 'weekly') => {
    setSelectedOption(optionId);
    
    if (optionId === 'single') {
      setStep('single-config');
    } else {
      // For weekly plan, generate immediately
      generateWeeklyPlan();
    }
  };

  const handleSingleMealGenerate = () => {
    generateSingleMeal();
  };

  // Helper function to combine allergies from both sources
  const getCombinedAllergies = () => {
    // Get allergies from questionnaire responses
    const questionnaireAllergies = responses.foodAllergies || [];
    
    // Get allergies from user store
    const userAllergies = allergies || [];
    
    // Combine and remove duplicates
    const combinedAllergies = [...new Set([...questionnaireAllergies, ...userAllergies])];
    
    return combinedAllergies;
  };

  // Helper function to get dietary preferences
  const getDietaryPreferences = () => {
    // First check user store for specific preference
    if (dietaryPreference) {
      return [dietaryPreference];
    }
    
    // Fall back to questionnaire responses
    return responses.culturalPreferences || [];
  };

  const generateSingleMeal = async () => {
    setIsLoading(true);
    setStep('generating');

    try {
      // Get combined user preferences
      const combinedAllergies = getCombinedAllergies();
      const dietaryPreferences = getDietaryPreferences();
      
      // Map user preferences to API parameters
      const diet = mapDietaryPreferences(dietaryPreferences);
      const intolerances = mapAllergies(combinedAllergies);
      const excludeIngredients = responses.unwantedFoods.join(',');
      const maxReadyTime = mapCookingTime(responses.weekdayCookingTime);

      const searchParams = {
        number: 1,
        diet: diet || undefined,
        intolerances: intolerances || undefined,
        excludeIngredients: excludeIngredients || undefined,
        maxReadyTime,
        type: mapMealTypeToApiType(singleMealRequest.mealType),
      };

      console.log('Generating meal with parameters:', searchParams);

      const result = await spoonacularAPI.getRandomRecipes(searchParams);
      
      if (result.recipes && result.recipes.length > 0) {
        const recipe = result.recipes[0];
        const mealPlan = {
          type: 'single' as const,
          meals: [{
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes || 30,
            servings: singleMealRequest.servings,
            sourceUrl: recipe.sourceUrl,
            summary: recipe.summary,
            ingredients: recipe.extendedIngredients?.map(ing => ({
              id: ing.id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              original: ing.original,
            })),
          }],
          generatedAt: new Date().toISOString(),
          servings: singleMealRequest.servings,
        };

        onMealPlanGenerated?.(mealPlan);
        handleClose();
      } else {
        Alert.alert(
          'No recipes found',
          'We couldn\'t find any recipes matching your preferences. Try adjusting your dietary restrictions or try again.',
        );
      }
    } catch (error) {
      console.error('Error generating single meal:', error);
      Alert.alert(
        'Error',
        'Failed to generate meal plan. Please check your internet connection and try again.',
      );
    } finally {
      setIsLoading(false);
      setStep('select');
    }
  };

  const generateWeeklyPlan = async () => {
    setIsLoading(true);
    setStep('generating');

    try {
      // Get combined user preferences
      const combinedAllergies = getCombinedAllergies();
      const dietaryPreferences = getDietaryPreferences();
      
      // Map user preferences to API parameters
      const diet = mapDietaryPreferences(dietaryPreferences);
      const intolerances = mapAllergies(combinedAllergies);
      const excludeIngredients = responses.unwantedFoods.join(',');
      const maxReadyTime = mapCookingTime(responses.weekdayCookingTime);

      const searchParams = {
        number: 21,
        diet: diet || undefined,
        intolerances: intolerances || undefined,
        excludeIngredients: excludeIngredients || undefined,
        maxReadyTime,
        // Add minimum health score to ensure healthier options
        minHealthScore: 50,
      };

      console.log('Generating weekly plan with parameters:', searchParams);

      const result = await spoonacularAPI.searchRecipes(searchParams);
      
      if (result.results && result.results.length > 0) {
        const recipes = result.results;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        
        const weeklyPlan: any = {};
        let recipeIndex = 0;

        days.forEach(day => {
          weeklyPlan[day] = {};
          mealTypes.forEach(mealType => {
            if (recipeIndex < recipes.length) {
              const recipe = recipes[recipeIndex];
              weeklyPlan[day][mealType] = {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes || 30,
                servings: responses.peopleCount,
                sourceUrl: recipe.sourceUrl,
                summary: recipe.summary,
              };
              recipeIndex++;
            }
          });
        });

        const mealPlan = {
          type: 'weekly' as const,
          weeklyData: weeklyPlan,
          generatedAt: new Date().toISOString(),
          servings: responses.peopleCount,
        };

        onMealPlanGenerated?.(mealPlan);
        handleClose();
      } else {
        Alert.alert(
          'No recipes found',
          'We couldn\'t find enough recipes for a full week. Try adjusting your dietary restrictions or try again.',
        );
      }
    } catch (error) {
      console.error('Error generating weekly plan:', error);
      Alert.alert(
        'Error',
        'Failed to generate weekly meal plan. Please check your internet connection and try again.',
      );
    } finally {
      setIsLoading(false);
      setStep('select');
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedOption(null);
    setSingleMealRequest({ servings: 2, mealType: 'any' });
    setIsLoading(false);
    onClose();
  };

  const renderOptionSelection = () => (
    <View style={styles.content}>
      <Text style={[styles.title, isDarkMode && styles.textLight]}>
        Create Meal Plan
      </Text>
      <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
        Choose what you'd like to plan
      </Text>

      <View style={styles.optionsContainer}>
        {MEAL_PLAN_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
            ]}
            onPress={() => handleOptionSelect(option.id)}
          >
            <View style={styles.optionIcon}>
              <Icon name={option.icon} size={32} color="#5DB075" />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, isDarkMode && styles.textLight]}>
                {option.title}
              </Text>
              <Text style={[styles.optionSubtitle, isDarkMode && styles.textLightSecondary]}>
                {option.subtitle}
              </Text>
            </View>
            {option.isPremium && !isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
            <Icon name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSingleMealConfig = () => (
    <View style={styles.content}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setStep('select')}
      >
        <Icon name="chevron-left" size={24} color="#5DB075" />
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && styles.textLight]}>
        Single Meal
      </Text>
      <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
        Tell us about this meal
      </Text>

      <View style={styles.configSection}>
        <Text style={[styles.configLabel, isDarkMode && styles.textLight]}>
          How many people?
        </Text>
        <View style={styles.servingsContainer}>
          <TouchableOpacity
            style={styles.servingsButton}
            onPress={() => setSingleMealRequest(prev => ({
              ...prev,
              servings: Math.max(1, prev.servings - 1)
            }))}
          >
            <Icon name="minus" size={20} color="#5DB075" />
          </TouchableOpacity>
          <Text style={[styles.servingsText, isDarkMode && styles.textLight]}>
            {singleMealRequest.servings}
          </Text>
          <TouchableOpacity
            style={styles.servingsButton}
            onPress={() => setSingleMealRequest(prev => ({
              ...prev,
              servings: prev.servings + 1
            }))}
          >
            <Icon name="plus" size={20} color="#5DB075" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.configSection}>
        <Text style={[styles.configLabel, isDarkMode && styles.textLight]}>
          Meal type
        </Text>
        <View style={styles.mealTypesContainer}>
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mealTypeButton,
                isDarkMode && styles.mealTypeButtonDark,
                singleMealRequest.mealType === type.id && styles.mealTypeButtonSelected,
              ]}
              onPress={() => setSingleMealRequest(prev => ({
                ...prev,
                mealType: type.id
              }))}
            >
              <Icon 
                name={type.icon} 
                size={20} 
                color={singleMealRequest.mealType === type.id ? '#FFFFFF' : '#5DB075'} 
              />
              <Text style={[
                styles.mealTypeText,
                isDarkMode && styles.textLight,
                singleMealRequest.mealType === type.id && styles.mealTypeTextSelected,
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleSingleMealGenerate}
      >
        <Text style={styles.generateButtonText}>Generate Meal</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenerating = () => (
    <View style={[styles.content, styles.loadingContainer]}>
      <ActivityIndicator size="large" color="#5DB075" />
      <Text style={[styles.loadingTitle, isDarkMode && styles.textLight]}>
        Creating your meal plan...
      </Text>
      <Text style={[styles.loadingSubtitle, isDarkMode && styles.textLightSecondary]}>
        We're finding the perfect recipes for you
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {step === 'select' && renderOptionSelection()}
          {step === 'single-config' && renderSingleMealConfig()}
          {step === 'generating' && renderGenerating()}
        </ScrollView>
      </View>
    </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardDark: {
    backgroundColor: '#2A2A2A',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  premiumBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  configSection: {
    marginBottom: 30,
  },
  configLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  servingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    minWidth: 40,
    textAlign: 'center',
  },
  mealTypesContainer: {
    gap: 10,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealTypeButtonDark: {
    backgroundColor: '#2A2A2A',
  },
  mealTypeButtonSelected: {
    backgroundColor: '#5DB075',
    borderColor: '#5DB075',
  },
  mealTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 10,
  },
  mealTypeTextSelected: {
    color: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
}); 
