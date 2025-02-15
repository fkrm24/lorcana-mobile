import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChapterDetail() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chapter Details for ID: {id}</Text>
    </View>
  );
}