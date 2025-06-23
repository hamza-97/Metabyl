/**
 * Metabyl App
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/config/firebase';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(()=>{
    AsyncStorage.clear()
  },[])

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
    </>
  );
}

export default App;
