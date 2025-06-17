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

type ChildrenQuestionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChildrenQuestionScreen'
>;

export const ChildrenQuestionScreen: React.FC = () => {
  const navigation = useNavigation<ChildrenQuestionScreenNavigationProp>();
  const { responses, setResponses } = useQuestionnaireStore();
  const isDarkMode = useColorScheme() === 'dark';

  const handleSelection = (hasChildren: boolean) => {
    setResponses({
      ...responses,
      hasChildren
    });
    navigation.navigate('DietaryPreferencesScreen');
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
          <Icon name="account-child" size={32} color="#5DB075" />
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Children
          </Text>
        </View>
        <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
          Are you also planning for children (under 12)?
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.hasChildren === true && styles.selectedCard,
            ]}
            onPress={() => handleSelection(true)}
          >
            <View style={[
              styles.iconContainer,
              responses.hasChildren === true && styles.selectedIconContainer
            ]}>
              <Icon
                name="account-child"
                size={24}
                color={responses.hasChildren === true ? '#FFFFFF' : '#5DB075'}
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
            {responses.hasChildren === true && (
              <Icon name="check-circle" size={24} color="#5DB075" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              isDarkMode && styles.optionCardDark,
              responses.hasChildren === false && styles.selectedCard,
            ]}
            onPress={() => handleSelection(false)}
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
