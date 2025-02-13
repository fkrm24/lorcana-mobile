import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      // Vérifier si le token est valide
      await api.getMe(token);
    } catch (error) {
      console.error('Erreur lors du login:', error);
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (userToken) {
        await api.logout(userToken);
      }
    } catch (error) {
      console.error('Erreur lors du logout:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    }
  };

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Vérifier si le token est toujours valide
        try {
          await api.getMe(token);
          setUserToken(token);
        } catch (error) {
          console.error('Token invalide:', error);
          await logout();
        }
      }
    } catch (e) {
      console.error('Erreur lors de la vérification du login:', e);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      login, 
      logout, 
      isLoading,
      isAuthenticated: !!userToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};