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
import { GroceryStore } from '../../types/questionnaire';

type ShoppingPreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShoppingPreferencesScreen'
>;

const SHOPPING_PREFERENCES: { id: GroceryStore; name: string; description: string; icon: string }[] = [
  { id: 'Walmart', name: 'Walmart', description: 'Affordable groceries', icon: 'store' },
  { id: 'Target', name: 'Target', description: 'Quality and convenience', icon: 'target' },
  { id: 'Kroger', name: 'Kroger', description: 'Fresh groceries', icon: 'cart' },
  { id: 'Albertsons', name: 'Albertsons', description: 'Local grocery chain', icon: 'shopping' },
  { id: 'Fresh Market / Whole Foods', name: 'Whole Foods', description: 'Organic and natural', icon: 'leaf' },
  { id: 'Aldi', name: 'Aldi', description: 'Discount groceries', icon: 'store-24-hour' },
  { id: 'Costco/Sam\'s', name: 'Costco/Sam\'s', description: 'Bulk shopping', icon: 'warehouse' },
  { id: 'Farmer\'s Market / CSA', name: 'Local Markets', description: 'Support local businesses', icon: 'home-city' },
];

export const ShoppingPreferencesScreen: React.FC = () => {
  const navigation = useNavigation<ShoppingPreferencesScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const toggleShoppingPreference = (preference: GroceryStore) => {
    const currentPreferences = responses.groceryStores;
    if (currentPreferences.includes(preference)) {
      setResponses({
        ...responses,
        groceryStores: currentPreferences.filter((p: GroceryStore) => p !== preference)
      });
    } else {
      setResponses({
        ...responses,
        groceryStores: [...currentPreferences, preference]
      });
    }
  };

  const handleContinue = () => {
    navigation.navigate('FinalPersonalizationScreen');
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
          <Icon name="cart-outline" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Shopping Preferences
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Where do you like to shop for groceries? (Select all that apply)
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {SHOPPING_PREFERENCES.map((preference) => (
            <TouchableOpacity
              key={preference.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.groceryStores.includes(preference.id) && styles.selectedCard,
              ]}
              onPress={() => toggleShoppingPreference(preference.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.groceryStores.includes(preference.id) && styles.selectedIconContainer
              ]}>
                <Icon
                  name={preference.icon}
                  size={24}
                  color={responses.groceryStores.includes(preference.id) ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {preference.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {preference.description}
                </Text>
              </View>
              {responses.groceryStores.includes(preference.id) && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
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
}); 
