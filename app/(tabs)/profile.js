import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import MagicButton from '../../components/MagicButton';
import { Colors } from '../../utils/colors';

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <View style={styles.content}>
        <MagicButton 
          title="Se déconnecter" 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: Colors.secondary,
    fontFamily: 'MagicFont',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
  },
});