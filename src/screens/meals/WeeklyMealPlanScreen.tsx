import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GeneratedMeal } from '../../types/mealPlan';
import { RootStackParamList } from '../../navigation';

type WeeklyMealPlanScreenRouteProp = RouteProp<RootStackParamList, 'WeeklyMealPlan'>;
type WeeklyMealPlanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WeeklyMealPlan'>;

const WeeklyMealPlanScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<WeeklyMealPlanScreenNavigationProp>();
  const route = useRoute<WeeklyMealPlanScreenRouteProp>();
  
  const { weeklyPlan } = route.params;

  const navigateToRecipeDetail = (meal: GeneratedMeal) => {
    navigation.navigate('RecipeDetail', { 
      recipeId: meal.id, 
      recipeTitle: meal.title,
      imageUrl: meal.image 
    });
  };

  const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
  const mealTypes = [
    { key: 'breakfast', name: 'Breakfast', time: '8:00 AM', icon: 'coffee' },
    { key: 'lunch', name: 'Lunch', time: '12:30 PM', icon: 'food-variant' },
    { key: 'dinner', name: 'Dinner', time: '7:00 PM', icon: 'silverware-fork-knife' },
  ];

  // Get current date and calculate the week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

  // Determine next meal based on current time
  const getNextMeal = () => {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
    // Meal times in minutes from midnight
    const breakfastTime = 8 * 60; // 8:00 AM
    const lunchTime = 12 * 60 + 30; // 12:30 PM  
    const dinnerTime = 19 * 60; // 7:00 PM
    
    if (currentTime < breakfastTime) {
      return 'breakfast';
    } else if (currentTime < lunchTime) {
      return 'lunch';
    } else if (currentTime < dinnerTime) {
      return 'dinner';
    } else {
      return 'breakfast'; // Next day's breakfast
    }
  };

  const nextMeal = getNextMeal();



  const renderCalendarWeek = () => (
    <View style={[styles.calendar, isDarkMode && styles.calendarDark]}>
      <Text style={[styles.calendarTitle, isDarkMode && styles.textLight]}>
        Week of {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
      <View style={styles.calendarDays}>
        {days.map((day, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          const isToday = date.toDateString() === today.toDateString();
          const dayName = `Day ${index + 1}`;
          
          return (
            <View key={index} style={[styles.calendarDay, isToday && styles.calendarDayToday]}>
              <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>
                {dayName}
              </Text>
              <Text style={[styles.calendarDayNumber, isToday && styles.calendarDayNumberToday]}>
                {date.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderMealItem = (meal: GeneratedMeal, mealType: string, isToday: boolean = false) => {
    const mealInfo = mealTypes.find(mt => mt.key === mealType);
    const isNextMeal = isToday && mealType === nextMeal;
    
    return (
      <TouchableOpacity
        key={`${meal.id}-${mealType}`}
        style={[
          styles.mealItem, 
          isDarkMode && styles.mealItemDark,
          isNextMeal && styles.nextMealItem,
          isNextMeal && isDarkMode && styles.nextMealItemDark
        ]}
        onPress={() => navigateToRecipeDetail(meal)}
      >
        {meal.image && (
          <Image 
            source={{ uri: meal.image }} 
            style={styles.mealImage}
          />
        )}
        <View style={styles.mealContent}>
          <View style={styles.mealHeader}>
            <Text style={[
              styles.mealTime, 
              isDarkMode && styles.textLightSecondary,
              isNextMeal && styles.nextMealTime
            ]}>
              {mealInfo?.time}
              {isNextMeal && ' • NEXT'}
            </Text>
            <Text style={[
              styles.mealType, 
              isDarkMode && styles.textLight,
              isNextMeal && styles.nextMealType
            ]}>
              {mealInfo?.name}
            </Text>
          </View>
          <Text style={[
            styles.mealTitle, 
            isDarkMode && styles.textLight,
            isNextMeal && styles.nextMealTitle
          ]} numberOfLines={2}>
            {meal.title}
          </Text>
          <Text style={[
            styles.mealDuration, 
            isDarkMode && styles.textLightSecondary,
            isNextMeal && styles.nextMealDuration
          ]}>
            {meal.readyInMinutes} min • {meal.servings} serving{meal.servings > 1 ? 's' : ''}
          </Text>
        </View>
        <Icon 
          name={isNextMeal ? "play-circle" : "chevron-right"} 
          size={20} 
          color={isNextMeal ? '#007AFF' : (isDarkMode ? '#666' : '#999')} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, isDarkMode && styles.backButtonDark]}>
          <Icon name="arrow-left" size={24} color={isDarkMode ? '#F0F6FF' : '#1A1A1A'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>
          7-Day Meal Plan
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCalendarWeek()}

        {days.map((day, dayIndex) => {
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + dayIndex);
          const dayTitle = `Day ${dayIndex + 1}`;
          const isToday = dayDate.toDateString() === today.toDateString();
          
          return (
            <View key={day} style={styles.dayContainer}>
              <Text style={[styles.dayTitle, isDarkMode && styles.textLight]}>
                {dayTitle}
                {isToday && <Text style={[styles.todayIndicator, isDarkMode && styles.todayIndicatorDark]}> • Today</Text>}
              </Text>
              
              <View style={styles.mealsContainer}>
                {mealTypes.map(({ key }) => {
                  const meal = weeklyPlan.weeklyData[day]?.[key as keyof typeof weeklyPlan.weeklyData[typeof day]];
                  return meal ? renderMealItem(meal, key, isToday) : null;
                })}
              </View>
            </View>
          );
        })}
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerDark: {
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonDark: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  calendar: {
    backgroundColor: '#F8F9FA',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  calendarDark: {
    backgroundColor: '#1A1A1A',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDay: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  calendarDayToday: {
    backgroundColor: '#007AFF',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  calendarDayTextToday: {
    color: '#FFFFFF',
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  calendarDayNumberToday: {
    color: '#FFFFFF',
  },
  dayContainer: {
    marginBottom: 32,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  mealsContainer: {
    paddingHorizontal: 20,
    gap: 1,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mealItemDark: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: '#333333',
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginRight: 12,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  mealDuration: {
    fontSize: 14,
    color: '#666666',
  },
  // Next meal highlighting styles
  nextMealItem: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  nextMealItemDark: {
    backgroundColor: '#001122',
    borderLeftColor: '#007AFF',
  },
  nextMealTime: {
    color: '#007AFF',
    fontWeight: '600',
  },
  nextMealType: {
    color: '#007AFF',
  },
  nextMealTitle: {
    color: '#007AFF',
    fontWeight: '600',
  },
  nextMealDuration: {
    color: '#007AFF',
  },
  todayIndicator: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  todayIndicatorDark: {
    color: '#007AFF',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default WeeklyMealPlanScreen; 
