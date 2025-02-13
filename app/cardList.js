import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Colors } from '../utils/colors';
import MagicButton from '../components/MagicButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 30; // 2 cartes par ligne avec marge
const CARD_ASPECT_RATIO = 1.4; // Ratio hauteur/largeur standard pour les cartes

export default function CardList() {
  const { userToken } = useContext(AuthContext);
  const [sets, setSets] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'owned', 'missing', 'wishlist'
  const [userCards, setUserCards] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  // Filtres disponibles
  const filters = [
    { id: 'all', label: 'Toutes les cartes' },
    { id: 'owned', label: 'Cartes possédées' },
    { id: 'missing', label: 'Cartes manquantes' },
    { id: 'wishlist', label: 'Dans la wishlist' },
  ];

  const fetchAllCards = async () => {
    try {
      setLoading(true);
      
      const setsResponse = await api.getSets(userToken);
      const setsData = setsResponse?.data || [];
      setSets(setsData);

      // Récupérer les cartes de l'utilisateur
      const userCardsResponse = await api.getUserCards(userToken);
      setUserCards(userCardsResponse?.data || []);

      // Récupérer la wishlist
      const wishlistResponse = await api.getWishlist(userToken);
      setWishlist(wishlistResponse?.data || []);

      const allCards = [];
      for (const set of setsData) {
        const setCardsResponse = await api.getSetCards(set.id, userToken);
        const setCards = setCardsResponse?.data || [];
        if (setCards.length > 0) {
          const cardsWithSetInfo = setCards.map(card => ({
            ...card,
            setName: set.name,
            setId: set.id
          }));
          allCards.push(...cardsWithSetInfo);
        }
      }

      allCards.sort((a, b) => {
        if (a.setName !== b.setName) {
          return a.setName.localeCompare(b.setName);
        }
        return a.name.localeCompare(b.name);
      });

      setCards(allCards);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
  }, [userToken]);

  const renderCard = (card) => {
    // Log pour voir la structure complète de la carte
    console.log('Card data:', JSON.stringify(card, null, 2));
    
    return (
      <TouchableOpacity 
        key={card.id} 
        style={styles.cardItem}
        onPress={() => router.push(`/card/${card.id}`)}
      >
        <Image
          source={{ uri: card.image || card.image_url || card.imageUrl || card.img_url }}
          style={styles.cardImage}
          resizeMode="contain"
          onError={(error) => console.log('Image error:', error)}
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardName} numberOfLines={2}>
            {card.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSetSection = (setName, setCards) => (
    <View key={setName} style={styles.setSection}>
      <View style={styles.setHeader}>
        <Text style={styles.setHeaderText}>{setName}</Text>
        <Text style={styles.cardCount}>{setCards.length} cartes</Text>
      </View>
      <View style={styles.cardsGrid}>
        {setCards.map(renderCard)}
      </View>
    </View>
  );

  // Filtrer les cartes en fonction du filtre actif
  const getFilteredCards = () => {
    const userCardIds = new Set(userCards.map(uc => uc.id));
    const wishlistIds = new Set(wishlist.map(w => w.id));

    let filteredCards;
    switch (activeFilter) {
      case 'owned':
        filteredCards = cards.filter(card => userCardIds.has(card.id));
        break;
      case 'missing':
        filteredCards = cards.filter(card => !userCardIds.has(card.id));
        break;
      case 'wishlist':
        filteredCards = cards.filter(card => wishlistIds.has(card.id));
        break;
      default:
        filteredCards = cards;
    }

    const cardsBySet = filteredCards.reduce((acc, card) => {
      if (!acc[card.setName]) {
        acc[card.setName] = [];
      }
      acc[card.setName].push(card);
      return acc;
    }, {});

    return Object.entries(cardsBySet).map(([setName, setCards]) => 
      renderSetSection(setName, setCards)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toutes les Cartes</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.error}>{error}</Text>
          <MagicButton title="Réessayer" onPress={fetchAllCards} />
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
        >
          {cards.length > 0 ? (
            <>
              <Text style={styles.statsText}>
                {cards.length} cartes dans {sets.length} sets
              </Text>

              {/* Menu de filtres */}
              <View style={styles.filterContainer}>
                {filters.map(filter => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[styles.filterButton, activeFilter === filter.id && styles.filterButtonActive]}
                    onPress={() => setActiveFilter(filter.id)}
                  >
                    <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {getFilteredCards()}
            </>
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.message}>Aucune carte disponible</Text>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <MagicButton 
          title="Retour" 
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.white,
  },
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statsText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  setSection: {
    marginBottom: 25,
  },
  setHeader: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setHeaderText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardCount: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  error: {
    color: Colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
