import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export const NumberSelector: React.FC<Props> = ({
  value,
  onChange,
  min,
  max,
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={decrement}
        style={[styles.button, value <= min && styles.buttonDisabled]}
        disabled={value <= min}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      
      <Text style={styles.value}>{value}</Text>
      
      <TouchableOpacity
        onPress={increment}
        style={[styles.button, value >= max && styles.buttonDisabled]}
        disabled={value >= max}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
}); 
