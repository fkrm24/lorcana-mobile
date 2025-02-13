import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { Colors } from '../../../utils/colors';
import LoadingOverlay from '../../../components/LoadingOverlay';

export default function Chapters() {
  const { userToken } = useContext(AuthContext);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        const data = await api.getSets(userToken);
        setSets(data);
      } catch (error) {
        alert('Erreur de chargement');
      }
      setLoading(false);
    };
    loadSets();
  }, []);

  if (loading) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapitres Lorcana</Text>
      <FlatList
        data={sets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.chapterCard}>
            <Text style={styles.chapterTitle}>{item.name}</Text>
            <Text style={styles.chapterInfo}>Sortie: {item.release_date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  title: {
    fontSize: 28,
    color: Colors.primary,
    fontFamily: 'MagicFont',
    marginBottom: 20,
    textAlign: 'center'
  },
  chapterCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15
  },
  chapterTitle: {
    color: Colors.secondary,
    fontSize: 20,
    fontFamily: 'MagicFont'
  },
  chapterInfo: {
    color: Colors.text,
    fontSize: 14
  }
});

