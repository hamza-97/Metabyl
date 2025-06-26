import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { spoonacularAPI, Recipe } from '../../config/spoonacularApi';

type RecipesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>;

const RecipesScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<RecipesNavigationProp>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Vegetarian'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await spoonacularAPI.getRandomRecipes({ number: 10 });
      setRecipes(response.recipes);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to load recipes. Please try again later.');
      setLoading(false);
    }
  };

  const handleRecipePress = (recipeId: number) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={[styles.recipeCard, isDarkMode && styles.recipeCardDark]} 
      onPress={() => handleRecipePress(item.id)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      )}
      <View style={styles.recipeCardContent}>
        <Text style={[styles.recipeTitle, isDarkMode && styles.textLight]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.recipeMetaInfo}>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={14} color={isDarkMode ? '#AAAAAA' : '#666666'} />
            <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
              {item.readyInMinutes || '?'} mins
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="account-group-outline" size={14} color={isDarkMode ? '#AAAAAA' : '#666666'} />
            <Text style={[styles.metaText, isDarkMode && styles.textLightSecondary]}>
              {item.servings || '?'} servings
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
      <Icon name="food-fork-drink" size={50} color="#CCCCCC" />
      <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
        No recipes yet
      </Text>
      <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
        Create a meal plan to discover recipes
      </Text>
      <TouchableOpacity style={styles.browseButton} onPress={fetchRecipes}>
        <Text style={styles.browseButtonText}>Browse Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>Recipes</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="magnify" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.activeChip,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter ? styles.activeChipText : isDarkMode && styles.textLight,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5DB075" />
          <Text style={[styles.loadingText, isDarkMode && styles.textLight]}>
            Loading recipes...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={50} color="#FF6B6B" />
          <Text style={[styles.errorText, isDarkMode && styles.textLight]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRecipes}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  searchButton: {
    padding: 5,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeChip: {
    backgroundColor: '#5DB075',
  },
  filterChipText: {
    color: '#333333',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recipeList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeCardDark: {
    backgroundColor: '#2A2A2A',
  },
  recipeImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  recipeCardContent: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  emptyStateDark: {
    backgroundColor: '#2A2A2A',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default RecipesScreen; 
