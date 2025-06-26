import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spoonacularAPI, Recipe, Ingredient } from '../../config/spoonacularApi';
import { MainStackParamList } from '../../navigation';

type RecipeDetailScreenRouteProp = RouteProp<MainStackParamList, 'RecipeDetail'>;

const NutrientBar = ({ 
  label, 
  value, 
  maxValue, 
  unit, 
  color, 
  isDarkMode 
}: { 
  label: string; 
  value: number; 
  maxValue: number; 
  unit: string; 
  color: string; 
  isDarkMode: boolean; 
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <View style={styles.nutrientBarContainer}>
      <View style={styles.nutrientLabelContainer}>
        <Text style={[styles.nutrientLabel, isDarkMode && styles.textLight]}>{label}</Text>
        <Text style={[styles.nutrientValue, isDarkMode && styles.textLight]}>
          {value}{unit}
        </Text>
      </View>
      <View style={[styles.nutrientBarBackground, isDarkMode && styles.nutrientBarBackgroundDark]}>
        <View 
          style={[
            styles.nutrientBarFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

const HealthScoreIndicator = ({ score, isDarkMode }: { score: number; isDarkMode: boolean }) => {
  let color = '#FF6B6B'; // Red for poor score
  let label = 'Poor';
  
  if (score >= 80) {
    color = '#5DB075'; // Green for excellent
    label = 'Excellent';
  } else if (score >= 60) {
    color = '#78D237'; // Light green for good
    label = 'Good';
  } else if (score >= 40) {
    color = '#FFD166'; // Yellow for fair
    label = 'Fair';
  } else if (score >= 20) {
    color = '#FF9F1C'; // Orange for below average
    label = 'Below Average';
  }
  
  return (
    <View style={styles.healthScoreContainer}>
      <View style={styles.healthScoreHeader}>
        <Text style={[styles.healthScoreTitle, isDarkMode && styles.textLight]}>Health Score</Text>
        <View style={[styles.healthScoreBadge, { backgroundColor: color }]}>
          <Text style={styles.healthScoreLabel}>{label}</Text>
        </View>
      </View>
      <View style={[styles.healthScoreBar, isDarkMode && styles.healthScoreBarDark]}>
        <View 
          style={[
            styles.healthScoreFill, 
            { width: `${score}%`, backgroundColor: color }
          ]} 
        />
        <Text style={[styles.healthScoreText, { color }]}>{score}/100</Text>
      </View>
    </View>
  );
};

const RecipeDetailScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullNutrition, setShowFullNutrition] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const recipeData = await spoonacularAPI.getRecipeInformation(recipeId);
        setRecipe(recipeData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch recipe details:', err);
        setError('Failed to load recipe details. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const renderIngredients = (ingredients?: Ingredient[]) => {
    if (!ingredients || ingredients.length === 0) {
      return <Text style={[styles.noDataText, isDarkMode && styles.textLight]}>No ingredients information available</Text>;
    }

    return (
      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => (
          <View key={`${ingredient.id}-${index}`} style={styles.ingredientItem}>
            <View style={styles.ingredientDot} />
            <Text style={[styles.ingredientText, isDarkMode && styles.textLight]}>
              {ingredient.original}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInstructions = (instructions?: string) => {
    if (!instructions) {
      return <Text style={[styles.noDataText, isDarkMode && styles.textLight]}>No instructions available</Text>;
    }

    // Remove HTML tags from instructions
    const cleanInstructions = instructions?.replace(/<[^>]*>?/gm, '');
    
    // Split instructions by number or by periods followed by space
    const steps = cleanInstructions
      .split(/\d+\.\s|\.\s/)
      .filter(step => step.trim().length > 0);

    return (
      <View style={styles.instructionsList}>
        {steps.map((step, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.instructionText, isDarkMode && styles.textLight]}>
              {step.trim()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderNutritionInfo = () => {
    if (!recipe?.nutrition) {
      return <Text style={[styles.noDataText, isDarkMode && styles.textLight]}>No nutrition information available</Text>;
    }

    // Helper function to safely parse numeric values
    const parseNutrientValue = (value: string | number): number => {
      if (typeof value === 'number') return value;
      
      // Remove any non-numeric characters except decimal point
      const numericValue = parseFloat(value?.replace(/[^\d.]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Basic nutrition info with safe parsing
    const basicNutrients = [
      { name: 'Calories', value: parseNutrientValue(String(recipe.nutrition.calories)), unit: '', maxValue: 2000, color: '#FF9F1C' },
      { name: 'Protein', value: parseNutrientValue(recipe.nutrition.protein), unit: 'g', maxValue: 50, color: '#5DB075' },
      { name: 'Carbs', value: parseNutrientValue(recipe.nutrition.carbohydrates), unit: 'g', maxValue: 300, color: '#FFD166' },
      { name: 'Fat', value: parseNutrientValue(recipe.nutrition.fat), unit: 'g', maxValue: 65, color: '#FF6B6B' },
    ];

    const additionalNutrients = recipe.nutrition.nutrients ? [
      { name: 'Fiber', value: recipe.nutrition.nutrients.fiber || 0, unit: 'g', maxValue: 30, color: '#78D237' },
      { name: 'Sugar', value: recipe.nutrition.nutrients.sugar || 0, unit: 'g', maxValue: 50, color: '#FF6B6B' },
      { name: 'Sodium', value: recipe.nutrition.nutrients.sodium || 0, unit: 'mg', maxValue: 2300, color: '#FF9F1C' },
      { name: 'Cholesterol', value: recipe.nutrition.nutrients.cholesterol || 0, unit: 'mg', maxValue: 300, color: '#FF6B6B' },
    ] : [];

    return (
      <View style={styles.nutritionContainer}>
        {basicNutrients.map((nutrient, index) => (
          <NutrientBar
            key={index}
            label={nutrient.name}
            value={nutrient.value}
            maxValue={nutrient.maxValue}
            unit={nutrient.unit}
            color={nutrient.color}
            isDarkMode={isDarkMode}
          />
        ))}
        
        {showFullNutrition && additionalNutrients.length > 0 && (
          <View style={styles.additionalNutrients}>
            {additionalNutrients.map((nutrient, index) => (
              <NutrientBar
                key={`additional-${index}`}
                label={nutrient.name}
                value={nutrient.value}
                maxValue={nutrient.maxValue}
                unit={nutrient.unit}
                color={nutrient.color}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}
        
        {additionalNutrients.length > 0 && (
          <TouchableOpacity 
            style={styles.showMoreButton} 
            onPress={() => setShowFullNutrition(!showFullNutrition)}
          >
            <Text style={styles.showMoreButtonText}>
              {showFullNutrition ? 'Show Less' : 'Show More'}
            </Text>
            <Icon 
              name={showFullNutrition ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color="#5DB075" 
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDietaryTags = () => {
    if (!recipe?.diets || recipe.diets.length === 0) {
      return null;
    }

    return (
      <View style={styles.dietaryTagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipe.diets.map((diet, index) => (
            <View key={index} style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>{diet}</Text>
            </View>
          ))}
          {recipe.vegetarian && (
            <View style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>Vegetarian</Text>
            </View>
          )}
          {recipe.vegan && (
            <View style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>Vegan</Text>
            </View>
          )}
          {recipe.glutenFree && (
            <View style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>Gluten Free</Text>
            </View>
          )}
          {recipe.dairyFree && (
            <View style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>Dairy Free</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5DB075" />
          <Text style={[styles.loadingText, isDarkMode && styles.textLight]}>Loading recipe details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={50} color="#FF6B6B" />
          <Text style={[styles.errorText, isDarkMode && styles.textLight]}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]} numberOfLines={1}>
          {recipe?.title || 'Recipe Details'}
        </Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {recipe?.image && (
          <Image
            source={{ uri: recipe.image }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.recipeInfo}>
          <Text style={[styles.recipeTitle, isDarkMode && styles.textLight]}>{recipe?.title}</Text>
          
          {renderDietaryTags()}
          
          <View style={styles.recipeMetaInfo}>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={18} color={isDarkMode ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
                {recipe?.readyInMinutes || '?'} mins
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="account-group-outline" size={18} color={isDarkMode ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
                {recipe?.servings || '?'} servings
              </Text>
            </View>
            {recipe?.nutrition?.calories && (
              <View style={styles.metaItem}>
                <Icon name="fire" size={18} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
                  {recipe.nutrition.calories} cal
                </Text>
              </View>
            )}
          </View>

          {recipe?.healthScore && (
            <HealthScoreIndicator score={recipe.healthScore} isDarkMode={isDarkMode} />
          )}

          {recipe?.summary && (
            <View style={styles.summaryContainer}>
              <Text style={[styles.summaryText, isDarkMode && styles.textLight]}>
                {recipe?.summary?.replace(/<[^>]*>?/gm, '')}
              </Text>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Nutrition</Text>
            {renderNutritionInfo()}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Ingredients</Text>
            {renderIngredients(recipe?.extendedIngredients)}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Instructions</Text>
            {renderInstructions(recipe?.instructions)}
          </View>

          {recipe?.sourceUrl && (
            <View style={styles.sourceContainer}>
              <Text style={[styles.sourceText, isDarkMode && styles.textLightSecondary]}>
                Source: {recipe.sourceUrl}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  favoriteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 250,
  },
  recipeInfo: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 5,
  },
  dietaryTagsContainer: {
    marginBottom: 15,
  },
  dietaryTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  dietaryTagText: {
    fontSize: 12,
    color: '#5DB075',
    fontWeight: '600',
  },
  healthScoreContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  healthScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthScoreLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  healthScoreBar: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  healthScoreBarDark: {
    backgroundColor: '#333333',
  },
  healthScoreFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  healthScoreText: {
    position: 'absolute',
    right: 10,
    top: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  nutritionContainer: {
    marginBottom: 10,
  },
  nutrientBarContainer: {
    marginBottom: 12,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#333333',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  nutrientBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  nutrientBarBackgroundDark: {
    backgroundColor: '#333333',
  },
  nutrientBarFill: {
    height: '100%',
  },
  additionalNutrients: {
    marginTop: 10,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  showMoreButtonText: {
    color: '#5DB075',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  summaryContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  ingredientsList: {
    marginLeft: 5,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5DB075',
    marginTop: 6,
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
  },
  instructionsList: {
    marginLeft: 5,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
    lineHeight: 22,
  },
  sourceContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sourceText: {
    fontSize: 12,
    color: '#999999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default RecipeDetailScreen; 
