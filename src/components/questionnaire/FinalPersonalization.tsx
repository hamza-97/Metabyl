import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  QuestionnaireResponse,
  CookingEquipment,
  CulturalStyle,
} from '../../types/questionnaire';

interface Props {
  responses: QuestionnaireResponse;
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void;
}

const COOKING_EQUIPMENT: { id: CookingEquipment; name: string; description: string; icon: string }[] = [
  { id: 'Standard oven & stovetop', name: 'Standard oven & stovetop', description: 'Basic cooking equipment', icon: 'stove' },
  { id: 'Instant Pot / Pressure Cooker', name: 'Instant Pot / Pressure Cooker', description: 'Electric pressure cooking', icon: 'pot-steam' },
  { id: 'Slow Cooker / Crockpot', name: 'Slow Cooker / Crockpot', description: 'Set-and-forget cooking', icon: 'pot' },
  { id: 'Air Fryer', name: 'Air Fryer', description: 'Crispy food with less oil', icon: 'air-filter' },
  { id: 'Outdoor Grill', name: 'Outdoor Grill', description: 'Gas, charcoal, or pellet', icon: 'grill' },
  { id: 'Pellet Smoker', name: 'Pellet Smoker', description: 'Wood pellet smoking', icon: 'grill-outline' },
  { id: 'Kamado / Ceramic Smoker', name: 'Kamado / Ceramic Smoker', description: 'Ceramic egg-style cooker', icon: 'grill' },
  { id: 'No specialized equipment', name: 'No specialized equipment', description: 'Just the basics', icon: 'close-circle-outline' },
];

const CULTURAL_STYLES: { id: CulturalStyle; name: string; description: string; icon: string }[] = [
  { id: 'American comfort', name: 'American comfort', description: 'Classic comfort foods', icon: 'hamburger' },
  { id: 'Tex-Mex / Southwest', name: 'Tex-Mex / Southwest', description: 'Spicy and flavorful', icon: 'chili-hot' },
  { id: 'Asian / Stir Fry', name: 'Asian / Stir Fry', description: 'Fresh and balanced', icon: 'food-takeout-box' },
  { id: 'Italian / Mediterranean', name: 'Italian / Mediterranean', description: 'Fresh herbs and olive oil', icon: 'pasta' },
  { id: 'Middle Eastern', name: 'Middle Eastern', description: 'Rich spices and flavors', icon: 'food-variant' },
  { id: 'Indian / Curry', name: 'Indian / Curry', description: 'Complex spice blends', icon: 'bowl-mix' },
  { id: 'Southern / BBQ', name: 'Southern / BBQ', description: 'Smoky and hearty', icon: 'grill' },
  { id: 'Classic Low-Carb / Keto-style', name: 'Classic Low-Carb / Keto-style', description: 'High fat, low carb', icon: 'food-steak' },
  { id: 'Open to anything', name: 'Open to anything', description: 'I love variety!', icon: 'heart' },
];

export const FinalPersonalization: React.FC<Props> = ({ responses, updateResponse }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const toggleEquipment = (equipment: CookingEquipment) => {
    const currentEquipment = responses.cookingEquipment;
    if (currentEquipment.includes(equipment)) {
      updateResponse('cookingEquipment', currentEquipment.filter(e => e !== equipment));
    } else {
      updateResponse('cookingEquipment', [...currentEquipment, equipment]);
    }
  };

  const toggleCulturalStyle = (style: CulturalStyle) => {
    const currentStyles = responses.culturalPreferences;
    if (currentStyles.includes(style)) {
      updateResponse('culturalPreferences', currentStyles.filter(s => s !== style));
    } else {
      updateResponse('culturalPreferences', [...currentStyles, style]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Final Personalization</Text>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Would you like Metabyl to generate fully automatic menus, or would you prefer to review and adjust weekly plans before starting?
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.wantsAutomaticMenus && styles.selectedCard,
            ]}
            onPress={() => updateResponse('wantsAutomaticMenus', true)}
          >
            <View style={[
              styles.iconContainer,
              responses.wantsAutomaticMenus && styles.selectedIconContainer
            ]}>
              <Icon
                name="robot"
                size={24}
                color={responses.wantsAutomaticMenus ? '#FFFFFF' : '#5DB075'}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                Fully Automatic
              </Text>
              <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                Let AI handle everything for me
              </Text>
            </View>
            {responses.wantsAutomaticMenus && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              !responses.wantsAutomaticMenus && styles.selectedCard,
            ]}
            onPress={() => updateResponse('wantsAutomaticMenus', false)}
          >
            <View style={[
              styles.iconContainer,
              !responses.wantsAutomaticMenus && styles.selectedIconContainer
            ]}>
              <Icon
                name="account-edit"
                size={24}
                color={!responses.wantsAutomaticMenus ? '#FFFFFF' : '#5DB075'}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                I want to review first
              </Text>
              <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                Let me customize before finalizing
              </Text>
            </View>
            {!responses.wantsAutomaticMenus && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.questionText}>
            Would you like us to send you a batch prep plan and shopping list each week?
          </Text>
          <Switch
            value={responses.wantsWeeklyPlan}
            onValueChange={(value) => updateResponse('wantsWeeklyPlan', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Do you have access to any of the following cooking equipment?
        </Text>
        <Text style={[styles.subText, isDarkMode && styles.textLightSecondary]}>
          Select all that apply
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
          Which flavor profiles do you enjoy most?
        </Text>
        <Text style={[styles.subText, isDarkMode && styles.textLightSecondary]}>
          Select all that apply
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

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Would you like Metabyl to include occasional "fast fallback meals" for busy nights?
        </Text>
        <Switch
          value={responses.includeEmergencyMeals}
          onValueChange={(value) => updateResponse('includeEmergencyMeals', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Do you have space to store extra prepared meals or proteins?
        </Text>
        <Text style={[styles.subText, isDarkMode && styles.textLightSecondary]}>
          Select your storage capacity
        </Text>
        <View style={styles.storageOptionsContainer}>
          <TouchableOpacity
            style={[
              styles.storageButton,
              responses.storageCapacity === 'full' && styles.storageButtonSelected
            ]}
            onPress={() => updateResponse('storageCapacity', 'full')}
          >
            <Text style={[
              styles.storageButtonText,
              responses.storageCapacity === 'full' && styles.storageButtonTextSelected
            ]}>
              Yes — we have freezer storage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.storageButton,
              responses.storageCapacity === 'limited' && styles.storageButtonSelected
            ]}
            onPress={() => updateResponse('storageCapacity', 'limited')}
          >
            <Text style={[
              styles.storageButtonText,
              responses.storageCapacity === 'limited' && styles.storageButtonTextSelected
            ]}>
              Limited — only small fridge storage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.storageButton,
              responses.storageCapacity === 'none' && styles.storageButtonSelected
            ]}
            onPress={() => updateResponse('storageCapacity', 'none')}
          >
            <Text style={[
              styles.storageButtonText,
              responses.storageCapacity === 'none' && styles.storageButtonTextSelected
            ]}>
              None
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  subText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    fontStyle: 'italic',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageOptionsContainer: {
    marginTop: 10,
  },
  storageButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  storageButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  storageButtonText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 16,
  },
  storageButtonTextSelected: {
    color: 'white',
  },
}); 
