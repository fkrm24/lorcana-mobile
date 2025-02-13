import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../utils/colors';

export default function MagicButton({ title, onPress, isLoading }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={isLoading}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text}>
          {isLoading ? 'Chargement...' : title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  text: {
    color: 'white',
    fontFamily: 'MagicFont',
    fontSize: 18,
    textAlign: 'center'
  }
});