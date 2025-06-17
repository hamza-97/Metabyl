import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuestionnaireResponse, FoodAllergy } from '../../types/questionnaire';

interface Props {
  responses: QuestionnaireResponse;
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void;
}

const FOOD_ALLERGIES: { id: FoodAllergy; name: string; description: string; icon: string }[] = [
  { id: 'Dairy', name: 'Dairy', description: 'Milk, cheese, yogurt', icon: 'cup' },
  { id: 'Eggs', name: 'Eggs', description: 'All egg products', icon: 'egg' },
  { id: 'Gluten', name: 'Gluten', description: 'Wheat, barley, rye', icon: 'barley' },
  { id: 'Soy', name: 'Soy', description: 'Soybeans and soy products', icon: 'soy-sauce' },
  { id: 'Peanuts', name: 'Peanuts', description: 'Peanuts and peanut products', icon: 'peanut' },
  { id: 'Tree Nuts', name: 'Tree Nuts', description: 'Almonds, walnuts, cashews', icon: 'nut' },
  { id: 'Fish', name: 'Fish', description: 'All fish varieties', icon: 'fish' },
  { id: 'Shellfish', name: 'Shellfish', description: 'Shrimp, crab, lobster', icon: 'fish' },
  { id: 'Sesame', name: 'Sesame', description: 'Sesame seeds and oil', icon: 'seed' },
  { id: 'Corn', name: 'Corn', description: 'Corn and corn products', icon: 'corn' },
  { id: 'Nightshades', name: 'Nightshades', description: 'Tomatoes, peppers, eggplant', icon: 'pepper-hot' },
];

export const DietaryPreferences: React.FC<Props> = ({ responses, updateResponse }) => {
  const [newUnwantedFood, setNewUnwantedFood] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const toggleAllergy = (allergy: FoodAllergy) => {
    const currentAllergies = responses.foodAllergies;
    if (currentAllergies.includes(allergy)) {
      updateResponse('foodAllergies', currentAllergies.filter(a => a !== allergy));
    } else {
      updateResponse('foodAllergies', [...currentAllergies, allergy]);
    }
  };

  const addUnwantedFood = () => {
    if (newUnwantedFood.trim()) {
      updateResponse('unwantedFoods', [...responses.unwantedFoods, newUnwantedFood.trim()]);
      setNewUnwantedFood('');
    }
  };

  const removeUnwantedFood = (food: string) => {
    updateResponse('unwantedFoods', responses.unwantedFoods.filter(f => f !== food));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Do you have any major food allergies or avoidances?
        </Text>
        <View style={styles.optionsContainer}>
          {FOOD_ALLERGIES.map((allergy) => (
            <TouchableOpacity
              key={allergy.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.foodAllergies.includes(allergy.id) && styles.selectedCard,
              ]}
              onPress={() => toggleAllergy(allergy.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.foodAllergies.includes(allergy.id) && styles.selectedIconContainer
              ]}>
                <Icon
                  name={allergy.icon}
                  size={24}
                  color={responses.foodAllergies.includes(allergy.id) ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {allergy.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {allergy.description}
                </Text>
              </View>
              {responses.foodAllergies.includes(allergy.id) && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Are there specific foods you are unwilling to eat?
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={newUnwantedFood}
            onChangeText={setNewUnwantedFood}
            placeholder="Enter a food (e.g., mushrooms, spicy food)"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            onSubmitEditing={addUnwantedFood}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addUnwantedFood}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {responses.unwantedFoods.length > 0 && (
          <View style={styles.unwantedFoodsList}>
            {responses.unwantedFoods.map((food, index) => (
              <View key={index} style={[styles.unwantedFoodItem, isDarkMode && styles.unwantedFoodItemDark]}>
                <Text style={[styles.unwantedFoodText, isDarkMode && styles.textLight]}>{food}</Text>
                <TouchableOpacity
                  onPress={() => removeUnwantedFood(food)}
                  style={styles.removeButton}
                >
                  <Icon name="close-circle" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardDark: {
    backgroundColor: '#2A2A2A',
  },
  selectedCard: {
    borderColor: '#5DB075',
    backgroundColor: '#F8FFF8',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedIconContainer: {
    backgroundColor: '#5DB075',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  checkIcon: {
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#5DB075',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  unwantedFoodsList: {
    gap: 10,
  },
  unwantedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  unwantedFoodItemDark: {
    backgroundColor: '#2A2A2A',
  },
  unwantedFoodText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  removeButton: {
    padding: 4,
  },
}); 
