import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

export default function SearchBar({ value, onChangeText, placeholder = "Rechercher..." }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.text} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.text}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
});
