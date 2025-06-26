import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
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
            This Week's Plan
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
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
            {mealPlans.slice(0, 3).map((plan, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.mealPlanCard, isDarkMode && styles.mealPlanCardDark]}
                onPress={() => {
                  if (plan.type === 'single' && plan.meals.length > 0) {
                    navigateToRecipeDetail(plan.meals[0].id);
                  }
                }}
              >
                <View style={styles.mealPlanHeader}>
                  <Text style={[styles.mealPlanTitle, isDarkMode && styles.textLight]}>
                    {plan.type === 'single' ? plan.meals[0]?.title : '7-Day Meal Plan'}
                  </Text>
                  <Text style={[styles.mealPlanDate, isDarkMode && styles.textLightSecondary]}>
                    {new Date(plan.generatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.mealPlanSubtitle, isDarkMode && styles.textLightSecondary]}>
                  {plan.type === 'single' 
                    ? `${plan.servings || 1} serving${(plan.servings || 1) > 1 ? 's' : ''}`
                    : `21 meals for ${plan.servings || 1} people`
                  }
                </Text>
              </TouchableOpacity>
            ))}
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
    gap: 15,
    marginBottom: 30,
  },
  mealPlanCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#5DB075',
  },
  mealPlanCardDark: {
    backgroundColor: '#2A2A2A',
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  mealPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 10,
  },
  mealPlanDate: {
    fontSize: 12,
    color: '#666666',
  },
  mealPlanSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default HomeScreen; 
