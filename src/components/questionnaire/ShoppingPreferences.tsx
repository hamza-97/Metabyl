import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuestionnaireResponse, GroceryStore } from '../../types/questionnaire';

interface Props {
  responses: QuestionnaireResponse;
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void;
}

const GROCERY_STORES: { id: GroceryStore; name: string; description: string; icon: string }[] = [
  { id: 'Albertsons', name: 'Albertsons', description: 'Full-service grocery chain', icon: 'store' },
  { id: 'Aldi', name: 'Aldi', description: 'Discount grocery store', icon: 'store-outline' },
  { id: 'Costco/Sam\'s', name: 'Costco/Sam\'s', description: 'Warehouse club stores', icon: 'warehouse' },
  { id: 'Fresh Market / Whole Foods', name: 'Fresh Market / Whole Foods', description: 'Premium organic groceries', icon: 'leaf' },
  { id: 'Farmer\'s Market / CSA', name: 'Farmer\'s Market / CSA', description: 'Local fresh produce', icon: 'sprout' },
  { id: 'Food Lion', name: 'Food Lion', description: 'Regional grocery chain', icon: 'store' },
  { id: 'H-E-B', name: 'H-E-B', description: 'Texas-based grocery chain', icon: 'store' },
  { id: 'Kroger', name: 'Kroger', description: 'America\'s largest grocery chain', icon: 'store' },
  { id: 'Meier', name: 'Meier', description: 'Midwest grocery chain', icon: 'store' },
  { id: 'Publix', name: 'Publix', description: 'Southeast grocery chain', icon: 'store' },
  { id: 'Target', name: 'Target', description: 'Department store with groceries', icon: 'target' },
  { id: 'Walmart', name: 'Walmart', description: 'Supercenter with groceries', icon: 'store-24-hour' },
  { id: 'Online delivery', name: 'Online delivery', description: 'Instacart, Amazon Fresh, etc.', icon: 'truck-delivery' },
];

export const ShoppingPreferences: React.FC<Props> = ({ responses, updateResponse }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const toggleStore = (store: GroceryStore) => {
    const currentStores = responses.groceryStores;
    if (currentStores.includes(store)) {
      updateResponse('groceryStores', currentStores.filter(s => s !== store));
    } else {
      updateResponse('groceryStores', [...currentStores, store]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Where do you usually shop for groceries?
        </Text>
        <Text style={[styles.subText, isDarkMode && styles.textLightSecondary]}>
          Select all that apply
        </Text>
        
        <View style={styles.optionsContainer}>
          {GROCERY_STORES.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.groceryStores.includes(store.id) && styles.selectedCard,
              ]}
              onPress={() => toggleStore(store.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.groceryStores.includes(store.id) && styles.selectedIconContainer
              ]}>
                <Icon
                  name={store.icon}
                  size={24}
                  color={responses.groceryStores.includes(store.id) ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {store.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {store.description}
                </Text>
              </View>
              {responses.groceryStores.includes(store.id) && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 10,
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
}); 
