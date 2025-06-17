import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
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
  { id: 5, name: '5+ People', description: 'Large family', icon: 'account-group' },
];

export const HouseholdSizeScreen: React.FC = () => {
  const navigation = useNavigation<HouseholdSizeScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const handleSelection = (peopleCount: number) => {
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

      <View style={styles.content}>
        <View style={styles.optionsContainer}>
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
                  size={24}
                  color={responses.peopleCount === option.id ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {option.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {option.description}
                </Text>
              </View>
              {responses.peopleCount === option.id && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    padding: 20,
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
