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

const RecipeDetailScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const cleanInstructions = instructions.replace(/<[^>]*>?/gm, '');
    
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

          {recipe?.summary && (
            <View style={styles.summaryContainer}>
              <Text style={[styles.summaryText, isDarkMode && styles.textLight]}>
                {recipe.summary.replace(/<[^>]*>?/gm, '')}
              </Text>
            </View>
          )}

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
    marginBottom: 15,
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
