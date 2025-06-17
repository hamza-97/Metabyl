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
import { RootStackParamList } from '../navigation';

type QuestionnaireScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Questionnaire'
>;

const SECTIONS = [
  {
    id: 1,
    title: 'Basic Household Setup',
    subtitle: 'Tell us about your household cooking needs',
    icon: 'home-outline',
  },
  {
    id: 2,
    title: 'Food Preferences & Dietary Needs',
    subtitle: 'Help us understand your dietary restrictions',
    icon: 'food-apple-outline',
  },
  {
    id: 3,
    title: 'Cooking Skill & Prep Preferences',
    subtitle: 'Let us know about your cooking experience',
    icon: 'chef-hat',
  },
  {
    id: 4,
    title: 'Shopping Preferences',
    subtitle: 'Where do you like to shop?',
    icon: 'cart-outline',
  },
  {
    id: 5,
    title: 'Final Personalization',
    subtitle: 'Last few details to perfect your experience',
    icon: 'tune',
  },
];

export const QuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<QuestionnaireScreenNavigationProp>();
  const isDarkMode = useColorScheme() === 'dark';

  const handleGetStarted = () => {
    navigation.navigate('HouseholdSizeScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="clipboard-text-outline" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Quick Setup
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Help us personalize your meal planning experience with a few quick questions
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionsList}>
          {SECTIONS.map((section) => (
            <View key={section.id} style={[styles.sectionCard, isDarkMode && styles.sectionCardDark]}>
              <Icon name={section.icon} size={24} color="#5DB075" />
              <View style={styles.sectionTextContainer}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
                  {section.title}
                </Text>
                <Text style={[styles.sectionSubtitle, isDarkMode && styles.textLightSecondary]}>
                  {section.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
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
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#5DB075',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  sectionsList: {
    gap: 15,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  sectionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
  },
  getStartedButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  backButton: {
    backgroundColor: '#F5F5F5',
  },
  continueButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  backButtonText: {
    color: '#5DB075',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
