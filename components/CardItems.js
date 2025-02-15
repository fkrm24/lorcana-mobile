import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

export default function CardItem({ card, onPress }) {
  const imageUrl = card.thumbnail || card.image || card.image_url || card.imageUrl || card.img_url;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="contain"
          onError={(error) => {
            console.error('CardItem - Image loading error:', {
              error,
              imageUrl,
              cardId: card.id,
              cardName: card.name
            });
          }}
        />
        {card.foil_quantity > 0 && (
          <LottieView
            source={require('../assets/animations/magic-sparkles.json')}
            autoPlay
            loop
            style={styles.sparkleAnimation}
          />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.rarity}>{card.rarity}</Text>
        <View style={styles.quantity}>
          <MaterialIcons name="star" size={20} color={Colors.secondary} />
          <Text style={styles.quantityText}>{card.normal_quantity}</Text>
          <MaterialIcons name="star-border" size={20} color={Colors.secondary} />
          <Text style={styles.quantityText}>{card.foil_quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
    overflow: 'hidden'
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 8
  },
  sparkleAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  info: {
    flex: 1,
    justifyContent: 'space-between'
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'MagicFont'
  },
  rarity: {
    color: Colors.secondary,
    fontSize: 14
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  quantityText: {
    color: Colors.text,
    marginRight: 10
  }
});