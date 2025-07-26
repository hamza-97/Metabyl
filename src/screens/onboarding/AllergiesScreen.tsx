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

type Allergy = {
  id: string;
  name: string;
  icon: string;
};

const allergies: Allergy[] = [
  { id: 'dairy', name: 'Dairy', icon: 'cheese' },
  { id: 'eggs', name: 'Eggs', icon: 'egg' },
  { id: 'peanuts', name: 'Peanuts', icon: 'peanut' },
  { id: 'tree_nuts', name: 'Tree Nuts', icon: 'food-apple' },
  { id: 'fish', name: 'Fish', icon: 'fish' },
  { id: 'shellfish', name: 'Shellfish', icon: 'shrimp' },
  { id: 'wheat', name: 'Wheat', icon: 'barley' },
  { id: 'soy', name: 'Soy', icon: 'soy-sauce' },
  { id: 'sesame', name: 'Sesame', icon: 'seed' },
  { id: 'chicken', name: 'Chicken', icon: 'food-drumstick' },
];

const AllergiesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';
  
  // Get state and actions from store
  const userAllergies = useUserStore((state) => state.allergies);
  const toggleAllergy = useUserStore((state) => state.toggleAllergy);

  const handleNext = () => {
    navigation.navigate('PaywallScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>


      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>
          Any food allergies?
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          We'll make sure to exclude these from your meal plans
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.allergiesGrid}>
          {allergies.map((allergy) => {
            const isSelected = userAllergies.includes(allergy.id);
            return (
              <TouchableOpacity
                key={allergy.id}
                style={[
                  styles.allergyCard,
                  isDarkMode && styles.allergyCardDark,
                  isSelected && styles.selectedAllergyCard,
                ]}
                onPress={() => toggleAllergy(allergy.id)}
              >
                <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
                  <Icon
                    name={allergy.icon}
                    size={24}
                    color={isSelected ? '#FFFFFF' : '#5DB075'}
                  />
                </View>
                <Text style={[styles.allergyName, isDarkMode && styles.textLight]}>
                  {allergy.name}
                </Text>
                {isSelected && (
                  <View style={styles.checkIconContainer}>
                    <Icon name="check-circle" size={18} color="#5DB075" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {userAllergies.length > 0 ? 'Continue' : 'No Allergies'}
          </Text>
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
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  allergyCard: {
    width: '30%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  allergyCardDark: {
    backgroundColor: '#2A2A2A',
  },
  selectedAllergyCard: {
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
    marginBottom: 10,
  },
  selectedIconContainer: {
    backgroundColor: '#5DB075',
  },
  allergyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
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

export default AllergiesScreen; 
