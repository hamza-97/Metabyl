import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import { useUserStore } from '../../store/userStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onMealPlanGenerated?: (mealPlan: any) => void;
}

export const MealPlanModal: React.FC<Props> = ({ visible, onClose, onMealPlanGenerated }) => {
  const [dietaryGoals, setDietaryGoals] = useState('');
  const [planDuration, setPlanDuration] = useState<'Daily' | 'Weekly'>('Daily');
  const [ingredientsToUse, setIngredientsToUse] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [familyPreferences, setFamilyPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';
  const { responses } = useQuestionnaireStore();
  const { allergies, dietaryPreference } = useUserStore();

  // Pre-populate fields when modal opens
  useEffect(() => {
    if (visible) {
      // Build dietary goals
      let goals = '';
      if (dietaryPreference) goals += dietaryPreference + ', ';
      if (allergies?.length) goals += `avoid ${allergies.join(', ')}, `;
      if (responses.unwantedFoods?.length) goals += `no ${responses.unwantedFoods.join(', ')}, `;
      if (responses.peopleCount) goals += `for ${responses.peopleCount} people`;
      setDietaryGoals(goals.replace(/, $/, ''));

      // Set family preferences
      let family = `for ${responses.peopleCount || 2} people`;
      if (responses.hasChildren) family += ` including ${responses.childrenCount} children`;
      if (responses.cookingSkill) family += `, ${responses.cookingSkill.toLowerCase()} cooking level`;
      setFamilyPreferences(family);

      // Set cuisine preferences
      if (responses.culturalPreferences?.length) {
        setCuisinePreferences(responses.culturalPreferences.join(', '));
      }
    }
  }, [visible, allergies, dietaryPreference, responses]);

  const handleGeneratePlan = async () => {
    setIsLoading(true);

    // Always build a valid object for the API
    const apiInput = {
      dietaryRequirements: dietaryGoals || '',
      availableIngredients: ingredientsToUse || '',
      cuisinePreferences: cuisinePreferences || '',
      familyPreferences: familyPreferences || '',
    };

    // Validate all fields are non-empty
    if (
      !apiInput.dietaryRequirements.trim() ||
      !apiInput.availableIngredients.trim() ||
      !apiInput.cuisinePreferences.trim() ||
      !apiInput.familyPreferences.trim()
    ) {
      setIsLoading(false);
      Alert.alert('All fields are required!');
      return;
    }

    console.log("api inpute is asdfjia lsdfja;s ", apiInput)
    try {
      const response = await fetch('http://localhost:9002/api/genkit/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: apiInput })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('LLM response:', result);

      if (result?.mealPlan?.length > 0) {
        // Transform for daily plan
        if (planDuration === 'Daily') {
          const firstDay = result.mealPlan[0];
          const mealPlan = {
            type: 'single',
            meals: [{
              id: Date.now().toString(),
              title: firstDay.dinner?.name || 'Generated Meal',
              image: firstDay.dinner?.imageUrl || '',
              readyInMinutes: 30,
              servings: responses.peopleCount || 2,
              summary: firstDay.dinner?.description || '',
              ingredients: firstDay.dinner?.ingredients || [],
              nutritionalInfo: firstDay.dinner?.nutritionalInfo || {},
            }],
            generatedAt: new Date().toISOString(),
            servings: responses.peopleCount || 2,
          };
          onMealPlanGenerated?.(mealPlan);
        } else {
          // Transform for weekly plan
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          const weeklyData: any = {};

          result.mealPlan.forEach((dayPlan: any, index: number) => {
            const dayName = days[index];
            if (dayName && dayPlan) {
              weeklyData[dayName] = {
                breakfast: {
                  id: `${dayName}-breakfast-${Date.now()}`,
                  title: dayPlan.breakfast?.name || 'Breakfast',
                  image: dayPlan.breakfast?.imageUrl || '',
                  readyInMinutes: 20,
                  servings: responses.peopleCount || 2,
                  summary: dayPlan.breakfast?.description || '',
                  ingredients: dayPlan.breakfast?.ingredients || [],
                  nutritionalInfo: dayPlan.breakfast?.nutritionalInfo || {},
                },
                lunch: {
                  id: `${dayName}-lunch-${Date.now()}`,
                  title: dayPlan.lunch?.name || 'Lunch',
                  image: dayPlan.lunch?.imageUrl || '',
                  readyInMinutes: 25,
                  servings: responses.peopleCount || 2,
                  summary: dayPlan.lunch?.description || '',
                  ingredients: dayPlan.lunch?.ingredients || [],
                  nutritionalInfo: dayPlan.lunch?.nutritionalInfo || {},
                },
                dinner: {
                  id: `${dayName}-dinner-${Date.now()}`,
                  title: dayPlan.dinner?.name || 'Dinner',
                  image: dayPlan.dinner?.imageUrl || '',
                  readyInMinutes: 35,
                  servings: responses.peopleCount || 2,
                  summary: dayPlan.dinner?.description || '',
                  ingredients: dayPlan.dinner?.ingredients || [],
                  nutritionalInfo: dayPlan.dinner?.nutritionalInfo || {},
                },
              };
            }
          });

          const weeklyPlan = {
            type: 'weekly',
            weeklyData,
            generatedAt: new Date().toISOString(),
            servings: responses.peopleCount || 2,
            nutritionalBreakdown: result.nutritionalBreakdown,
            shoppingList: result.shoppingList,
          };
          onMealPlanGenerated?.(weeklyPlan);
        }

        onClose();
      } else {
        Alert.alert('Error', 'No meal plan was generated. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Connection Error',
        'Cannot connect to the meal planning service. Make sure your server is running on http://localhost:9002'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDietaryGoals('');
    setIngredientsToUse('');
    setCuisinePreferences('');
    setFamilyPreferences('');
    setPlanDuration('Daily');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            Create Your Meal Plan
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            Tell us your needs, and we'll generate a custom plan for you.
          </Text>

          {/* Dietary Goals & Restrictions */}
          <View style={styles.section}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Dietary Goals & Restrictions
            </Text>
            <TextInput
              style={[styles.textArea, isDarkMode && styles.textAreaDark]}
              value={dietaryGoals}
              onChangeText={setDietaryGoals}
              placeholder="e.g., High protein, low carb, vegetarian, gluten-free, target 2200 calories..."
              placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Plan Duration */}
          <View style={styles.section}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Plan Duration
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPlanDuration('Daily')}
              >
                <View style={[styles.radioButton, planDuration === 'Daily' && styles.radioButtonSelected]}>
                  {planDuration === 'Daily' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.radioLabel, isDarkMode && styles.radioLabelDark]}>
                  Daily
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPlanDuration('Weekly')}
              >
                <View style={[styles.radioButton, planDuration === 'Weekly' && styles.radioButtonSelected]}>
                  {planDuration === 'Weekly' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.radioLabel, isDarkMode && styles.radioLabelDark]}>
                  Weekly
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredients to Use */}
          <View style={styles.section}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Ingredients to Use
            </Text>
            <TextInput
              style={[styles.textArea, isDarkMode && styles.textAreaDark]}
              value={ingredientsToUse}
              onChangeText={setIngredientsToUse}
              placeholder="e.g., chicken breast, broccoli, quinoa, olive oil..."
              placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={[styles.helper, isDarkMode && styles.helperDark]}>
              List any ingredients you have on hand that you'd like to include.
            </Text>
          </View>

          {/* Cuisine Preferences */}
          <View style={styles.section}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Cuisine Preferences
            </Text>
            <TextInput
              style={[styles.textArea, isDarkMode && styles.textAreaDark]}
              value={cuisinePreferences}
              onChangeText={setCuisinePreferences}
              placeholder="e.g., Italian, Mexican, Asian-inspired..."
              placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Family Preferences */}
          <View style={styles.section}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Family Preferences
            </Text>
            <TextInput
              style={[styles.textArea, isDarkMode && styles.textAreaDark]}
              value={familyPreferences}
              onChangeText={setFamilyPreferences}
              placeholder="e.g., Kid-friendly, for two adults, quick meals for weekdays..."
              placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={[styles.helper, isDarkMode && styles.helperDark]}>
              Any other preferences for who you're cooking for.
            </Text>
          </View>
        </ScrollView>

        {/* Generate Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
            onPress={handleGeneratePlan}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>Generating...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="auto-fix" size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Plan</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  subtitleDark: {
    color: '#AAAAAA',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  textAreaDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444444',
    color: '#FFFFFF',
  },
  helper: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  helperDark: {
    color: '#AAAAAA',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5DB075',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#5DB075',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333333',
  },
  radioLabelDark: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  generateButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
