import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';

const { width, height } = Dimensions.get('window');

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Plan Your Meals',
    description: 'Get AI-powered meal plans tailored to your preferences and dietary needs.',
    icon: 'calendar-text',
  },
  {
    id: '2',
    title: 'Discover Recipes',
    description: 'Browse through a variety of delicious recipes that match your taste.',
    icon: 'food-variant',
  },
  {
    id: '3',
    title: 'Smart Shopping List',
    description: 'Automatically generate shopping lists from your selected recipes.',
    icon: 'cart-outline',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };
  
  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
    }
  });

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={120} color="#5DB075" />
        </View>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>{item.title}</Text>
        <Text style={[styles.description, isDarkMode && styles.textLight]}>
          {item.description}
        </Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#5DB075' : '#CCCCCC' },
            ]}
          />
        ))}
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to questionnaire screen
      navigation.navigate('Questionnaire');
    }
  };

  const handleSkip = () => {
    navigation.navigate('DietaryPreferences');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, isDarkMode && styles.textLight]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
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
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#5DB075',
    fontWeight: '600',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: width * 0.6,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 30,
    lineHeight: 26,
  },
  textLight: {
    color: '#FFFFFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 60,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#5DB075',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 
