import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Colors } from '../utils/colors';
import MagicButton from '../components/MagicButton';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 30;
const CARD_ASPECT_RATIO = 1.4;

export default function Profile() {
  const router = useRouter();
  const { userToken, user, logout } = useContext(AuthContext);
  const [userCards, setUserCards] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showingCollection, setShowingCollection] = useState(false);
  const [showingWishlist, setShowingWishlist] = useState(false);

  const loadUserData = async () => {
    try {
      console.log('Recharging user data...');
      // Charger les cartes de l'utilisateur
      const cardsResponse = await api.getUserCards(userToken);
      console.log('Raw API response:', cardsResponse);

      if (cardsResponse?.data) {
        console.log('Raw user cards data:', cardsResponse.data);
        
        // Charger les détails complets pour chaque carte
        const processedCards = await Promise.all(cardsResponse.data.map(async (userCard) => {
          try {
            // Récupérer les détails complets de la carte
            const cardDetails = await api.request('GET', `cards/${userCard.id}`, null, userToken);
            
            // S'assurer que nous utilisons les quantités de userCard, pas de cardDetails
            const normal = parseInt(userCard.normal_quantity || 0);
            const foil = parseInt(userCard.foil_quantity || 0);
            
            console.log(`Card ${userCard.id} processing:`, {
              id: userCard.id,
              userCardNormal: userCard.normal_quantity,
              userCardFoil: userCard.foil_quantity,
              processedNormal: normal,
              processedFoil: foil,
              name: cardDetails.data.name
            });
            
            // Créer un nouvel objet avec les détails de la carte mais en conservant les quantités de l'utilisateur
            const processedCard = {
              ...cardDetails.data,
              normal,
              foil
            };
            
            console.log(`Card ${userCard.id} final result:`, {
              id: processedCard.id,
              name: processedCard.name,
              normal: processedCard.normal,
              foil: processedCard.foil
            });
            
            return processedCard;
          } catch (error) {
            console.error(`Error loading details for card ${userCard.id}:`, error);
            // En cas d'erreur, au moins conserver les quantités correctes
            return {
              ...userCard,
              normal: parseInt(userCard.normal_quantity || 0),
              foil: parseInt(userCard.foil_quantity || 0)
            };
          }
        }));

        console.log('Final processed cards:', 
          processedCards.map(card => ({
            id: card.id,
            name: card.name,
            normal: card.normal,
            foil: card.foil
          })));
        
        setUserCards(processedCards);
      }

      // Charger la wishlist
      const wishlistResponse = await api.getWishlist(userToken);
      setWishlist(wishlistResponse?.data || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Utiliser useFocusEffect pour recharger les données chaque fois que la page devient active
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [userToken])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderCard = (card) => {
    console.log('Rendering card:', card.id, 'Normal:', card.normal, 'Foil:', card.foil);
    return (
      <TouchableOpacity 
        key={card.id} 
        style={styles.cardItem}
        onPress={() => {
          console.log('Navigating to card with counts:', {
            id: card.id,
            normal: card.normal,
            foil: card.foil
          });
          router.push({
            pathname: `/card/${card.id}`,
            params: {
              normal: card.normal,
              foil: card.foil
            }
          });
        }}
      >
        <Image
          source={{ uri: card.image || card.image_url || card.imageUrl || card.img_url }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardName} numberOfLines={2}>
            {card.name}
          </Text>
          <Text style={styles.cardCount}>
            Standard: {card.normal} · Brillante: {card.foil}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Profil</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.statsCard}
          onPress={() => setShowingCollection(!showingCollection)}
        >
          <View style={styles.statsContent}>
            <Ionicons name="albums" size={32} color={Colors.primary} />
            <View style={styles.statsText}>
              <Text style={styles.statsTitle}>Ma Collection</Text>
              <Text style={styles.statsValue}>{userCards.length} cartes</Text>
            </View>
            <Ionicons 
              name={showingCollection ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={Colors.primary} 
            />
          </View>
        </TouchableOpacity>

        {showingCollection && userCards.length > 0 && (
          <View style={styles.cardsGrid}>
            {userCards.map(renderCard)}
          </View>
        )}

        <TouchableOpacity 
          style={styles.statsCard}
          onPress={() => setShowingWishlist(!showingWishlist)}
        >
          <View style={styles.statsContent}>
            <Ionicons name="heart" size={32} color={Colors.primary} />
            <View style={styles.statsText}>
              <Text style={styles.statsTitle}>Ma Wishlist</Text>
              <Text style={styles.statsValue}>{wishlist.length} cartes</Text>
            </View>
            <Ionicons 
              name={showingWishlist ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={Colors.primary} 
            />
          </View>
        </TouchableOpacity>

        {showingWishlist && wishlist.length > 0 && (
          <View style={styles.cardsGrid}>
            {wishlist.map(renderCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    marginLeft: 15,
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    flex: 1,
    marginLeft: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statsValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardItem: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * CARD_ASPECT_RATIO,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.cardBg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  cardName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardCount: {
    color: Colors.white,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
