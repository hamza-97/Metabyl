import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import { CookingEquipment, CulturalStyle } from '../../types/questionnaire';

type FinalPersonalizationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FinalPersonalizationScreen'
>;

const COOKING_EQUIPMENT: { id: CookingEquipment; name: string; description: string; icon: string }[] = [
  { id: 'Standard oven & stovetop', name: 'Standard Oven & Stovetop', description: 'Basic kitchen setup', icon: 'stove' },
  { id: 'Instant Pot / Pressure Cooker', name: 'Instant Pot', description: 'Pressure cooking', icon: 'pot' },
  { id: 'Slow Cooker / Crockpot', name: 'Slow Cooker', description: 'Set and forget cooking', icon: 'pot-steam' },
  { id: 'Air Fryer', name: 'Air Fryer', description: 'Crispy without oil', icon: 'air-filter' },
  { id: 'Outdoor Grill', name: 'Outdoor Grill', description: 'Gas or charcoal', icon: 'grill' },
  { id: 'Pellet Smoker', name: 'Pellet Smoker', description: 'Wood pellet smoking', icon: 'grill-outline' },
];

const CULTURAL_STYLES: { id: CulturalStyle; name: string; description: string; icon: string }[] = [
  { id: 'American comfort', name: 'American Comfort', description: 'Classic home cooking', icon: 'food' },
  { id: 'Tex-Mex / Southwest', name: 'Tex-Mex', description: 'Spicy southwestern flavors', icon: 'chili-hot' },
  { id: 'Asian / Stir Fry', name: 'Asian', description: 'Fresh and flavorful', icon: 'noodles' },
  { id: 'Italian / Mediterranean', name: 'Italian', description: 'Fresh herbs and olive oil', icon: 'pasta' },
  { id: 'Middle Eastern', name: 'Middle Eastern', description: 'Rich spices and flavors', icon: 'food-variant' },
  { id: 'Indian / Curry', name: 'Indian', description: 'Complex spice blends', icon: 'curry' },
];

export const FinalPersonalizationScreen: React.FC = () => {
  const navigation = useNavigation<FinalPersonalizationScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const toggleEquipment = (equipment: CookingEquipment) => {
    const currentEquipment = responses.cookingEquipment;
    if (currentEquipment.includes(equipment)) {
      setResponses({
        ...responses,
        cookingEquipment: currentEquipment.filter((e: CookingEquipment) => e !== equipment)
      });
    } else {
      setResponses({
        ...responses,
        cookingEquipment: [...currentEquipment, equipment]
      });
    }
  };

  const toggleCulturalStyle = (style: CulturalStyle) => {
    const currentStyles = responses.culturalPreferences;
    if (currentStyles.includes(style)) {
      setResponses({
        ...responses,
        culturalPreferences: currentStyles.filter((s: CulturalStyle) => s !== style)
      });
    } else {
      setResponses({
        ...responses,
        culturalPreferences: [...currentStyles, style]
      });
    }
  };

  const handleComplete = () => {
    // Here you would typically save the responses to your backend
    console.log('Questionnaire completed:', responses);
    navigation.navigate('PaywallScreen');
  };

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
          <Icon name="tune" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Final Touches
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Last few details to perfect your experience
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            What cooking equipment do you have? (Select all that apply)
          </Text>
          <View style={styles.optionsContainer}>
            {COOKING_EQUIPMENT.map((equipment) => (
              <TouchableOpacity
                key={equipment.id}
                style={[
                  styles.optionCard,
                  isDarkMode && styles.optionCardDark,
                  responses.cookingEquipment.includes(equipment.id) && styles.selectedCard,
                ]}
                onPress={() => toggleEquipment(equipment.id)}
              >
                <View style={[
                  styles.iconContainer,
                  responses.cookingEquipment.includes(equipment.id) && styles.selectedIconContainer
                ]}>
                  <Icon
                    name={equipment.icon}
                    size={24}
                    color={responses.cookingEquipment.includes(equipment.id) ? '#FFFFFF' : '#5DB075'}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionName,
                    isDarkMode && styles.textLight
                  ]}>
                    {equipment.name}
                  </Text>
                  <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                    {equipment.description}
                  </Text>
                </View>
                {responses.cookingEquipment.includes(equipment.id) && (
                  <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            What types of cuisine do you enjoy? (Select all that apply)
          </Text>
          <View style={styles.optionsContainer}>
            {CULTURAL_STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.optionCard,
                  isDarkMode && styles.optionCardDark,
                  responses.culturalPreferences.includes(style.id) && styles.selectedCard,
                ]}
                onPress={() => toggleCulturalStyle(style.id)}
              >
                <View style={[
                  styles.iconContainer,
                  responses.culturalPreferences.includes(style.id) && styles.selectedIconContainer
                ]}>
                  <Icon
                    name={style.icon}
                    size={24}
                    color={responses.culturalPreferences.includes(style.id) ? '#FFFFFF' : '#5DB075'}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionName,
                    isDarkMode && styles.textLight
                  ]}>
                    {style.name}
                  </Text>
                  <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                    {style.description}
                  </Text>
                </View>
                {responses.culturalPreferences.includes(style.id) && (
                  <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>Complete Setup</Text>
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
  footer: {
    paddingVertical: 20,
  },
  completeButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 
