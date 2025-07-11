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

  const navigateToWeeklyMealPlan = (weeklyPlan: any) => {
    navigation.navigate('WeeklyMealPlan', { weeklyPlan });
  };

  // Function to get meal type based on current time
  const getMealTypeForCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Breakfast';
    if (hour < 16) return 'Lunch';
    return 'Dinner';
  };

  // Function to get next meal from weekly plan
  const getNextMealFromWeeklyPlan = () => {
    const weeklyPlan = mealPlans.find(plan => plan.type === 'weekly');
    if (!weeklyPlan || weeklyPlan.type !== 'weekly') return null;
    
    // Type assertion after checking - use any to avoid import issues
    const typedWeeklyPlan = weeklyPlan as any;
    if (!typedWeeklyPlan.weeklyData) return null;

    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Meal times in minutes from midnight
    const breakfastTime = 8 * 60; // 8:00 AM
    const lunchTime = 12 * 60 + 30; // 12:30 PM  
    const dinnerTime = 19 * 60; // 7:00 PM
    
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = today.getDay();
    const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0 index
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDay = days[mondayIndex];
    
    // Determine next meal
    let nextMealType;
    let nextMealDay = currentDay;
    
    if (currentTime < breakfastTime) {
      nextMealType = 'breakfast';
    } else if (currentTime < lunchTime) {
      nextMealType = 'lunch';
    } else if (currentTime < dinnerTime) {
      nextMealType = 'dinner';
    } else {
      // After dinner, next meal is tomorrow's breakfast
      nextMealType = 'breakfast';
      const nextDayIndex = (mondayIndex + 1) % 7;
      nextMealDay = days[nextDayIndex];
    }
    
    // Get the meal from weekly plan
    const dayMeals = typedWeeklyPlan.weeklyData[nextMealDay];
    if (!dayMeals) return null;
    
    const nextMeal = dayMeals[nextMealType as keyof typeof dayMeals];
    if (!nextMeal) return null;
    
    return {
      meal: nextMeal,
      mealType: nextMealType,
      isNextDay: nextMealDay !== currentDay
    };
  };

  const nextMealInfo = getNextMealFromWeeklyPlan();
  const currentMealType = nextMealInfo ? 
    (nextMealInfo.mealType.charAt(0).toUpperCase() + nextMealInfo.mealType.slice(1)) + 
    (nextMealInfo.isNextDay ? ' (Tomorrow)' : '') : 
    getMealTypeForCurrentTime();

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
            {(() => {
              // Show next meal from weekly plan if available, otherwise show single meal
              const displayMeal = nextMealInfo ? nextMealInfo.meal : 
                (mealPlans.find(plan => plan.type === 'single')?.meals?.[0] || null);
              const displayPlan = nextMealInfo ? mealPlans.find(plan => plan.type === 'weekly') :
                mealPlans.find(plan => plan.type === 'single');
              
              if (!displayMeal || !displayPlan) return null;
              
              const healthScore = displayMeal && 'healthScore' in displayMeal ? (displayMeal.healthScore as number) : undefined;
              
              return (
                <TouchableOpacity 
                  key="next-meal" 
                  style={styles.mealPlanCard}
                  onPress={() => navigateToRecipeDetail(displayMeal.id)}
                >
                  {displayMeal.image ? (
                    <Image 
                      source={{uri: displayMeal.image}} 
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
                        {displayMeal.title}
                      </Text>
                      
                      <View style={styles.mealBadge}>
                        <Text style={styles.mealBadgeText}>
                          {nextMealInfo ? 
                            (nextMealInfo.mealType.charAt(0).toUpperCase() + nextMealInfo.mealType.slice(1)) : 
                            currentMealType
                          }
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.mealMetaContainer}>
                      <View style={styles.mealMetaItem}>
                        <Icon name="clock-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                        <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                          {displayMeal.readyInMinutes} mins
                        </Text>
                      </View>
                      
                      <View style={styles.mealMetaItem}>
                        <Icon name="account-group-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
                        <Text style={[styles.mealMetaText, isDarkMode && styles.textLightSecondary]}>
                          {displayMeal.servings} {displayMeal.servings > 1 ? 'people' : 'person'}
                        </Text>
                      </View>
                    </View>
                    
                    {nextMealInfo && (
                      <View style={styles.nextMealIndicator}>
                        <Icon name="clock-fast" size={16} color="#007AFF" />
                        <Text style={styles.nextMealText}>
                          Next meal {nextMealInfo.isNextDay ? 'tomorrow' : 'today'}
                        </Text>
                      </View>
                    )}
                    
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
                      onPress={() => navigateToRecipeDetail(displayMeal.id)}
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

        {/* Weekly Meal Plan Section */}
        {mealPlans.find(plan => plan.type === 'weekly') && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
                Your 7-Day Plan
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.weeklyPlanCard, isDarkMode && styles.weeklyPlanCardDark]}
              onPress={() => {
                const weeklyPlan = mealPlans.find(plan => plan.type === 'weekly');
                if (weeklyPlan) navigateToWeeklyMealPlan(weeklyPlan);
              }}
            >
              <View style={styles.weeklyPlanHeader}>
                <View style={styles.weeklyPlanIconContainer}>
                  <Icon name="calendar-week" size={24} color="#5DB075" />
                </View>
                <View style={styles.weeklyPlanInfo}>
                  <Text style={[styles.weeklyPlanTitle, isDarkMode && styles.textLight]}>
                    7-Day Meal Plan
                  </Text>
                  <Text style={[styles.weeklyPlanSubtitle, isDarkMode && styles.textLightSecondary]}>
                    {(() => {
                      const weeklyPlan = mealPlans.find(plan => plan.type === 'weekly');
                      return weeklyPlan ? `Generated ${new Date(weeklyPlan.generatedAt).toLocaleDateString()}` : '';
                    })()}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color="#5DB075" />
              </View>
              
              <View style={styles.weeklyPlanPreview}>
                <Text style={[styles.weeklyPlanPreviewText, isDarkMode && styles.textLightSecondary]}>
                  21 meals planned • Breakfast, Lunch & Dinner for 7 days
                </Text>
              </View>
            </TouchableOpacity>
          </>
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
