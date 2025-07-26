import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ComprehensiveMealPlan, Meal, DailyPlan } from '../../types/mealPlan';

interface Props {
  mealPlan: ComprehensiveMealPlan;
  onRecipePress?: (meal: Meal, mealType: string, dayIndex: number) => void;
}

export const ComprehensiveMealPlanDisplay: React.FC<Props> = ({ mealPlan, onRecipePress }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<'meals' | 'nutrition' | 'shopping'>('meals');

  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const mealTypes = [
    { key: 'breakfast', name: 'Breakfast', icon: 'coffee', color: '#FF6B6B' },
    { key: 'lunch', name: 'Lunch', icon: 'food-variant', color: '#4ECDC4' },
    { key: 'dinner', name: 'Dinner', icon: 'silverware-fork-knife', color: '#45B7D1' },
  ];

  const renderMealCard = (meal: Meal, mealType: string, dayIndex: number) => {
    const mealInfo = mealTypes.find(mt => mt.key === mealType);
    const clickable = typeof onRecipePress === 'function';
    const cardContent = (
      <View key={`${mealType}-${meal.name}`} style={[styles.mealCard, isDarkMode && styles.mealCardDark]}>
        {meal.imageUrl && (
          <Image 
            source={{ uri: meal.imageUrl }} 
            style={styles.mealImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.mealContent}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealTypeBadge, { backgroundColor: mealInfo?.color + '20' }]}> 
              <Icon name={mealInfo?.icon || 'food'} size={16} color={mealInfo?.color} />
              <Text style={[styles.mealTypeText, { color: mealInfo?.color }]}> {mealInfo?.name} </Text>
            </View>
          </View>
          <Text style={[styles.mealName, isDarkMode && styles.textLight]} numberOfLines={2}>
            {meal.name}
          </Text>
          <Text style={[styles.mealDescription, isDarkMode && styles.textLightSecondary]} numberOfLines={2}>
            {meal.description}
          </Text>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, isDarkMode && styles.textLightSecondary]}>Calories</Text>
              <Text style={[styles.nutritionValue, isDarkMode && styles.textLight]}>
                {meal.nutritionalInfo.calories}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, isDarkMode && styles.textLightSecondary]}>Protein</Text>
              <Text style={[styles.nutritionValue, isDarkMode && styles.textLight]}>
                {meal.nutritionalInfo.protein}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, isDarkMode && styles.textLightSecondary]}>Carbs</Text>
              <Text style={[styles.nutritionValue, isDarkMode && styles.textLight]}>
                {meal.nutritionalInfo.carbohydrates}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, isDarkMode && styles.textLightSecondary]}>Fat</Text>
              <Text style={[styles.nutritionValue, isDarkMode && styles.textLight]}>
                {meal.nutritionalInfo.fat}
              </Text>
            </View>
          </View>
          {meal.ingredients.length > 0 && (
            <View style={styles.ingredientsContainer}>
              <Text style={[styles.ingredientsTitle, isDarkMode && styles.textLight]}>
                Key Ingredients:
              </Text>
              <Text style={[styles.ingredientsText, isDarkMode && styles.textLightSecondary]} numberOfLines={2}>
                {meal.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
                {meal.ingredients.length > 3 && '...'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
    if (clickable) {
      return (
        <TouchableOpacity key={`${mealType}-${meal.name}`} activeOpacity={0.8} onPress={() => onRecipePress(meal, mealType, dayIndex)}>
          {cardContent}
        </TouchableOpacity>
      );
    }
    return cardContent;
  };

  const renderDailyPlan = (dailyPlan: DailyPlan, dayIndex: number) => (
    <View key={dayIndex} style={styles.dayContainer}>
      <Text style={[styles.dayTitle, isDarkMode && styles.textLight]}>
        {days[dayIndex]}
      </Text>
      <View style={styles.mealsContainer}>
        {mealTypes.map(({ key }) => {
          const meal = dailyPlan[key as keyof DailyPlan];
          return meal ? renderMealCard(meal, key, dayIndex) : null;
        })}
      </View>
    </View>
  );

  const renderNutritionalBreakdown = () => (
    <View style={styles.nutritionContainer}>
      <View style={[styles.nutritionCard, isDarkMode && styles.nutritionCardDark]}>
        <Text style={[styles.nutritionCardTitle, isDarkMode && styles.textLight]}>
          Weekly Nutrition Summary
        </Text>
        <Text style={[styles.nutritionSummary, isDarkMode && styles.textLightSecondary]}>
          {mealPlan.nutritionalBreakdown.summary}
        </Text>
        
        <View style={styles.totalNutrition}>
          <View style={styles.totalCalories}>
            <Text style={[styles.totalCaloriesLabel, isDarkMode && styles.textLightSecondary]}>
              Total Calories
            </Text>
            <Text style={[styles.totalCaloriesValue, isDarkMode && styles.textLight]}>
              {mealPlan.nutritionalBreakdown.calories}
            </Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroLabel, isDarkMode && styles.textLightSecondary]}>Protein</Text>
              <Text style={[styles.macroValue, isDarkMode && styles.textLight]}>
                {mealPlan.nutritionalBreakdown.macros.protein}
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroLabel, isDarkMode && styles.textLightSecondary]}>Carbs</Text>
              <Text style={[styles.macroValue, isDarkMode && styles.textLight]}>
                {mealPlan.nutritionalBreakdown.macros.carbohydrates}
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroLabel, isDarkMode && styles.textLightSecondary]}>Fat</Text>
              <Text style={[styles.macroValue, isDarkMode && styles.textLight]}>
                {mealPlan.nutritionalBreakdown.macros.fat}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderShoppingList = () => {
    const categories = [...new Set(mealPlan.shoppingList.map(item => item.category))];
    
    return (
      <View style={styles.shoppingContainer}>
        <Text style={[styles.shoppingTitle, isDarkMode && styles.textLight]}>
          Shopping List ({mealPlan.shoppingList.length} items)
        </Text>
        
        {categories.map(category => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={[styles.categoryTitle, isDarkMode && styles.textLight]}>
              {category}
            </Text>
            {mealPlan.shoppingList
              .filter(item => item.category === category)
              .map((item, index) => (
                <View key={index} style={[styles.shoppingItem, isDarkMode && styles.shoppingItemDark]}>
                  <View style={styles.shoppingItemContent}>
                    <Text style={[styles.shoppingItemName, isDarkMode && styles.textLight]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.shoppingItemQuantity, isDarkMode && styles.textLightSecondary]}>
                      {item.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.checkbox}>
                    <Icon name="checkbox-blank-outline" size={20} color="#5DB075" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meals':
        return (
          <View style={styles.mealsTab}>
            {mealPlan.mealPlan.map((dailyPlan, index) => 
              renderDailyPlan(dailyPlan, index)
            )}
          </View>
        );
      case 'nutrition':
        return renderNutritionalBreakdown();
      case 'shopping':
        return renderShoppingList();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={[styles.tabContainer, isDarkMode && styles.tabContainerDark]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meals' && styles.activeTab]}
          onPress={() => setActiveTab('meals')}
        >
          <Icon 
            name="calendar-week" 
            size={20} 
            color={activeTab === 'meals' ? '#5DB075' : (isDarkMode ? '#AAAAAA' : '#666666')} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'meals' && styles.activeTabText,
            isDarkMode && styles.textLightSecondary
          ]}>
            Meals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Icon 
            name="chart-line" 
            size={20} 
            color={activeTab === 'nutrition' ? '#5DB075' : (isDarkMode ? '#AAAAAA' : '#666666')} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'nutrition' && styles.activeTabText,
            isDarkMode && styles.textLightSecondary
          ]}>
            Nutrition
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shopping' && styles.activeTab]}
          onPress={() => setActiveTab('shopping')}
        >
          <Icon 
            name="cart-outline" 
            size={20} 
            color={activeTab === 'shopping' ? '#5DB075' : (isDarkMode ? '#AAAAAA' : '#666666')} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'shopping' && styles.activeTabText,
            isDarkMode && styles.textLightSecondary
          ]}>
            Shopping
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 20,
  },
  tabContainerDark: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5DB075',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#5DB075',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mealsTab: {
    gap: 20,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealCardDark: {
    backgroundColor: '#2A2A2A',
  },
  mealImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  ingredientsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  ingredientsText: {
    fontSize: 12,
    color: '#666666',
  },
  nutritionContainer: {
    paddingVertical: 10,
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionCardDark: {
    backgroundColor: '#2A2A2A',
  },
  nutritionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  nutritionSummary: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 20,
  },
  totalNutrition: {
    gap: 16,
  },
  totalCalories: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  totalCaloriesLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  totalCaloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5DB075',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  shoppingContainer: {
    gap: 20,
  },
  shoppingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shoppingItemDark: {
    backgroundColor: '#2A2A2A',
  },
  shoppingItemContent: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  shoppingItemQuantity: {
    fontSize: 12,
    color: '#666666',
  },
  checkbox: {
    marginLeft: 12,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default ComprehensiveMealPlanDisplay; 
