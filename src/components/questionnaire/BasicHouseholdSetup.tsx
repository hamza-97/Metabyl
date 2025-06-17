import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuestionnaireResponse } from '../../types/questionnaire';

interface Props {
  responses: QuestionnaireResponse;
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void;
}

const PEOPLE_OPTIONS = [
  { id: 1, name: '1 Person', description: 'Just me', icon: 'account' },
  { id: 2, name: '2 People', description: 'Couple or roommates', icon: 'account-multiple' },
  { id: 3, name: '3 People', description: 'Small family', icon: 'account-group' },
  { id: 4, name: '4 People', description: 'Family of four', icon: 'account-group' },
  { id: 5, name: '5+ People', description: 'Large family', icon: 'account-group' },
];

export const BasicHouseholdSetup: React.FC<Props> = ({ responses, updateResponse }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          How many people do you typically prepare meals for each day?
        </Text>
        <View style={styles.optionsContainer}>
          {PEOPLE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.peopleCount === option.id && styles.selectedCard,
              ]}
              onPress={() => updateResponse('peopleCount', option.id)}
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

      {responses.peopleCount && responses.peopleCount > 1 && (
        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            Are you also planning for children (under 12)?
          </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.hasChildren && styles.selectedCard,
            ]}
            onPress={() => updateResponse('hasChildren', true)}
          >
            <View style={[
              styles.iconContainer,
              responses.hasChildren && styles.selectedIconContainer
            ]}>
              <Icon
                name="account-child"
                size={24}
                color={responses.hasChildren ? '#FFFFFF' : '#5DB075'}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                Yes
              </Text>
              <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                Include child-friendly portions and recipes
              </Text>
            </View>
            {responses.hasChildren && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.hasChildren === false && styles.selectedCard,
            ]}
            onPress={() => updateResponse('hasChildren', false)}
          >
            <View style={[
              styles.iconContainer,
              responses.hasChildren === false && styles.selectedIconContainer
            ]}>
              <Icon
                name="account-group"
                size={24}
                color={responses.hasChildren === false ? '#FFFFFF' : '#5DB075'}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionName,
                isDarkMode && styles.textLight
              ]}>
                No
              </Text>
              <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                Adult portions only
              </Text>
            </View>
            {responses.hasChildren === false && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
        </View>
      )}
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
    marginBottom: 20,
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
