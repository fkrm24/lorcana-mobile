import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Colors } from '../../utils/colors';
import MagicButton from '../../components/MagicButton';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Tentative de connexion avec:', { email, password });
      const response = await api.login(email, password);
      console.log('Réponse de login:', response);
      if (response && response.token) {
        await login(response.token);
        router.replace('/');  // Redirection vers la page principale
      } else {
        alert('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue à Lorcana</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.text}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        placeholderTextColor={Colors.text}
        value={password}
        onChangeText={setPassword}
      />
      <MagicButton 
        title="Se connecter" 
        onPress={handleLogin} 
        isLoading={isLoading}
      />

      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => router.replace('/register')}
      >
        <Text style={styles.registerText}>
          Vous n'avez pas encore de compte ? Inscrivez-vous
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    color: Colors.secondary,
    fontFamily: 'MagicFont',
    textAlign: 'center',
    marginBottom: 40
  },
  input: {
    backgroundColor: Colors.cardBg,
    color: Colors.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: Colors.secondary,
    fontSize: 16,
    textAlign: 'center',
  }
});