import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MealPlanModal } from '../../components/common/MealPlanModal';
import { useMealPlanStore } from '../../store/mealPlanStore';
import { RootStackParamList } from '../../navigation';
import { MainTabParamList } from '../../navigation/MainTabNavigator';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // 20px padding on each side

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'> & 
                      BottomTabNavigationProp<MainTabParamList, 'Home'>;

const HomeScreen = () => {
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<HomeScreenProp>();
  
  const { mealPlans, addMealPlan } = useMealPlanStore();
  
  const handleMealPlanGenerated = (mealPlan: any) => {
    addMealPlan(mealPlan);
  };

  const navigateToRecipeDetail = (recipeId: number) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const navigateToRecipes = () => {
    navigation.navigate('Recipes');
  };

  // Function to get meal type based on current time
  const getMealTypeForCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Breakfast';
    if (hour < 16) return 'Lunch';
    return 'Dinner';
  };

  const currentMealType = getMealTypeForCurrentTime();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>Metabyl</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={30} color={isDarkMode ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, isDarkMode && styles.textLight]}>
            Welcome to Metabyl
          </Text>
          <Text style={[styles.welcomeSubtitle, isDarkMode && styles.textLightSecondary]}>
            Your AI-powered meal planning assistant
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.createPlanButton}
          onPress={() => setShowMealPlanModal(true)}
        >
          <Icon name="plus-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.createPlanButtonText}>Create Meal Plan</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
            {`Today's ${currentMealType}`}
          </Text>
        </View>

        {mealPlans.length === 0 ? (
          <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
            <Icon name="food-variant" size={50} color="#CCCCCC" />
            <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
              No meal plans yet
            </Text>
            <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
              Create your first meal plan to get started
            </Text>
          </View>
        ) : (
          <View style={styles.mealPlansContainer}>
            {mealPlans.slice(0, 1).map((plan, index) => {
              // Safely extract meal data
              const meal = plan.meals && plan.meals.length > 0 ? plan.meals[0] : null;
              const healthScore = meal && 'healthScore' in meal ? (meal.healthScore as number) : undefined;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.mealPlanCard}
                  onPress={() => {
                    if (plan.type === 'single' && meal) {
                      navigateToRecipeDetail(meal.id);
                    }
                  }}
                >
                  {meal && meal.image ? (
                    <Image 
                      source={{uri: meal.image}} 
                      style={styles.mealImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.mealImagePlaceholder, isDarkMode && styles.mealImagePlaceholderDark]}>
                      <Icon name="food" size={40} color={isDarkMode ? '#444' : '#DDD'} />
                    </View>
                  )}
                  
                  <View style={styles.mealInfoContainer}>
                    <View style={styles.mealTitleContainer}>
                      <Text style={[styles.mealTitle, isDarkMode && styles.textLight]} numberOfLines={2}>
                        {plan.type === 'single' && meal ? meal.title : '7-Day Meal Plan'}
                      </Text>
                      
                      <View style={styles.mealBadge}>
                        <Text style={styles.mealBadgeText}>{currentMealType}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.mealMetaContainer}>
                      <View style={styles.mealMetaItem}>
                        <Icon name="clock-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                        <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                          {meal?.readyInMinutes || '?'} mins
                        </Text>
                      </View>
                      
                      <View style={styles.mealMetaItem}>
                        <Icon name="account-group-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                        <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                          {plan.servings || 1} {(plan.servings || 1) > 1 ? 'people' : 'person'}
                        </Text>
                      </View>
                    </View>
                    
                    {healthScore !== undefined && (
                      <View style={styles.healthScoreContainer}>
                        <Text style={styles.healthScoreLabel}>Health Score:</Text>
                        <View style={styles.healthScoreBar}>
                          <View 
                            style={[
                              styles.healthScoreFill, 
                              { 
                                width: `${healthScore}%`,
                                backgroundColor: healthScore >= 70 ? '#5DB075' : 
                                                healthScore >= 40 ? '#FFD166' : '#FF6B6B'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.healthScoreValue}>{healthScore}</Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.viewRecipeButton}
                      onPress={() => meal && navigateToRecipeDetail(meal.id)}
                    >
                      <Text style={styles.viewRecipeButtonText}>View Recipe</Text>
                      <Icon name="chevron-right" size={16} color="#5DB075" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
            Recommended Recipes
          </Text>
          <TouchableOpacity onPress={navigateToRecipes}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
          <Icon name="chef-hat" size={50} color="#CCCCCC" />
          <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
            Recipes coming soon
          </Text>
          <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
            We're preparing some delicious recipes for you
          </Text>
        </View>
      </ScrollView>

      <MealPlanModal
        visible={showMealPlanModal}
        onClose={() => setShowMealPlanModal(false)}
        onMealPlanGenerated={handleMealPlanGenerated}
      />
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
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  createPlanButton: {
    backgroundColor: '#5DB075',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonIcon: {
    marginRight: 10,
  },
  createPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    color: '#5DB075',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
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
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
  mealPlansContainer: {
    marginBottom: 30,
  },
  mealPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealImage: {
    width: CARD_WIDTH,
    height: 180,
  },
  mealImagePlaceholder: {
    width: CARD_WIDTH,
    height: 180,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealImagePlaceholderDark: {
    backgroundColor: '#2A2A2A',
  },
  mealInfoContainer: {
    padding: 16,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 10,
  },
  mealBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealBadgeText: {
    color: '#5DB075',
    fontSize: 12,
    fontWeight: '600',
  },
  mealMetaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mealMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  mealMetaText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScoreLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 10,
  },
  healthScoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthScoreFill: {
    height: '100%',
  },
  healthScoreValue: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  viewRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  viewRecipeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DB075',
    marginRight: 4,
  },
});

export default HomeScreen; 
