/**
 * Metabyl App
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import Navigation from './src/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
    </>
  );
}

export default App;
