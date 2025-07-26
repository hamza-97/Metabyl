import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import { CookingSkillLevel, CookingTime, WeeklyPrepTime } from '../../types/questionnaire';
import OnboardingScreenWrapper from '../../components/common/OnboardingScreenWrapper';

type CookingSkillScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CookingSkillScreen'
>;

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
  { id: '30 min', name: '30 minutes', description: 'Quick prep session', icon: 'clock-fast' },
  { id: '1 hr', name: '1 hour', description: 'Standard prep time', icon: 'clock' },
  { id: '2+ hrs', name: '2+ hours', description: 'Extended prep session', icon: 'clock-plus' },
];

export const CookingSkillScreen: React.FC = () => {
  const navigation = useNavigation<CookingSkillScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const updateResponse = (key: keyof typeof responses, value: any) => {
    setResponses({
      ...responses,
      [key]: value
    });
  };

  const handleContinue = () => {
    // navigation.navigate('ShoppingPreferencesScreen');
    navigation.navigate('FinalPersonalizationScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
    <OnboardingScreenWrapper>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#5DB075" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Icon name="chef-hat" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Cooking Skills
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Tell us about your cooking experience and preferences
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        </View>

        {responses.wantsBatchCooking && (
          <View style={styles.section}>
            <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
              How much time would you like to spend on weekly meal prep?
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      </View>
    </OnboardingScreenWrapper>
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
