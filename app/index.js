import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Colors } from '../utils/colors';
import MagicButton from '../components/MagicButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';



export default function Index() {

  const router = useRouter();
  const { userToken } = useContext(AuthContext);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSets, setAllSets] = useState([]);

  useEffect(() => {
    const fetchSets = async () => {
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching sets with token:', userToken);
        const response = await api.getSets(userToken);
        console.log('Sets response:', response);
        const setsData = response?.data || [];
        setAllSets(setsData);
        setSets(setsData);
      } catch (error) {
        console.error('Error fetching sets:', error);
        if (error.message.includes('Unauthenticated')) {
          // Si non authentifié, on peut rediriger vers la page de login
          router.replace('/(auth)/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [userToken, router]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSets(allSets);
      return;
    }

    const filteredSets = allSets.filter(set => 
      set.name.toLowerCase().includes(text.toLowerCase()) ||
      set.description?.toLowerCase().includes(text.toLowerCase())
    );
    setSets(filteredSets);
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToSet = (setId) => {
    router.push(`/set/${setId}`);
  };

  const navigateToAllCards = () => {
    router.push('/cardList');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Disney Lorcana</Text>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={navigateToProfile}
          >
            <Ionicons name="person-circle" size={32} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Rechercher un chapitre..."
          />
        </View>
        <Text style={styles.subtitle}>Le Jeu de Cartes à Collectionner</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <MagicButton
            title="Voir toutes les cartes"
            onPress={navigateToAllCards}
            style={styles.allCardsButton}
          />

          <Text style={styles.sectionTitle}>Chapitres disponibles</Text>
          
          {sets.map((set) => (
            <TouchableOpacity
              key={set.id}
              style={styles.setCard}
              onPress={() => navigateToSet(set.id)}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.setGradient}
              >
                <View style={styles.setContent}>
                  <Text style={styles.setName}>{set.name}</Text>
                  <Text style={styles.setDate}>
                    {new Date(set.release_date).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={Colors.white} 
                  style={styles.setIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.84,
    elevation: 5,
  },
  headerContent: {
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  allCardsButton: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  setCard: {
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  setContent: {
    flex: 1,
  },
  setName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  setDate: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  setIcon: {
    marginLeft: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
