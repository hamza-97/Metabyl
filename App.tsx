/**
 * Metabyl App
 */
import 'react-native-gesture-handler';
import { enableLayoutAnimations } from 'react-native-reanimated';
enableLayoutAnimations(true);

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // 👈 Add this
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/config/firebase';
import IAPService from './src/config/iapService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    AsyncStorage.clear();
    
    // Initialize IAP
    IAPService.initialize().catch((error: any) => {
      console.error('Failed to initialize IAP:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
    </GestureHandlerRootView>
  );
}

export default App;
