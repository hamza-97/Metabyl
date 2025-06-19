import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, useColorScheme, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const cleanAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const cleanDefinitions = [
    { letter: 'C', definition: 'Clear of additives/preservatives' },
    { letter: 'L', definition: 'Low glycemic index' },
    { letter: 'E', definition: 'Eclectic (flexible)' },
    { letter: 'A', definition: 'Anti-inflammatory' },
    { letter: 'N', definition: 'Non-processed' },
  ];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();

    const definitionDelay = 600; 
    cleanAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 500 + (index * definitionDelay)); 
    });
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, progressAnim, cleanAnimations]);

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.logoContainer}>
        <Image source={require("../../../assets/img/logo.png")} style={styles.logoStyle} />
      </View>
      
      <Animated.View
        style={[
          styles.loadingSection,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
            C.L.E.A.N. Eating Lifestyle...
          </Text>
          
          {/* CLEAN Definitions */}
          <View style={styles.definitionsContainer}>
            {cleanDefinitions.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.definitionItem,
                  {
                    opacity: cleanAnimations[index],
                    transform: [
                      {
                        translateY: cleanAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.definitionLetter, isDarkMode && styles.definitionLetterDark]}>
                  {item.letter}
                </Text>
                <Text style={[styles.definitionText, isDarkMode && styles.definitionTextDark]}>
                  {item.definition}
                </Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoStyle: {
    width: 240,
    height: 240,
    borderRadius: 60,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  forkShape: {
    width: 40,
    height: 70,
    backgroundColor: '#333333',
    borderRadius: 10,
    position: 'absolute',
    right: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    letterSpacing: 2,
  },
  loadingSection: {
    alignItems: 'center',
  },
  loadingContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: "grey",
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: "#5DB075",
    borderRadius: 4,
  },
  loadingText: {
    color: "black",
    textAlign: 'center',
    marginBottom: 20,
    fontSize:18,
    fontStyle:'italic'
  },
  loadingTextDark: {
    color: "white",
  },
  definitionsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  definitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  definitionLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5DB075',
    width: 25,
    textAlign: 'center',
  },
  definitionLetterDark: {
    color: '#5DB075',
  },
  definitionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  definitionTextDark: {
    color: '#FFFFFF',
  },
});

export default SplashScreen;
