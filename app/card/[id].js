import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import MagicButton from '../../components/MagicButton';

export default function CardDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const { userToken } = useContext(AuthContext);
  const [card, setCard] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [ownedCards, setOwnedCards] = useState({ 
    normal: parseInt(params.normal) || 0, 
    foil: parseInt(params.foil) || 0 
  });

  console.log('Card Detail - Initial params:', params);
  console.log('Card Detail - Initial ownedCards:', ownedCards);

  const loadCardCounts = async () => {
    try {
      const userCardsResponse = await api.getUserCards(userToken);
      console.log('User cards response:', userCardsResponse);
      const userCard = userCardsResponse?.data?.find(c => c.id === id);
      console.log('Found user card:', userCard);
      
      if (userCard) {
        const counts = {
          normal: parseInt(userCard.normal || 0),
          foil: parseInt(userCard.foil || 0)
        };
        console.log('Setting new counts:', counts);
        setOwnedCards(counts);
      }
    } catch (error) {
      console.error('Error loading card counts:', error);
    }
  };

  useEffect(() => {
    const loadCardDetails = async () => {
      try {
        // Charger les détails de la carte
        const response = await api.request('GET', `cards/${id}`, null, userToken);
        setCard(response.data);
        
        // Vérifier si la carte est dans la wishlist
        const wishlistResponse = await api.getWishlist(userToken);
        setIsInWishlist(wishlistResponse.data.some(item => item.id === id));

        // Charger les compteurs
        await loadCardCounts();
      } catch (error) {
        console.error('Error loading card details:', error);
      }
    };

    loadCardDetails();
  }, [id, userToken]);

  const handleAddToCollection = async (isShiny) => {
    try {
      console.log('Current ownedCards before update:', ownedCards);
      
      const newCount = isShiny ? 
        { normal: ownedCards.normal, foil: ownedCards.foil + 1 } :
        { normal: ownedCards.normal + 1, foil: ownedCards.foil };

      console.log('Sending update to API:', {
        cardId: id,
        currentCounts: ownedCards,
        newCounts: newCount,
        isShiny
      });
      
      const response = await api.updateOwnedCard(
        id,
        newCount.normal,
        newCount.foil,
        userToken
      );
      
      console.log('API response from updateOwnedCard:', response);
      
      // Recharger les compteurs après la mise à jour
      console.log('Reloading card counts...');
      await loadCardCounts();
      console.log('Updated ownedCards after reload:', ownedCards);
      
      setShowVariantModal(false);
      Alert.alert(
        'Succès',
        'Carte ajoutée à votre collection !',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating back with updated counts:', ownedCards);
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error adding to collection:', error);
      Alert.alert('Erreur lors de l\'ajout à la collection');
    }
  };

  const handleRemoveFromCollection = async (isShiny) => {
    try {
      const newCount = isShiny ? 
        { normal: ownedCards.normal, foil: Math.max(0, ownedCards.foil - 1) } :
        { normal: Math.max(0, ownedCards.normal - 1), foil: ownedCards.foil };

      console.log('Sending update to API:', newCount);
      await api.updateOwnedCard(
        id,
        newCount.normal,
        newCount.foil,
        userToken
      );
      
      // Recharger les compteurs après la mise à jour
      await loadCardCounts();
      
      setShowRemoveModal(false);
      Alert.alert(
        'Succès',
        'Carte retirée de votre collection !',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error removing from collection:', error);
      Alert.alert('Erreur lors du retrait de la collection');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(id, userToken);
      } else {
        await api.addToWishlist(id, userToken);
      }
      setIsInWishlist(!isInWishlist);
      Alert.alert(
        isInWishlist ? 'Carte retirée de la wishlist' : 'Carte ajoutée à la wishlist'
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Erreur lors de la modification de la wishlist');
    }
  };

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{card.name}</Text>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={handleToggleWishlist}
        >
          <Ionicons 
            name={isInWishlist ? "heart" : "heart-outline"} 
            size={24} 
            color={Colors.white} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: card.image || card.image_url || card.imageUrl || card.img_url }}
          style={styles.cardImage}
          resizeMode="contain"
        />

        <View style={styles.cardStats}>
          <Text style={styles.statsText}>
            Standard ({ownedCards.normal}) · Brillante ({ownedCards.foil})
          </Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => setShowRemoveModal(true)}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <MagicButton 
          title="Ajouter à ma collection"
          onPress={() => setShowVariantModal(true)}
          style={styles.addButton}
        />
      </View>

      <Modal
        visible={showVariantModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir la version</Text>
            
            <MagicButton 
              title="Version Standard"
              onPress={() => handleAddToCollection(false)}
              style={styles.variantButton}
            />
            
            <MagicButton 
              title="Version Brillante"
              onPress={() => handleAddToCollection(true)}
              style={styles.variantButton}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowVariantModal(false)}
            >
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Retirer de la collection</Text>
            
            <MagicButton 
              title={`Retirer une carte Standard (${ownedCards.normal})`}
              onPress={() => handleRemoveFromCollection(false)}
              style={[styles.variantButton, styles.removeVariantButton]}
              disabled={ownedCards.normal === 0}
            />
            
            <MagicButton 
              title={`Retirer une carte Brillante (${ownedCards.foil})`}
              onPress={() => handleRemoveFromCollection(true)}
              style={[styles.variantButton, styles.removeVariantButton]}
              disabled={ownedCards.foil === 0}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowRemoveModal(false)}
            >
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  wishlistButton: {
    marginLeft: 15,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    marginBottom: 20,
  },
  addButton: {
    width: '80%',
  },
  loading: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  variantButton: {
    marginBottom: 10,
  },
  closeButton: {
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  cardStats: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  removeVariantButton: {
    backgroundColor: Colors.error,
  },
});