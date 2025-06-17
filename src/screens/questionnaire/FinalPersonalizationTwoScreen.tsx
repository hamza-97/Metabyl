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
import { WeekDay } from '../../types/questionnaire';

type FinalPersonalizationTwoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FinalPersonalizationTwoScreen'
>;

const WEEK_DAYS: { id: WeekDay; name: string }[] = [
  { id: 'Monday', name: 'Monday' },
  { id: 'Tuesday', name: 'Tuesday' },
  { id: 'Wednesday', name: 'Wednesday' },
  { id: 'Thursday', name: 'Thursday' },
  { id: 'Friday', name: 'Friday' },
  { id: 'Saturday', name: 'Saturday' },
  { id: 'Sunday', name: 'Sunday' },
];

export const FinalPersonalizationTwoScreen: React.FC = () => {
  const navigation = useNavigation<FinalPersonalizationTwoScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const updateResponse = (key: keyof typeof responses, value: any) => {
    setResponses({
      ...responses,
      [key]: value
    });
  };

  const toggleGrillingDay = (day: WeekDay) => {
    const currentDays = responses.grillingDays;
    if (currentDays.includes(day)) {
      setResponses({
        ...responses,
        grillingDays: currentDays.filter((d: WeekDay) => d !== day)
      });
    } else {
      setResponses({
        ...responses,
        grillingDays: [...currentDays, day]
      });
    }
  };

  const handleComplete = () => {
    // Here you would typically save the responses to your backend
    console.log('Questionnaire completed:', responses);
    navigation.navigate('PaywallScreen');
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
          <Icon name="tune" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Final Setup
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Last few preferences to complete your setup
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                  name="auto-fix"
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
                  Generate complete meal plans automatically
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
                responses.wantsAutomaticMenus === false && styles.selectedCard,
              ]}
              onPress={() => updateResponse('wantsAutomaticMenus', false)}
            >
              <View style={[
                styles.iconContainer,
                responses.wantsAutomaticMenus === false && styles.selectedIconContainer
              ]}>
                <Icon
                  name="eye"
                  size={24}
                  color={responses.wantsAutomaticMenus === false ? '#FFFFFF' : '#5DB075'}
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
                  Review and adjust plans before starting
                </Text>
              </View>
              {responses.wantsAutomaticMenus === false && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            Would you like us to send you a batch prep plan and shopping list each week?
          </Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.wantsWeeklyPlan && styles.selectedCard,
              ]}
              onPress={() => updateResponse('wantsWeeklyPlan', true)}
            >
              <View style={[
                styles.iconContainer,
                responses.wantsWeeklyPlan && styles.selectedIconContainer
              ]}>
                <Icon
                  name="calendar-check"
                  size={24}
                  color={responses.wantsWeeklyPlan ? '#FFFFFF' : '#5DB075'}
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
                  Send me weekly prep plans and shopping lists
                </Text>
              </View>
              {responses.wantsWeeklyPlan && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.wantsWeeklyPlan === false && styles.selectedCard,
              ]}
              onPress={() => updateResponse('wantsWeeklyPlan', false)}
            >
              <View style={[
                styles.iconContainer,
                responses.wantsWeeklyPlan === false && styles.selectedIconContainer
              ]}>
                <Icon
                  name="calendar-remove"
                  size={24}
                  color={responses.wantsWeeklyPlan === false ? '#FFFFFF' : '#5DB075'}
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
                  I'll manage my own planning
                </Text>
              </View>
              {responses.wantsWeeklyPlan === false && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
            Would you like Metabyl to occasionally include recipes optimized for grilling or smoking?
          </Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.includeGrillingSmoking && styles.selectedCard,
              ]}
              onPress={() => updateResponse('includeGrillingSmoking', true)}
            >
              <View style={[
                styles.iconContainer,
                responses.includeGrillingSmoking && styles.selectedIconContainer
              ]}>
                <Icon
                  name="grill"
                  size={24}
                  color={responses.includeGrillingSmoking ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  ✅ Yes, include grilling/smoking recipes when appropriate
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  Add outdoor cooking variety to my meal plans
                </Text>
              </View>
              {responses.includeGrillingSmoking && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                isDarkMode && styles.optionCardDark,
                responses.includeGrillingSmoking === false && styles.selectedCard,
              ]}
              onPress={() => updateResponse('includeGrillingSmoking', false)}
            >
              <View style={[
                styles.iconContainer,
                responses.includeGrillingSmoking === false && styles.selectedIconContainer
              ]}>
                <Icon
                  name="stove"
                  size={24}
                  color={responses.includeGrillingSmoking === false ? '#FFFFFF' : '#5DB075'}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionName,
                  isDarkMode && styles.textLight
                ]}>
                  🚫 No, stick to standard cooking methods
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                  Keep recipes focused on indoor cooking
                </Text>
              </View>
              {responses.includeGrillingSmoking === false && (
                <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {responses.includeGrillingSmoking && (
          <View style={styles.section}>
            <Text style={[styles.questionText, isDarkMode && styles.textLight]}>
              Are there specific days of the week you typically grill or smoke meals?
            </Text>
            <View style={styles.optionsContainer}>
              {WEEK_DAYS.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.optionCard,
                    isDarkMode && styles.optionCardDark,
                    responses.grillingDays.includes(day.id) && styles.selectedCard,
                  ]}
                  onPress={() => toggleGrillingDay(day.id)}
                >
                  <View style={[
                    styles.iconContainer,
                    responses.grillingDays.includes(day.id) && styles.selectedIconContainer
                  ]}>
                    <Icon
                      name="calendar"
                      size={24}
                      color={responses.grillingDays.includes(day.id) ? '#FFFFFF' : '#5DB075'}
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[
                      styles.optionName,
                      isDarkMode && styles.textLight
                    ]}>
                      {day.name}
                    </Text>
                  </View>
                  {responses.grillingDays.includes(day.id) && (
                    <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  isDarkMode && styles.optionCardDark,
                  responses.grillingDays.length === 0 && styles.selectedCard,
                ]}
                onPress={() => setResponses({ ...responses, grillingDays: [] })}
              >
                <View style={[
                  styles.iconContainer,
                  responses.grillingDays.length === 0 && styles.selectedIconContainer
                ]}>
                  <Icon
                    name="calendar-question"
                    size={24}
                    color={responses.grillingDays.length === 0 ? '#FFFFFF' : '#5DB075'}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionName,
                    isDarkMode && styles.textLight
                  ]}>
                    No specific days — suggest anytime
                  </Text>
                  <Text style={[styles.optionDescription, isDarkMode && styles.textLightSecondary]}>
                    Let Metabyl suggest grilling days based on weather and meals
                  </Text>
                </View>
                {responses.grillingDays.length === 0 && (
                  <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>Complete Setup</Text>
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
  section: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    lineHeight: 26,
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
  completeButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 
