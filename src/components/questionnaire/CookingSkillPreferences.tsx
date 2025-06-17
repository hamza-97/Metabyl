import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuestionnaireResponse, CookingSkillLevel, CookingTime, WeeklyPrepTime } from '../../types/questionnaire';

interface Props {
  responses: QuestionnaireResponse;
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void;
}

const COOKING_SKILL_LEVELS: { id: CookingSkillLevel; name: string; description: string; icon: string }[] = [
  { id: 'Beginner', name: 'Beginner', description: 'I follow simple recipes', icon: 'book-open-variant' },
  { id: 'Intermediate', name: 'Intermediate', description: 'I can cook most dishes', icon: 'chef-hat' },
  { id: 'Confident', name: 'Confident', description: 'I cook regularly and experiment', icon: 'fire' },
  { id: 'Chef Mode', name: 'Chef Mode', description: 'I love complex recipes', icon: 'crown' },
];

const COOKING_TIMES: { id: CookingTime; name: string; description: string; icon: string }[] = [
  { id: '15 min or less', name: '15 min or less', description: 'Quick and easy meals', icon: 'clock-fast' },
  { id: '15-30 min', name: '15-30 min', description: 'Standard cooking time', icon: 'clock' },
  { id: '30-45 min', name: '30-45 min', description: 'More involved cooking', icon: 'clock-plus' },
  { id: '45+ min', name: '45+ min', description: 'I enjoy long cooking sessions', icon: 'clock-alert' },
];

const PREP_TIMES: { id: WeeklyPrepTime; name: string; description: string; icon: string }[] = [
  { id: '30 min', name: '30 minutes', description: 'Quick prep session', icon: 'timer-30' },
  { id: '1 hr', name: '1 hour', description: 'Standard prep time', icon: 'timer-1' },
  { id: '2+ hrs', name: '2+ hours', description: 'Extended prep session', icon: 'timer-plus' },
];

export const CookingSkillPreferences: React.FC<Props> = ({ responses, updateResponse }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          How comfortable are you in the kitchen?
        </Text>
        <View style={styles.optionsContainer}>
          {COOKING_SKILL_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.cookingSkill === level.id && styles.selectedCard,
              ]}
              onPress={() => updateResponse('cookingSkill', level.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.cookingSkill === level.id && styles.selectedIconContainer
              ]}>
                <Icon
                  name={level.icon}
                  size={24}
                  color={responses.cookingSkill === level.id ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {level.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {level.description}
                </Text>
              </View>
              {responses.cookingSkill === level.id && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          How much time can you typically spend cooking on a busy weekday?
        </Text>
        <View style={styles.optionsContainer}>
          {COOKING_TIMES.map((time) => (
            <TouchableOpacity
              key={time.id}
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.weekdayCookingTime === time.id && styles.selectedCard,
              ]}
              onPress={() => updateResponse('weekdayCookingTime', time.id)}
            >
              <View style={[
                styles.iconContainer,
                responses.weekdayCookingTime === time.id && styles.selectedIconContainer
              ]}>
                <Icon
                  name={time.icon}
                  size={24}
                  color={responses.weekdayCookingTime === time.id ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  {time.name}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  {time.description}
                </Text>
              </View>
              {responses.weekdayCookingTime === time.id && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
          Do you want to batch cook or prep ahead on weekends?
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.wantsBatchCooking && styles.selectedCard,
            ]}
            onPress={() => updateResponse('wantsBatchCooking', true)}
          >
            <View style={[
              styles.iconContainer,
              responses.wantsBatchCooking && styles.selectedIconContainer
            ]}>
              <Icon
                name="calendar-check"
                size={24}
                color={responses.wantsBatchCooking ? '#FFFFFF' : '#5DB075'}
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
                I want to prep meals in advance
              </Text>
            </View>
            {responses.wantsBatchCooking && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.wantsBatchCooking === false && styles.selectedCard,
            ]}
            onPress={() => updateResponse('wantsBatchCooking', false)}
          >
            <View style={[
              styles.iconContainer,
              responses.wantsBatchCooking === false && styles.selectedIconContainer
            ]}>
              <Icon
                name="calendar-remove"
                size={24}
                color={responses.wantsBatchCooking === false ? '#FFFFFF' : '#5DB075'}
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
                I prefer to cook fresh each time
              </Text>
            </View>
            {responses.wantsBatchCooking === false && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>

        {responses.wantsBatchCooking && (
          <View style={styles.subSection}>
            <Text style={[styles.subQuestionText, isDarkMode && styles.textLight]}>
              How much time could you spend prepping weekly?
            </Text>
            <View style={styles.optionsContainer}>
              {PREP_TIMES.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.optionCard,
                    isDarkMode && styles.optionCardDark,
                    responses.weeklyPrepTime === time.id && styles.selectedCard,
                  ]}
                  onPress={() => updateResponse('weeklyPrepTime', time.id)}
                >
                  <View style={[
                    styles.iconContainer,
                    responses.weeklyPrepTime === time.id && styles.selectedIconContainer
                  ]}>
                    <Icon
                      name={time.icon}
                      size={24}
                      color={responses.weeklyPrepTime === time.id ? '#FFFFFF' : '#5DB075'}
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[
                      styles.optionName,
                      isDarkMode && styles.textLight
                    ]}>
                      {time.name}
                    </Text>
                    <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                      {time.description}
                    </Text>
                  </View>
                  {responses.weeklyPrepTime === time.id && (
                    <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  subSection: {
    marginTop: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  subQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
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
