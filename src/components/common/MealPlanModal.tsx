import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
  Alert,
  TextInput,
  Animated,
  Image,
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
  RecipeSearchParams,
  Recipe,
  Ingredient
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

const COOKING_TIMES = [
  { id: 'any', name: 'Any Time', minutes: 0 },
  { id: 'quick', name: 'Quick (< 30 min)', minutes: 30 },
  { id: 'medium', name: '30-45 min', minutes: 45 },
  { id: 'long', name: '45+ min', minutes: 60 },
];

// CLEAN animation definitions
const CLEAN_DEFINITIONS = [
  { letter: 'C', definition: 'Creating your perfect meal' },
  { letter: 'L', definition: 'Looking for the best ingredients' },
  { letter: 'E', definition: 'Exploring delicious recipes' },
  { letter: 'A', definition: 'Analyzing your preferences' },
  { letter: 'N', definition: 'Nailing the perfect match' },
];

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
  const [_selectedOption, setSelectedOption] = useState<'single' | 'weekly' | null>(null);
  const [singleMealRequest, setSingleMealRequest] = useState<SingleMealRequest>({
    servings: 2,
    mealType: 'any',
  });
  const [_isLoading, setIsLoading] = useState(false);
  const [desiredIngredients, setDesiredIngredients] = useState('');
  const [selectedCookingTime, setSelectedCookingTime] = useState(COOKING_TIMES[0].id);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cleanAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

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

  // Start the CLEAN animation sequence
  const startCleanAnimation = () => {
    // Reset animations
    fadeAnim.setValue(0);
    progressAnim.setValue(0);
    cleanAnimations.forEach(anim => anim.setValue(0));
    
    // Start animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();

    const definitionDelay = 600; 
    cleanAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 500 + (index * definitionDelay)); 
    });
  };

  const generateSingleMeal = async () => {
    setIsLoading(true);
    setStep('generating');
    startCleanAnimation();

    try {
      // Get combined user preferences
      const combinedAllergies = getCombinedAllergies();
      const dietaryPreferences = getDietaryPreferences();
      
      // Map user preferences to API parameters
      const diet = mapDietaryPreferences(dietaryPreferences);
      const intolerances = mapAllergies(combinedAllergies);
      
      // Handle chicken allergy specifically
      let excludeIngredients = responses.unwantedFoods.join(',');
      if (combinedAllergies.includes('Chicken')) {
        excludeIngredients = excludeIngredients 
          ? `${excludeIngredients},chicken` 
          : 'chicken';
      }
      
      // Get cooking time limit based on selection
      const cookingTimeOption = COOKING_TIMES.find(time => time.id === selectedCookingTime);
      const maxReadyTime = cookingTimeOption && cookingTimeOption.id !== 'any' 
        ? cookingTimeOption.minutes 
        : undefined;

      // Process desired ingredients to ensure better matching
      const processedIngredients = desiredIngredients.trim();
      
      const searchParams = {
        number: 10, // Increase number of results to find better matches
        diet: diet || undefined,
        intolerances: intolerances || undefined,
        excludeIngredients: excludeIngredients || undefined,
        maxReadyTime,
        type: mapMealTypeToApiType(singleMealRequest.mealType),
        // Add the desired ingredients if specified
        includeIngredients: processedIngredients || undefined,
        // Add query parameter for better matching when ingredients are specified
        query: processedIngredients || undefined,
        // Ensure we get recipes with ingredients
        fillIngredients: true,
        addRecipeInformation: true,
        // Sort by readyInMinutes to prioritize recipes that match the time constraint
        sort: maxReadyTime ? 'time' : undefined,
        sortDirection: 'asc',
      };

      console.log('Generating meal with parameters:', searchParams);

      // Use searchRecipes instead of getRandomRecipes for better ingredient matching
      let recipes: Recipe[] = [];
      
      if (processedIngredients || maxReadyTime) {
        // Always use search for better filtering when we have specific constraints
        const searchResult = await spoonacularAPI.searchRecipes(searchParams);
        recipes = searchResult.results;
      } else {
        const randomResult = await spoonacularAPI.getRandomRecipes(searchParams);
        recipes = randomResult.recipes;
      }
        
      if (recipes && recipes.length > 0) {
        // Filter recipes that strictly meet the cooking time requirement
        let matchingRecipes = recipes;
        
        if (maxReadyTime) {
          matchingRecipes = recipes.filter(recipe => 
            (recipe.readyInMinutes || 999) <= maxReadyTime
          );
          
          // If no recipes match the time constraint exactly, fall back to the original list
          // but sort them by cooking time
          if (matchingRecipes.length === 0) {
            console.log('No recipes match the exact time constraint, using closest matches');
            matchingRecipes = [...recipes].sort((a, b) => 
              (a.readyInMinutes || 999) - (b.readyInMinutes || 999)
            );
          }
        }
        
        // Find the recipe that best matches the desired ingredients
        let bestRecipe = matchingRecipes[0];
        
        if (processedIngredients) {
          // Check if any recipe contains the desired ingredients in title
          const desiredIngredientsArray = processedIngredients.split(',').map(i => i.trim().toLowerCase());
          
          for (const recipe of matchingRecipes) {
            const titleLower = recipe.title.toLowerCase();
            const hasIngredientInTitle = desiredIngredientsArray.some(ing => titleLower.includes(ing));
            
            if (hasIngredientInTitle) {
              bestRecipe = recipe;
              break;
            }
          }
        }
        
        console.log('Selected recipe cooking time:', bestRecipe.readyInMinutes, 'minutes');
        
        const targetServings = responses.peopleCount || 2;
        const originalServings = bestRecipe.servings || 1;
        const servingMultiplier = targetServings / originalServings;
        
        // Scale ingredient quantities based on the serving multiplier
        const scaledIngredients = bestRecipe.extendedIngredients?.map((ing: Ingredient) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount * servingMultiplier,
          unit: ing.unit,
          // Update the original text to reflect the scaled amount
          original: ing.original.replace(
            /\b(\d+(\.\d+)?)\b/,
            (match: string) => (parseFloat(match) * servingMultiplier).toFixed(2).replace(/\.00$/, '')
          ),
        }));
        
        const mealPlan = {
          type: 'single' as const,
          meals: [{
            id: bestRecipe.id,
            title: bestRecipe.title,
            image: bestRecipe.image,
            readyInMinutes: bestRecipe.readyInMinutes || 30,
            servings: targetServings,
            sourceUrl: bestRecipe.sourceUrl,
            summary: bestRecipe.summary,
            ingredients: scaledIngredients,
          }],
          generatedAt: new Date().toISOString(),
          servings: targetServings,
        };

        // Wait for animations to complete
        setTimeout(() => {
          onMealPlanGenerated?.(mealPlan);
          handleClose();
        }, 4000); // Allow time for animations to complete
      } else {
        setIsLoading(false);
        setStep('single-config');
        Alert.alert(
          'No recipes found',
          'We couldn\'t find any recipes matching your preferences. Try adjusting your dietary restrictions or try again.',
        );
      }
    } catch (error) {
      console.error('Error generating single meal:', error);
      setIsLoading(false);
      setStep('single-config');
      Alert.alert(
        'Error',
        'Failed to generate meal plan. Please check your internet connection and try again.',
      );
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
      
      // Handle chicken allergy specifically
      let excludeIngredients = responses.unwantedFoods.join(',');
      if (combinedAllergies.includes('Chicken')) {
        excludeIngredients = excludeIngredients 
          ? `${excludeIngredients},chicken` 
          : 'chicken';
      }
      
      const maxReadyTime = mapCookingTime(responses.weekdayCookingTime);
      const targetServings = responses.peopleCount || 1;

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
              const originalServings = recipe.servings || 1;
              const servingMultiplier = targetServings / originalServings;
              
              // Scale ingredient quantities based on the serving multiplier
              const scaledIngredients = recipe.extendedIngredients?.map(ing => ({
                id: ing.id,
                name: ing.name,
                amount: ing.amount * servingMultiplier,
                unit: ing.unit,
                // Update the original text to reflect the scaled amount
                original: ing.original.replace(
                  /\b(\d+(\.\d+)?)\b/,
                  (match) => (parseFloat(match) * servingMultiplier).toFixed(2).replace(/\.00$/, '')
                ),
              }));
              
              weeklyPlan[day][mealType] = {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes || 30,
                servings: targetServings,
                sourceUrl: recipe.sourceUrl,
                summary: recipe.summary,
                ingredients: scaledIngredients,
              };
              recipeIndex++;
            }
          });
        });

        const mealPlan = {
          type: 'weekly' as const,
          weeklyData: weeklyPlan,
          generatedAt: new Date().toISOString(),
          servings: targetServings,
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
    setDesiredIngredients('');
    setSelectedCookingTime(COOKING_TIMES[0].id);
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
          What ingredients would you like to include?
        </Text>
        <TextInput
          style={[
            styles.ingredientsInput,
            isDarkMode && styles.ingredientsInputDark
          ]}
          value={desiredIngredients}
          onChangeText={setDesiredIngredients}
          placeholder="e.g., rice, chicken, vegetables"
          placeholderTextColor={isDarkMode ? '#777777' : '#999999'}
          multiline={false}
        />
        <Text style={[styles.inputHint, isDarkMode && styles.textLightSecondary]}>
          Separate multiple ingredients with commas
        </Text>
      </View>

      <View style={styles.configSection}>
        <Text style={[styles.configLabel, isDarkMode && styles.textLight]}>
          How much time do you have to cook?
        </Text>
        <View style={styles.cookingTimeContainer}>
          {COOKING_TIMES.map((timeOption) => (
            <TouchableOpacity
              key={timeOption.id}
              style={[
                styles.cookingTimeButton,
                isDarkMode && styles.cookingTimeButtonDark,
                selectedCookingTime === timeOption.id && styles.cookingTimeButtonSelected,
              ]}
              onPress={() => setSelectedCookingTime(timeOption.id)}
            >
              <Text style={[
                styles.cookingTimeText,
                isDarkMode && styles.textLight,
                selectedCookingTime === timeOption.id && styles.cookingTimeTextSelected,
              ]}>
                {timeOption.name}
              </Text>
            </TouchableOpacity>
          ))}
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
      <View style={styles.animationContainer}>
        <Image source={require("../../../assets/img/logo.png")} style={styles.logoStyle} />
        
        <Animated.View
          style={[
            styles.loadingSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.loadingBarContainer}>
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.loadingText, isDarkMode && styles.textLightSecondary]}>
              Creating your perfect meal...
            </Text>
          </View>
          
          {/* CLEAN Definitions */}
          <View style={styles.definitionsContainer}>
            {CLEAN_DEFINITIONS.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.definitionItem,
                  {
                    opacity: cleanAnimations[index],
                    transform: [
                      {
                        translateY: cleanAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.definitionLetter}>
                  {item.letter}
                </Text>
                <Text style={[styles.definitionText, isDarkMode && styles.textLightSecondary]}>
                  {item.definition}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
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
  ingredientsInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ingredientsInputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    color: '#FFFFFF',
  },
  inputHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
    marginLeft: 5,
  },
  cookingTimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cookingTimeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  cookingTimeButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  cookingTimeButtonSelected: {
    backgroundColor: '#5DB075',
    borderColor: '#5DB075',
  },
  cookingTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  cookingTimeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  logoStyle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginBottom: 30,
  },
  loadingSection: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBarContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: "#5DB075",
    borderRadius: 4,
  },
  loadingText: {
    color: "#666666",
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
  definitionsContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'flex-start',
  },
  definitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  definitionLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5DB075',
    width: 25,
    textAlign: 'center',
  },
  definitionText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
    flex: 1,
  },
}); 
