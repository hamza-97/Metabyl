import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useQuestionnaireStore } from '../../store/questionnaireStore';

type HouseholdSizeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HouseholdSizeScreen'
>;

const PEOPLE_OPTIONS = [
  { id: 1, name: '1 Person', description: 'Just me', icon: 'account' },
  { id: 2, name: '2 People', description: 'Couple or roommates', icon: 'account-multiple' },
  { id: 3, name: '3 People', description: 'Small family', icon: 'account-group' },
  { id: 4, name: '4 People', description: 'Family of four', icon: 'account-group' },
  { id: 5, name: '5 People', description: 'Medium family', icon: 'account-group' },
  { id: 6, name: '6 People', description: 'Large family', icon: 'account-group' },
  { id: 7, name: '7 People', description: 'Extended family', icon: 'account-group' },
  { id: 8, name: '8 People', description: 'Very large family', icon: 'account-group' },
];

export const HouseholdSizeScreen: React.FC = () => {
  const navigation = useNavigation<HouseholdSizeScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const [customCount, setCustomCount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const handleSelection = (peopleCount: number) => {
    setShowCustomInput(false);
    setCustomCount('');
    setResponses({
      ...responses,
      peopleCount,
      // Reset children selection if going back to 1 person
      ...(peopleCount === 1 && { hasChildren: undefined })
    });
    
    // Navigate to next screen based on selection
    if (peopleCount === 1) {
      navigation.navigate('DietaryPreferencesScreen');
    } else {
      navigation.navigate('ChildrenQuestionScreen');
    }
  };

  const handleCustomInput = () => {
    setShowCustomInput(true);
    setResponses({
      ...responses,
      peopleCount: 0, // Temporary value to indicate custom input mode
    });
  };

  const handleCustomSubmit = () => {
    const count = parseInt(customCount);
    if (count && count > 0) {
      setResponses({
        ...responses,
        peopleCount: count,
        // Reset children selection if going back to 1 person
        ...(count === 1 && { hasChildren: undefined })
      });
      
      // Navigate to next screen based on selection
      if (count === 1) {
        navigation.navigate('DietaryPreferencesScreen');
      } else {
        navigation.navigate('ChildrenQuestionScreen');
      }
    }
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
          <Icon name="home-outline" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Household Size
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          How many people do you typically prepare meals for each day?
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {PEOPLE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.peopleCount === option.id && styles.selectedCard,
              ]}
              onPress={() => handleSelection(option.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.peopleCount === option.id && styles.selectedIconContainer
              ]}>
                <Icon
                  name={option.icon}
                  size={20}
                  color={responses.peopleCount === option.id ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                {option.name}
              </Text>
              {responses.peopleCount === option.id && (
                <Icon name="check-circle" size={20} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customSection}>
          <Text style={[styles.customSectionTitle, isDarkMode && styles.textLight]}>
            More than 8 people?
          </Text>
          
          {!showCustomInput ? (
            <TouchableOpacity
              style={[
                styles.customInputCard,
                isDarkMode && styles.optionCardDark,
                responses.peopleCount > 8 && styles.selectedCard,
              ]}
              onPress={handleCustomInput}
            >
              <View style={[
                styles.iconContainer,
                responses.peopleCount > 8 && styles.selectedIconContainer
              ]}>
                <Icon
                  name="plus"
                  size={20}
                  color={responses.peopleCount > 8 ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                Enter custom number
              </Text>
              {responses.peopleCount > 8 && (
                <Text style={[styles.customCountDisplay, isDarkMode && styles.textLight]}>
                  {responses.peopleCount} people
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={[styles.customInputContainer, isDarkMode && styles.customInputContainerDark]}>
              <TextInput
                style={[styles.customInput, isDarkMode && styles.customInputDark]}
                value={customCount}
                onChangeText={setCustomCount}
                placeholder="Enter number of people"
                placeholderTextColor={isDarkMode ? '#999' : '#666'}
                keyboardType="numeric"
                autoFocus
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!customCount || parseInt(customCount) <= 0) && styles.submitButtonDisabled
                ]}
                onPress={handleCustomSubmit}
                disabled={!customCount || parseInt(customCount) <= 0}
              >
                <Text style={styles.submitButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    width: '48%',
    minHeight: 70,
  },
  optionCardDark: {
    backgroundColor: '#2A2A2A',
  },
  selectedCard: {
    borderColor: '#5DB075',
    backgroundColor: '#F8FFF8',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedIconContainer: {
    backgroundColor: '#5DB075',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 5,
  },
  customSection: {
    marginTop: 10,
  },
  customSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  customInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 15,
  },
  customCountDisplay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DB075',
  },
  customInputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    gap: 15,
  },
  customInputContainerDark: {
    backgroundColor: '#2A2A2A',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  customInputDark: {
    backgroundColor: '#1A1A1A',
    borderColor: '#444',
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
