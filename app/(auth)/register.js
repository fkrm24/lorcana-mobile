import React, { useState } from 'react';
import { TextInput, Button, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://lorcana.brybry.fr/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      console.log(response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erreur :', error.response.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F0F2', // Couleur douce de fond
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4A90E2', // Couleur inspirée de Lorcana/Disney
  },
  input: {
    height: 40,
    borderColor: '#4A90E2',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default RegisterScreen;
