import React, { useState } from 'react';
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
import Slider from '@react-native-community/slider';
import { RootStackParamList } from '../../navigation';
import { useQuestionnaireStore } from '../../store/questionnaireStore';

type HouseholdSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HouseholdSetupScreen'
>;

export const HouseholdSetupScreen: React.FC = () => {
  const navigation = useNavigation<HouseholdSetupScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const [adultCount, setAdultCount] = useState(Math.max(1, responses.peopleCount - responses.childrenCount));
  const [childrenCount, setChildrenCount] = useState(responses.childrenCount || 0);

  const handleContinue = () => {
    const totalPeople = adultCount + childrenCount;
    const hasChildren = childrenCount > 0;
    
    setResponses({
      ...responses,
      peopleCount: totalPeople,
      hasChildren,
      childrenCount
    });
    
    navigation.navigate('DietaryPreferencesScreen');
  };

  const getAdultLabel = (count: number) => {
    if (count === 1) return '1 Adult';
    return `${count} Adults`;
  };

  const getChildrenLabel = (count: number) => {
    if (count === 0) return 'No Children';
    if (count === 1) return '1 Child';
    return `${count} Children`;
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
            Household Setup
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Tell us about your household size
        </Text>
      </View>

      <View style={styles.content}>
        {/* Adults Slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Icon name="account-group" size={24} color="#5DB075" />
            <Text style={[styles.sliderTitle, isDarkMode && styles.textLight]}>
              {getAdultLabel(adultCount)}
            </Text>
          </View>
          <Text style={[styles.sliderDescription, isDarkMode && styles.textLightSecondary]}>
            Number of adults (18+) in your household
          </Text>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={8}
              step={1}
              value={adultCount}
              onValueChange={setAdultCount}
              minimumTrackTintColor="#5DB075"
              maximumTrackTintColor="#CCCCCC"
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, isDarkMode && styles.textLightSecondary]}>1</Text>
              <Text style={[styles.sliderLabel, isDarkMode && styles.textLightSecondary]}>8</Text>
            </View>
          </View>
        </View>

        {/* Children Slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Icon name="account-child" size={24} color="#5DB075" />
            <Text style={[styles.sliderTitle, isDarkMode && styles.textLight]}>
              {getChildrenLabel(childrenCount)}
            </Text>
          </View>
          <Text style={[styles.sliderDescription, isDarkMode && styles.textLightSecondary]}>
            Number of children (under 18) in your household
          </Text>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={6}
              step={1}
              value={childrenCount}
              onValueChange={setChildrenCount}
              minimumTrackTintColor="#5DB075"
              maximumTrackTintColor="#CCCCCC"
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, isDarkMode && styles.textLightSecondary]}>0</Text>
              <Text style={[styles.sliderLabel, isDarkMode && styles.textLightSecondary]}>6</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Icon name="account-group" size={32} color="#5DB075" />
            <Text style={[styles.summaryTitle, isDarkMode && styles.textLight]}>
              Total Household
            </Text>
            <Text style={[styles.summaryCount, isDarkMode && styles.textLight]}>
              {adultCount + childrenCount} {adultCount + childrenCount === 1 ? 'Person' : 'People'}
            </Text>
            <Text style={[styles.summaryBreakdown, isDarkMode && styles.textLightSecondary]}>
              {adultCount} {adultCount === 1 ? 'Adult' : 'Adults'}
              {childrenCount > 0 && ` • ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`}
            </Text>
          </View>
        </View>
      </View>

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
  sliderSection: {
    marginBottom: 40,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 10,
  },
  sliderDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666666',
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5EF',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 10,
    marginBottom: 5,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5DB075',
    marginBottom: 5,
  },
  summaryBreakdown: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HouseholdSetupScreen; 
