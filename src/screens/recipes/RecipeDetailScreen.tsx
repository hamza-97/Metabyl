import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useShoppingListStore } from '../../store/shoppingListStore';
import GeminiService from '../../config/geminiApi';

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

// Updated interface to match Gemini response
interface LlmRecipeDetail {
  id: number;
  title: string;
  description: string;
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  instructions?: string;
  summary?: string;
  diets?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  healthScore?: number;
  sourceUrl?: string;
}

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
  const { recipeId, recipeTitle, imageUrl } = route.params;
  
  const [recipe, setRecipe] = useState<LlmRecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_showFullNutrition, _setShowFullNutrition] = useState(false);
  const [servings, setServings] = useState(0);
  const [scaledIngredients, setScaledIngredients] = useState<LlmRecipeDetail['ingredients']>([]);
  const [activeTab, setActiveTab] = useState<'grocery' | 'cooking'>('grocery');
  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, boolean>>({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  
  // Shopping list store
  const addItems = useShoppingListStore(state => state.addItems);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        // Use the recipe title passed from navigation
        const recipeDetail = await GeminiService.generateRecipeDetail(recipeId, recipeTitle);
        
        // Set the image from navigation params if available
        if (imageUrl) {
          recipeDetail.image = imageUrl;
        }
        
        setRecipe(recipeDetail);
        setServings(recipeDetail.servings || 1);
        setScaledIngredients(recipeDetail.ingredients || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch recipe details:', err);
        setError('Failed to load recipe details. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, recipeTitle, imageUrl]);

  // Function to adjust servings and scale ingredients
  const adjustServings = (newServings: number) => {
    if (!recipe || !recipe.ingredients) return;
    if (newServings < 1) return;
    
    const originalServings = recipe.servings || 1;
    const servingMultiplier = newServings / originalServings;
    
    // Scale ingredient quantities based on the serving multiplier
    const newScaledIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      amount: ing.amount * servingMultiplier,
      original: ing.original.replace(
        /\b(\d+(\.\d+)?)\b/,
        (match) => (parseFloat(match) * servingMultiplier).toFixed(2).replace(/\.00$/, '')
      ),
    }));
    
    setServings(newServings);
    setScaledIngredients(newScaledIngredients);
  };

  // Function to handle checkbox toggle
  const toggleIngredient = (index: number) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to toggle all ingredients
  const toggleAllIngredients = () => {
    const newIsAllSelected = !isAllSelected;
    setIsAllSelected(newIsAllSelected);
    
    const newSelectedIngredients: Record<string, boolean> = {};
    if (scaledIngredients) {
      scaledIngredients.forEach((_, index) => {
        newSelectedIngredients[index] = newIsAllSelected;
      });
    }
    
    setSelectedIngredients(newSelectedIngredients);
  };

  // Function to add selected ingredients to shopping list
  const addToShoppingList = () => {
    if (!recipe) return;
    
    const selectedItems = Object.entries(selectedIngredients)
      .filter(([_, isSelected]) => isSelected)
      .map(([indexStr]) => {
        const index = parseInt(indexStr, 10);
        const ingredient = scaledIngredients[index];
        return {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeId: recipe.id,
          recipeName: recipe.title,
          original: ingredient.original,
        };
      });
    
    if (selectedItems.length === 0) {
      Alert.alert('No items selected', 'Please select at least one ingredient to add to your shopping list.');
      return;
    }
    
    addItems(selectedItems);
    
    Alert.alert(
      'Added to Shopping List', 
      `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} added to your shopping list.`,
      [
        { text: 'OK' },
        { 
          text: 'View Shopping List', 
          onPress: () => navigation.navigate('ShoppingList' as never) 
        }
      ]
    );
    
    // Reset selections
    setSelectedIngredients({});
    setIsAllSelected(false);
  };

  const renderIngredients = (ingredients?: LlmRecipeDetail['ingredients']) => {
    if (!ingredients || ingredients.length === 0) {
      return <Text style={[styles.noDataText, isDarkMode && styles.textLight]}>No ingredients information available</Text>;
    }

    return (
      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => (
          <View key={`${ingredient.name}-${index}`} style={styles.ingredientItem}>
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

    // Split instructions by numbered steps (e.g., 1. Step text 2. Step text ...)
    // This regex will split before each number-dot-space, but keep the number
    const steps = cleanInstructions
      .split(/(?=\d+\. )/)
      .map(step => step.replace(/^\d+\.\s*/, '').trim())
      .filter(step => step.length > 0);

    return (
      <View style={styles.instructionsList}>
        {steps.map((step, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.instructionNumberText}>{index + 1}. </Text>
            <Text style={[styles.instructionText, isDarkMode && styles.textLight]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderNutritionInfo = () => {
    if (!recipe?.nutritionalInfo) {
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
      { name: 'Calories', value: parseNutrientValue(String(recipe.nutritionalInfo.calories)), unit: '', maxValue: 2000, color: '#FF9F1C' },
      { name: 'Protein', value: parseNutrientValue(recipe.nutritionalInfo.protein), unit: 'g', maxValue: 50, color: '#5DB075' },
      { name: 'Carbs', value: parseNutrientValue(recipe.nutritionalInfo.carbohydrates), unit: 'g', maxValue: 300, color: '#FFD166' },
      { name: 'Fat', value: parseNutrientValue(recipe.nutritionalInfo.fat), unit: 'g', maxValue: 65, color: '#FF6B6B' },
    ];

    return (
      <View style={styles.nutritionContainer}>
        {/* {basicNutrients.map((nutrient, index) => (
          <NutrientBar
            key={index}
            label={nutrient.name}
            value={nutrient.value}
            maxValue={nutrient.maxValue}
            unit={nutrient.unit}
            color={nutrient.color}
            isDarkMode={isDarkMode}
          />
        ))} */}
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

  // Function to convert recipe measurements to grocery quantities
  const convertToGroceryQuantity = (ingredient: LlmRecipeDetail['ingredients'][0], currentServings?: number) => {
    const name = ingredient.name.toLowerCase();
    const original = ingredient.original.toLowerCase();
    const originalServings = recipe?.servings || 1;
    const servingMultiplier = currentServings ? currentServings / originalServings : 1;
    
    // Check if it's a small measurement that should be converted
    const isSmallMeasurement = original.includes('tablespoon') || original.includes('tbsp') || 
                              original.includes('teaspoon') || original.includes('tsp') ||
                              original.includes('pinch') || original.includes('dash') ||
                              original.includes('clove') || original.includes('sprig');
    
    // Common conversions for grocery shopping
    if (name.includes('milk') || name.includes('cream')) {
      // Scale milk quantity based on servings
      if (servingMultiplier > 4) return '2 gallons milk';
      return '1 gallon milk';
    }
    if (name.includes('eggs')) {
      // Scale eggs based on servings
      const eggCount = Math.ceil(ingredient.amount * servingMultiplier);
      if (eggCount > 12) return '2 dozen eggs';
      return '1 dozen eggs';
    }
    if (name.includes('butter')) {
      return '1 package butter';
    }
    if (name.includes('cheese')) {
      return '1 package cheese';
    }
    if (name.includes('bread')) {
      return '1 loaf bread';
    }
    if (name.includes('rice')) {
      return '1 bag rice';
    }
    if (name.includes('pasta') || name.includes('noodle')) {
      return '1 bag pasta';
    }
    if (name.includes('flour')) {
      return '1 bag flour';
    }
    if (name.includes('sugar')) {
      return '1 bag sugar';
    }
    if (name.includes('oil')) {
      return '1 bottle cooking oil';
    }
    if (name.includes('salt')) {
      return '1 container salt';
    }
    if (name.includes('pepper')) {
      return '1 container black pepper';
    }
    if (name.includes('yogurt')) {
      return '6 containers yogurt';
    }
    if (name.includes('tomato')) {
      return '1 package tomatoes';
    }
    if (name.includes('onion')) {
      return '1 bag onions';
    }
    if (name.includes('garlic')) {
      return '1 package garlic';
    }
    if (name.includes('chicken')) {
      return '1 package chicken';
    }
    if (name.includes('beef')) {
      return '1 package beef';
    }
    if (name.includes('pork')) {
      return '1 package pork';
    }
    if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) {
      return '1 package fish';
    }
    if (name.includes('spinach') || name.includes('lettuce') || name.includes('greens')) {
      return '1 package greens';
    }
    if (name.includes('carrot')) {
      return '1 bag carrots';
    }
    if (name.includes('potato')) {
      return '1 bag potatoes';
    }
    if (name.includes('apple')) {
      return '1 bag apples';
    }
    if (name.includes('banana')) {
      return '1 bunch bananas';
    }
    if (name.includes('lemon') || name.includes('lime')) {
      return '1 bag citrus';
    }
    if (name.includes('mushroom')) {
      return '1 package mushrooms';
    }
    if (name.includes('bell pepper') || name.includes('pepper')) {
      return '1 bag bell peppers';
    }
    if (name.includes('cucumber')) {
      return '1 package cucumbers';
    }
    if (name.includes('celery')) {
      return '1 bunch celery';
    }
    if (name.includes('herbs') || name.includes('parsley') || name.includes('cilantro') || name.includes('basil')) {
      return '1 package fresh herbs';
    }
    if (name.includes('spice') || name.includes('seasoning') || name.includes('cumin') || name.includes('paprika')) {
      return '1 container spices';
    }
    if (name.includes('vinegar')) {
      return '1 bottle vinegar';
    }
    if (name.includes('sauce') || name.includes('ketchup') || name.includes('mustard')) {
      return '1 bottle sauce';
    }
    if (name.includes('broth') || name.includes('stock')) {
      return '1 carton broth';
    }
    if (name.includes('beans') || name.includes('lentil')) {
      return '1 bag dried beans';
    }
    if (name.includes('nuts') || name.includes('almond') || name.includes('walnut')) {
      return '1 bag nuts';
    }
    
    // If it's a small measurement, convert to container
    if (isSmallMeasurement) {
      return `1 container ${ingredient.name}`;
    }
    
    // For anything else with small amounts, make it grocery-friendly
    if (original.includes('cup') && (original.includes('1/4') || original.includes('1/2') || original.includes('1/3'))) {
      return `1 package ${ingredient.name}`;
    }
    
    return ingredient.original;
  };

  // Function to categorize ingredients
  const categorizeIngredient = (ingredient: LlmRecipeDetail['ingredients'][0]) => {
    const name = ingredient.name.toLowerCase();
    
    if (name.includes('milk') || name.includes('cream') || name.includes('cheese') || name.includes('yogurt') || name.includes('butter')) {
      return 'Dairy';
    }
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('fish') || name.includes('eggs')) {
      return 'Protein';
    }
    if (name.includes('tomato') || name.includes('onion') || name.includes('garlic') || name.includes('carrot') || 
        name.includes('lettuce') || name.includes('spinach') || name.includes('apple') || name.includes('banana') ||
        name.includes('lemon') || name.includes('lime') || name.includes('mushroom') || name.includes('pepper') ||
        name.includes('cucumber') || name.includes('celery') || name.includes('herbs') || name.includes('parsley') ||
        name.includes('cilantro') || name.includes('basil') || name.includes('potato') || name.includes('greens')) {
      return 'Produce';
    }
    if (name.includes('rice') || name.includes('pasta') || name.includes('noodle') || name.includes('bread') || 
        name.includes('flour') || name.includes('sugar')) {
      return 'Grains';
    }
    if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce') || name.includes('ketchup') ||
        name.includes('mustard') || name.includes('broth') || name.includes('stock') || name.includes('salt') ||
        name.includes('pepper') || name.includes('spice') || name.includes('seasoning') || name.includes('cumin') ||
        name.includes('paprika')) {
      return 'Pantry';
    }
    if (name.includes('beans') || name.includes('lentil') || name.includes('nuts') || name.includes('almond') ||
        name.includes('walnut')) {
      return 'Pantry';
    }
    
    return 'Other';
  };

  // Function to render grocery list (shopping items)
  const renderGroceryList = (ingredients?: LlmRecipeDetail['ingredients']) => {
    // Use scaledIngredients if available, otherwise fall back to original ingredients
    const ingredientsToUse = scaledIngredients.length > 0 ? scaledIngredients : ingredients;
    
    if (!ingredientsToUse || ingredientsToUse.length === 0) {
      return <Text style={[styles.noDataText, isDarkMode && styles.textLight]}>No ingredients information available</Text>;
    }

    // Convert ingredients to shopping list format with proper grocery quantities
    const shoppingItems = ingredientsToUse.map((ingredient) => ({
      name: ingredient.name,
      quantity: convertToGroceryQuantity(ingredient, servings),
      category: categorizeIngredient(ingredient),
    }));

    // Group by category (for now, all items are in 'Ingredients' category)
    const categories = [...new Set(shoppingItems.map(item => item.category))];
    
    return (
      <View style={styles.groceryListContainer}>
        <View style={styles.groceryHeader}>
          <Text style={[styles.groceryListTitle, isDarkMode && styles.textLight]}>
            Shopping List ({shoppingItems.length} items)
          </Text>
          <TouchableOpacity 
            style={styles.selectAllButton}
            onPress={toggleAllIngredients}
          >
            <Text style={styles.selectAllText}>
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {categories.map(category => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={[styles.categoryTitle, isDarkMode && styles.textLight]}>
              {category}
            </Text>
            {shoppingItems
              .map((item, originalIndex) => ({ ...item, originalIndex }))
              .filter(item => item.category === category)
              .map((item) => (
                <View key={item.originalIndex} style={[styles.shoppingItem, isDarkMode && styles.shoppingItemDark]}>
                  <View style={styles.shoppingItemContent}>
                    <Text style={[styles.shoppingItemName, isDarkMode && styles.textLight]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.shoppingItemQuantity, isDarkMode && styles.textLightSecondary]}>
                      {item.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => toggleIngredient(item.originalIndex)}
                  >
                    <Icon 
                      name={selectedIngredients[item.originalIndex] ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={20} 
                      color="#5DB075" 
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addToListButton}
          onPress={addToShoppingList}
        >
          <Icon name="cart-plus" size={20} color="#FFFFFF" />
          <Text style={styles.addToListButtonText}>Add to Shopping List</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to render tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'grocery' && styles.activeTab,
          isDarkMode && styles.tabDark,
          activeTab === 'grocery' && isDarkMode && styles.activeTabDark,
        ]}
        onPress={() => setActiveTab('grocery')}
      >
        <Icon 
          name="cart-outline" 
          size={20} 
          color={activeTab === 'grocery' ? '#5DB075' : isDarkMode ? '#AAAAAA' : '#666666'} 
        />
        <Text 
          style={[
            styles.tabText, 
            activeTab === 'grocery' && styles.activeTabText,
            isDarkMode && styles.textLightSecondary,
            activeTab === 'grocery' && isDarkMode && styles.activeTabTextDark,
          ]}
        >
          Grocery
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'cooking' && styles.activeTab,
          isDarkMode && styles.tabDark,
          activeTab === 'cooking' && isDarkMode && styles.activeTabDark,
        ]}
        onPress={() => setActiveTab('cooking')}
      >
        <Icon 
          name="chef-hat" 
          size={20} 
          color={activeTab === 'cooking' ? '#5DB075' : isDarkMode ? '#AAAAAA' : '#666666'} 
        />
        <Text 
          style={[
            styles.tabText, 
            activeTab === 'cooking' && styles.activeTabText,
            isDarkMode && styles.textLightSecondary,
            activeTab === 'cooking' && isDarkMode && styles.activeTabTextDark,
          ]}
        >
          Cooking
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Function to render content based on active tab
  const renderTabContent = () => {
    if (activeTab === 'grocery') {
      return renderGroceryList(scaledIngredients);
    } else {
      return (
        <>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Ingredients</Text>
            {renderIngredients(scaledIngredients)}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Instructions</Text>
            {renderInstructions(recipe?.instructions)}
          </View>
        </>
      );
    }
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
            
            <View style={styles.servingsContainer}>
              <TouchableOpacity
                style={styles.servingsButton}
                onPress={() => adjustServings(servings - 1)}
              >
                <Icon name="minus" size={16} color="#5DB075" />
              </TouchableOpacity>
              <View style={styles.servingsTextContainer}>
                <Text style={[styles.servingsText, isDarkMode && styles.textLight]}>
                  {servings}
                </Text>
                <Text style={[styles.servingsLabel, isDarkMode && styles.textLightSecondary]}>
                  {servings > 1 ? 'servings' : 'serving'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.servingsButton}
                onPress={() => adjustServings(servings + 1)}
              >
                <Icon name="plus" size={16} color="#5DB075" />
              </TouchableOpacity>
            </View>
            
            {recipe?.nutritionalInfo?.calories && (
              <View style={styles.metaItem}>
                <Icon name="fire" size={18} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
                  {recipe.nutritionalInfo.calories} cal
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

          {/* <View style={styles.sectionContainer}> */}
            {/* <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Nutrition</Text> */}
            {/* {renderNutritionInfo()} */}
          {/* </View> */}

          {renderTabs()}
          {renderTabContent()}

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
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  instructionNumberText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5DB075',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    fontWeight: '400',
    flex: 1,
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
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  servingsButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsTextContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  servingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  servingsLabel: {
    fontSize: 12,
    color: '#666666',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  tabDark: {
    backgroundColor: '#2A2A2A',
  },
  activeTab: {
    backgroundColor: '#E8F5EF',
  },
  activeTabDark: {
    backgroundColor: '#3D5A4C',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#5DB075',
    fontWeight: '600',
  },
  activeTabTextDark: {
    color: '#5DB075',
  },
  
  groceryListContainer: {
    marginBottom: 20,
  },
  groceryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  groceryListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  selectAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  selectAllText: {
    fontSize: 14,
    color: '#5DB075',
    fontWeight: '500',
  },
  groceryList: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
  },
  groceryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groceryCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#5DB075',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groceryCheckboxChecked: {
    backgroundColor: '#5DB075',
  },
  groceryItemText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  groceryItemTextChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  addToListButton: {
    backgroundColor: '#5DB075',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
  },
  addToListButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
  },
  shoppingItemDark: {
    backgroundColor: '#2A2A2A',
  },
  shoppingItemContent: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  shoppingItemQuantity: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  checkbox: {
    padding: 5,
  },
});

export default RecipeDetailScreen; 
