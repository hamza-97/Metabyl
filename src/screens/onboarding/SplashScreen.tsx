import React, { useEffect } from 'react';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.logoContainer}>
        {/* Replace with actual logo when available */}
        <View style={styles.logoCircle}>
          <View style={styles.forkShape} />
        </View>
        <Text style={styles.logoText}>METABYL</Text>
      </View>
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
  logoCircle: {
    width: 120,
    height: 120,
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
});

export default SplashScreen; 
