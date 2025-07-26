import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';

interface Props {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const ImageLoadingPlaceholder: React.FC<Props> = ({ 
  size = 'medium', 
  text = 'Generating image...' 
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60 };
      case 'large':
        return { width: 200, height: 150 };
      default:
        return { width: 120, height: 90 };
    }
  };
  
  const sizeStyle = getSize();
  
  return (
    <View style={[
      styles.container, 
      sizeStyle, 
      isDarkMode && styles.containerDark
    ]}>
      <ActivityIndicator 
        size="small" 
        color={isDarkMode ? '#5DB075' : '#5DB075'} 
      />
      <Text style={[
        styles.text, 
        isDarkMode && styles.textDark
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: 8,
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
  },
  text: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  textDark: {
    color: '#AAAAAA',
  },
});

export default ImageLoadingPlaceholder; 
