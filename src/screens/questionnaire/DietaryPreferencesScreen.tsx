import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import { FoodAllergy } from '../../types/questionnaire';
import Animated, {
  Layout,
  FadeInUp,
  FadeOutDown,
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { clamp } from 'react-native-redash';

type DietaryPreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DietaryPreferencesScreen'
>;

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
  { id: 'Nightshades', name: 'Nightshades', description: 'Tomatoes, peppers, eggplant', icon: 'chili-mild' },
  { id: 'Chicken', name: 'Chicken', description: 'Chicken and chicken products', icon: 'food-drumstick' },
];

const SwipeToRemoveItem = ({
  allergy,
  onRemove,
  isDarkMode,
}: {
  allergy: { id: FoodAllergy; name: string; icon: string; description: string };
  onRemove: () => void;
  isDarkMode: boolean;
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const MAX_TRANSLATE = -100;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: Math.abs(translateX.value) / Math.abs(MAX_TRANSLATE),
  }));

  const onEnd = () => {
    if (translateX.value < MAX_TRANSLATE / 2) {
      opacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(-300, { duration: 200 }, () => runOnJS(onRemove)());
    } else {
      translateX.value = withTiming(0);
    }
  };
  console.log("Allergy name is ", allergy)

  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify()}
      exiting={SlideOutUp.duration(300).springify()}
      layout={Layout.springify().damping(15).stiffness(150)}
      style={styles.swipeItemContainer}
    >
      <Animated.View style={[styles.deleteBackground, backgroundStyle]}>
        <Icon name="delete" size={24} color="#FFFFFF" />
        <Text style={styles.deleteText}>Remove</Text>
      </Animated.View>
      
      <PanGestureHandler
        onGestureEvent={({ nativeEvent }) => {
          translateX.value = clamp(nativeEvent.translationX, MAX_TRANSLATE, 0);
        }}
        onEnded={onEnd}
      >
        <Animated.View
          style={[
            styles.selectedAllergyCard,
            animatedStyle,
          ]}
        >
          <View style={styles.selectedAllergyContent}>
            <View style={styles.iconContainer}>
              <Icon name={allergy.icon} size={24} color="#5DB075" />
            </View>
            <View>
              <Text style={[styles.optionName]}>{allergy.name}</Text>
              <Text style={[styles.optionDescription]}>
                {allergy.description}
              </Text>
            </View>

          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export const DietaryPreferencesScreen: React.FC = () => {
  const navigation = useNavigation<DietaryPreferencesScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const [newUnwantedFood, setNewUnwantedFood] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const toggleAllergy = (allergy: FoodAllergy) => {
    const currentAllergies = responses.foodAllergies;
    if (currentAllergies.includes(allergy)) {
      setResponses({
        ...responses,
        foodAllergies: currentAllergies.filter(a => a !== allergy),
      });
    } else {
      setResponses({
        ...responses,
        foodAllergies: [...currentAllergies, allergy],
      });
    }
  };

  const clearAllAllergies = () => {
    setResponses({
      ...responses,
      foodAllergies: [],
    });
  };

  const addUnwantedFood = () => {
    if (newUnwantedFood.trim()) {
      setResponses({
        ...responses,
        unwantedFoods: [...responses.unwantedFoods, newUnwantedFood.trim()],
      });
      setNewUnwantedFood('');
    }
  };

  const removeUnwantedFood = (food: string) => {
    setResponses({
      ...responses,
      unwantedFoods: responses.unwantedFoods.filter(f => f !== food),
    });
  };

  const handleContinue = () => {
    navigation.navigate('CookingSkillScreen');
  };

  const availableAllergies = FOOD_ALLERGIES.filter(
    a => !responses.foodAllergies.includes(a.id)
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#5DB075" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="food-apple-outline" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Food Allergies
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Tell us about your dietary restrictions and preferences
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {responses.foodAllergies.length > 0 && (
          <Animated.View 
            style={[styles.selectedAllergiesSection, isDarkMode && styles.selectedAllergiesSectionDark]}
            entering={FadeInUp.duration(400).springify()}
            layout={Layout.springify().damping(15).stiffness(150)}
          >
            <View style={styles.selectedHeader}>
              <View style={styles.selectedHeaderContent}>
                <Icon name="check-circle" size={24} color="#5DB075" />
                <Text style={[styles.questionText, styles.selectedTitle, isDarkMode && styles.textLight]}>
                  Selected Allergies ({responses.foodAllergies.length})
                </Text>
              </View>
              <TouchableOpacity onPress={clearAllAllergies} style={styles.clearButton}>
                <Text style={[styles.clearText, isDarkMode && styles.textLightSecondary]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.selectedSubtitle, isDarkMode && styles.textLightSecondary]}>
              Swipe left to remove an allergy
            </Text>
            {responses.foodAllergies.map((allergyId) => {
              const allergy = FOOD_ALLERGIES.find(a => a.id === allergyId);
              if (!allergy) return null;
              return (
                <SwipeToRemoveItem
                  key={allergy.id}
                  allergy={allergy}
                  onRemove={() => toggleAllergy(allergy.id)}
                  isDarkMode={isDarkMode}
                />
              );
            })}
          </Animated.View>
        )}

        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            Do you have any major food allergies or avoidances?
          </Text>
          <View style={styles.optionsContainer}>
            {availableAllergies.map((allergy) => (
              <Animated.View 
                key={allergy.id} 
                entering={FadeInUp.duration(400).delay(FOOD_ALLERGIES.indexOf(allergy) * 50).springify()}
                exiting={FadeOutDown.duration(300).springify()}
                layout={Layout.springify().damping(15).stiffness(150)}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    isDarkMode && styles.optionCardDark,
                  ]}
                  onPress={() => toggleAllergy(allergy.id)}
                >
                  <View style={styles.iconContainer}>
                    <Icon name={allergy.icon} size={24} color="#5DB075" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionName]}>
                      {allergy.name}
                    </Text>
                    <Text style={[styles.optionDescription]}>
                      {allergy.description}
                    </Text>
                  </View>
                  <Icon name="plus-circle-outline" size={24} color="#5DB075" />
                </TouchableOpacity>
              </Animated.View>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
  content: {
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#5DB075',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  unwantedFoodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  unwantedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unwantedFoodItemDark: {
    backgroundColor: '#2A2A2A',
  },
  unwantedFoodText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
  },
  footer: {
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedAllergiesSection: {
    marginBottom: 30,
    backgroundColor: '#F8FFFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F5EF',
  },
  selectedAllergiesSectionDark: {
    backgroundColor: '#1A2A1A',
    borderColor: '#2A4A2A',
  },
  selectedAllergyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E8F5EF',
  },
  selectedAllergyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeItemContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 10,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    fontSize: 14,
    color: '#5DB075',
    fontWeight: '500',
  },
  selectedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedSubtitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  clearButton: {
    paddingHorizontal: 10,
  },
});
