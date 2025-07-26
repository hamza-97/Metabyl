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

  const navigateToRecipeDetail = (recipeId: number, recipeTitle: string, imageUrl?: string) => {
    navigation.navigate('RecipeDetail', { 
      recipeId, 
      recipeTitle,
      imageUrl 
    });
  };

  const navigateToRecipes = () => {
    navigation.navigate('Recipes');
  };

  const navigateToComprehensiveMealPlan = (mealPlan: any) => {
    navigation.navigate('ComprehensiveMealPlan', { mealPlan });
  };



  // Get current day and meal type
  const today = new Date();
  const currentHour = today.getHours();
  let mealType = 'dinner';
  let dayIndex = 0; // Default to Day 1
  
  // Determine meal type based on current time
  if (currentHour < 11) {
    mealType = 'breakfast';
  } else if (currentHour < 16) {
    mealType = 'lunch';
  } else {
    mealType = 'dinner';
  }
  
  // For demo purposes, let's show Day 2 or Day 3 as requested
  // In a real app, you'd calculate the actual day from the meal plan
  const dayOfWeek = today.getDay();
  dayIndex = (dayOfWeek + 1) % 7; // Simple day calculation, can be improved

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

        {/* Chatbot Access Card */}
        <TouchableOpacity 
          style={[styles.chatbotCard, isDarkMode && styles.chatbotCardDark]}
          onPress={() => navigation.navigate('ChatBot')}
        >
          <View style={styles.chatbotIconContainer}>
            <Icon name="robot" size={28} color="#007AFF" />
          </View>
          <View style={styles.chatbotTextContainer}>
            <Text style={[styles.chatbotTitle, isDarkMode && styles.textLight]}>
              Food Assistant AI 🤖
            </Text>
            <Text style={[styles.chatbotSubtitle, isDarkMode && styles.textLightSecondary]}>
              Ask about recipes, cooking tips, substitutions & more
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
            {`Day ${dayIndex + 1} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`}
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
            {(() => {
              // Show next meal from comprehensive plan if available
              const comprehensivePlan = mealPlans.find(plan => plan.type === 'comprehensive');
              if (!comprehensivePlan || comprehensivePlan.type !== 'comprehensive') return null;
              
              // Ensure we have a valid day index
              if (dayIndex >= comprehensivePlan.mealPlan.length) {
                dayIndex = 0;
              }
              
              const todayMeals = comprehensivePlan.mealPlan[dayIndex];
              if (!todayMeals) return null;
              
              const displayMeal = todayMeals[mealType as keyof typeof todayMeals];
              if (!displayMeal) return null;
              
              // Create a display meal object that matches the expected structure
              const displayMealObj = {
                id: Date.now(),
                title: displayMeal.name,
                image: displayMeal.imageUrl || '',
                readyInMinutes: 30,
                servings: 2,
                summary: displayMeal.description,
                ingredients: displayMeal.ingredients,
                nutritionalInfo: displayMeal.nutritionalInfo,
              };
              
              const healthScore = displayMealObj && 'healthScore' in displayMealObj ? (displayMealObj.healthScore as number) : undefined;
              
              return (
                <TouchableOpacity 
                  key="next-meal" 
                  style={styles.mealPlanCard}
                  onPress={() => navigateToRecipeDetail(displayMealObj.id, displayMealObj.title, displayMealObj.image)}
                >
                  {displayMealObj.image ? (
                    <Image 
                      source={{uri: displayMealObj.image}} 
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
                        {displayMealObj.title}
                      </Text>
                      
                      <View style={styles.mealBadge}>
                        <Text style={styles.mealBadgeText}>
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </Text>
                      </View>
                    </View>
                    
                                          <View style={styles.mealMetaContainer}>
                        <View style={styles.mealMetaItem}>
                          <Icon name="clock-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                          <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                            {displayMealObj.readyInMinutes} mins
                          </Text>
                        </View>
                        
                        <View style={styles.mealMetaItem}>
                          <Icon name="account-group-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                          <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                            {displayMealObj.servings} {displayMealObj.servings > 1 ? 'people' : 'person'}
                          </Text>
                        </View>
                      </View>
                    
                    <View style={styles.nextMealIndicator}>
                      <Icon name="clock-fast" size={16} color="#007AFF" />
                      <Text style={styles.nextMealText}>
                        Today's meal
                      </Text>
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
                      onPress={() => navigateToRecipeDetail(displayMealObj.id, displayMealObj.title, displayMealObj.image)}
                    >
                      <Text style={styles.viewRecipeButtonText}>View Recipe</Text>
                      <Icon name="chevron-right" size={16} color="#5DB075" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })()}
          </View>
        )}

        {/* Comprehensive Meal Plan Section */}
        {mealPlans.find(plan => plan.type === 'comprehensive') && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
                Your Meal Plan
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.weeklyPlanCard, isDarkMode && styles.weeklyPlanCardDark]}
              onPress={() => {
                const comprehensivePlan = mealPlans.find(plan => plan.type === 'comprehensive');
                if (comprehensivePlan) navigateToComprehensiveMealPlan(comprehensivePlan);
              }}
            >
              <View style={styles.weeklyPlanHeader}>
                <View style={styles.weeklyPlanIconContainer}>
                  <Icon name="calendar-week" size={24} color="#5DB075" />
                </View>
                <View style={styles.weeklyPlanInfo}>
                  <Text style={[styles.weeklyPlanTitle, isDarkMode && styles.textLight]}>
                    Complete Meal Plan
                  </Text>
                  <Text style={[styles.weeklyPlanSubtitle, isDarkMode && styles.textLightSecondary]}>
                    {(() => {
                      const comprehensivePlan = mealPlans.find(plan => plan.type === 'comprehensive');
                      return comprehensivePlan ? `Generated ${new Date(comprehensivePlan.generatedAt).toLocaleDateString()}` : '';
                    })()}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color="#5DB075" />
              </View>
              
              <View style={styles.weeklyPlanPreview}>
                <Text style={[styles.weeklyPlanPreviewText, isDarkMode && styles.textLightSecondary]}>
                  21 meals planned • Nutrition & Shopping list included
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}


    
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
  // Weekly meal plan styles
  weeklyPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weeklyPlanCardDark: {
    backgroundColor: '#2A2A2A',
  },
  weeklyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyPlanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F8F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weeklyPlanInfo: {
    flex: 1,
  },
  weeklyPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  weeklyPlanSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  weeklyPlanPreview: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  weeklyPlanPreviewText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  // Next meal indicator styles
  nextMealIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  nextMealText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  // Chatbot card styles
  chatbotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  chatbotCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#1976D2',
  },
  chatbotIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatbotTextContainer: {
    flex: 1,
  },
  chatbotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  chatbotSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default HomeScreen; 
