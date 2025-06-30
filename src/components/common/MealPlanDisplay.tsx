import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GeneratedMealPlan, GeneratedMeal, WeeklyMealPlanData } from '../../types/mealPlan';
import { RootStackParamList } from '../../navigation';

type MealPlanNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>;

interface Props {
  mealPlan: GeneratedMealPlan;
}

export const MealPlanDisplay: React.FC<Props> = ({ mealPlan }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<MealPlanNavigationProp>();

  const navigateToRecipeDetail = (meal: GeneratedMeal) => {
    navigation.navigate('RecipeDetail', { recipeId: meal.id });
  };

  const renderMeal = (meal: GeneratedMeal) => (
    <TouchableOpacity
      key={meal.id}
      style={[styles.mealCard, isDarkMode && styles.mealCardDark]}
      onPress={() => navigateToRecipeDetail(meal)}
    >
      {meal.image && (
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
      )}
      <View style={styles.mealContent}>
        <Text style={[styles.mealTitle, isDarkMode && styles.textLight]}>
          {meal.title}
        </Text>
        <View style={styles.mealDetails}>
          <View style={styles.mealDetailItem}>
            <Icon name="clock-outline" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
            <Text style={[styles.mealDetailText, isDarkMode && styles.textLightSecondary]}>
              {meal.readyInMinutes} min
            </Text>
          </View>
          <View style={styles.mealDetailItem}>
            <Icon name="account-group" size={16} color={isDarkMode ? '#AAAAAA' : '#666666'} />
            <Text style={[styles.mealDetailText, isDarkMode && styles.textLightSecondary]}>
              {meal.servings} serving{meal.servings > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        {meal.ingredients && meal.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={[styles.ingredientsTitle, isDarkMode && styles.textLight]}>
              Key Ingredients:
            </Text>
            <Text style={[styles.ingredientsText, isDarkMode && styles.textLightSecondary]}>
              {meal.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
              {meal.ingredients.length > 3 && '...'}
            </Text>
          </View>
        )}
      </View>
      <Icon name="chevron-right" size={20} color={isDarkMode ? '#5DB075' : '#5DB075'} style={styles.linkIcon} />
    </TouchableOpacity>
  );

  const renderWeeklyPlan = (weeklyData: WeeklyMealPlanData) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
      <View style={styles.weeklyContainer}>
        {days.map((day, index) => (
          <View key={day} style={[styles.dayCard, isDarkMode && styles.dayCardDark]}>
            <Text style={[styles.dayTitle, isDarkMode && styles.textLight]}>
              {dayNames[index]}
            </Text>
            {weeklyData[day] && (
              <View style={styles.dayMeals}>
                {weeklyData[day].breakfast && (
                  <TouchableOpacity 
                    style={styles.mealSlot}
                    onPress={() => navigateToRecipeDetail(weeklyData[day].breakfast!)}
                  >
                    <Text style={[styles.mealSlotTitle, isDarkMode && styles.textLightSecondary]}>
                      Breakfast
                    </Text>
                    <Text style={[styles.mealSlotName, isDarkMode && styles.textLight]}>
                      {weeklyData[day].breakfast!.title}
                    </Text>
                  </TouchableOpacity>
                )}
                {weeklyData[day].lunch && (
                  <TouchableOpacity 
                    style={styles.mealSlot}
                    onPress={() => navigateToRecipeDetail(weeklyData[day].lunch!)}
                  >
                    <Text style={[styles.mealSlotTitle, isDarkMode && styles.textLightSecondary]}>
                      Lunch
                    </Text>
                    <Text style={[styles.mealSlotName, isDarkMode && styles.textLight]}>
                      {weeklyData[day].lunch!.title}
                    </Text>
                  </TouchableOpacity>
                )}
                {weeklyData[day].dinner && (
                  <TouchableOpacity 
                    style={styles.mealSlot}
                    onPress={() => navigateToRecipeDetail(weeklyData[day].dinner!)}
                  >
                    <Text style={[styles.mealSlotTitle, isDarkMode && styles.textLightSecondary]}>
                      Dinner
                    </Text>
                    <Text style={[styles.mealSlotName, isDarkMode && styles.textLight]}>
                      {weeklyData[day].dinner!.title}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>
          {mealPlan.type === 'single' ? 'Your Meal' : 'Your 7-Day Plan'}
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Generated on {new Date(mealPlan.generatedAt).toLocaleDateString()}
        </Text>
      </View>

      {mealPlan.type === 'single' ? (
        <View style={styles.singleMealContainer}>
          {mealPlan.meals.map(renderMeal)}
        </View>
      ) : (
        renderWeeklyPlan(mealPlan.weeklyData)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  singleMealContainer: {
    gap: 15,
  },
  mealCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mealCardDark: {
    backgroundColor: '#2A2A2A',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  mealContent: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  mealDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  mealDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealDetailText: {
    fontSize: 12,
    color: '#666666',
  },
  ingredientsContainer: {
    marginTop: 5,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  ingredientsText: {
    fontSize: 12,
    color: '#666666',
  },
  linkIcon: {
    marginLeft: 10,
  },
  weeklyContainer: {
    gap: 15,
  },
  dayCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
  },
  dayCardDark: {
    backgroundColor: '#2A2A2A',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  dayMeals: {
    gap: 8,
  },
  mealSlot: {
    borderLeftWidth: 3,
    borderLeftColor: '#5DB075',
    paddingLeft: 10,
  },
  mealSlotTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
  },
  mealSlotName: {
    fontSize: 14,
    color: '#333333',
    marginTop: 2,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
}); 
