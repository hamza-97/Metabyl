import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useUserStore } from '../../store/userStore';

type DietOption = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const dietaryOptions: DietOption[] = [
  {
    id: 'omnivore',
    name: 'Omnivore',
    icon: 'food-steak',
    description: 'I eat everything',
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    icon: 'leaf',
    description: 'No meat, but I eat dairy and eggs',
  },
  {
    id: 'vegan',
    name: 'Vegan',
    icon: 'sprout',
    description: 'No animal products',
  },
  {
    id: 'pescatarian',
    name: 'Pescatarian',
    icon: 'fish',
    description: 'No meat, but I eat fish',
  },
  {
    id: 'keto',
    name: 'Keto',
    icon: 'cheese',
    description: 'Low carb, high fat',
  },
  {
    id: 'paleo',
    name: 'Paleo',
    icon: 'food-drumstick',
    description: 'Whole foods, no processed items',
  },
  {
    id: 'gluten_free',
    name: 'Gluten-Free',
    icon: 'barley-off',
    description: 'No gluten-containing foods',
  },
];

const DietaryPreferencesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';
  
  // Get state and actions from store
  const dietaryPreference = useUserStore((state) => state.dietaryPreference);
  const setDietaryPreference = useUserStore((state) => state.setDietaryPreference);

  const handleNext = () => {
    navigation.navigate('PaywallScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Green Header */}
      <View style={styles.greenHeader}>
        <Text style={styles.greenHeaderText}>Metabyl</Text>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>
          What's your diet preference?
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          We'll customize your meal plans accordingly
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              dietaryPreference === option.id && styles.selectedCard,
            ]}
            onPress={() => setDietaryPreference(option.id)}
          >
            <View style={[styles.iconContainer, dietaryPreference === option.id && styles.selectedIconContainer]}>
              <Icon
                name={option.icon}
                size={24}
                color={dietaryPreference === option.id ? '#FFFFFF' : '#5DB075'}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionName, isDarkMode && styles.textLight]}>
                {option.name}
              </Text>
              <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                {option.description}
              </Text>
            </View>
            {dietaryPreference === option.id && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !dietaryPreference && styles.disabledButton]}
          onPress={handleNext}
          disabled={!dietaryPreference}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
  greenHeader: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  greenHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 15,
  },
  optionCardDark: {
    backgroundColor: '#2A2A2A',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#5DB075',
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
  nextButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default DietaryPreferencesScreen; 
