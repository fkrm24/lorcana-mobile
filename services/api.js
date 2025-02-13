import { API_URL } from '@env';

console.log('API_URL from env:', API_URL); // Log l'URL de base

export const api = {
  async request(method, endpoint, body = null, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',  // Ajout de l'en-tête Accept
        ...(token && { Authorization: `Bearer ${token}` })
      };

      // Nettoyer l'URL de base et l'endpoint pour éviter les doubles slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${baseUrl}${cleanEndpoint}`;
      
      console.log('Full request details:', {
        url,
        method,
        headers,
        body
      });

      const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) })
      };

      const response = await fetch(url, options);
      console.log('Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error.message);
      throw error;
    }
  },

  // Inscription utilisateur
  register: async (name, email, password, password_confirmation) => {
    return api.request('POST', 'register', {
      name,
      email,
      password,
      password_confirmation
    });
  },

  // Connexion utilisateur
  login: async (email, password) => {
    return api.request('POST', 'login', { email, password });
  },

  // Déconnexion utilisateur
  logout: async (token) => {
    return api.request('POST', 'logout', null, token);
  },

  // Informations utilisateur
  getMe: async (token) => {
    return api.request('GET', 'me', null, token);
  },

  // Cartes de l'utilisateur
  getUserCards: async (token) => {
    try {
      console.log('getUserCards - Starting request...');
      const response = await api.request('GET', 'me/cards', null, token);
      
      console.log('getUserCards - Raw response:', response);
      
      if (response?.data) {
        // Vérifier le format des données reçues
        const cardCounts = response.data.map(card => ({
          id: card.id,
          normal: typeof card.normal === 'number' ? card.normal : parseInt(card.normal || 0),
          foil: typeof card.foil === 'number' ? card.foil : parseInt(card.foil || 0)
        }));
        
        console.log('getUserCards - Processed card counts:', cardCounts);
      }
      
      return response;
    } catch (error) {
      console.error('Error in getUserCards:', error);
      throw error;
    }
  },

  // Mise à jour des cartes possédées
  updateOwnedCard: async (cardId, normalCount, foilCount, token) => {
    try {
      console.log('updateOwnedCard - Starting update:', { 
        cardId, 
        normalCount: typeof normalCount === 'number' ? normalCount : parseInt(normalCount || 0),
        foilCount: typeof foilCount === 'number' ? foilCount : parseInt(foilCount || 0)
      });

      // S'assurer que les compteurs sont des nombres
      const normal = typeof normalCount === 'number' ? normalCount : parseInt(normalCount || 0);
      const foil = typeof foilCount === 'number' ? foilCount : parseInt(foilCount || 0);

      const payload = {
        normal,
        foil
      };

      console.log('updateOwnedCard - Sending payload:', payload);

      const response = await api.request(
        'POST',
        `me/${cardId}/update-owned`,
        payload,
        token
      );

      console.log('updateOwnedCard - Received response:', response);

      // Vérifier la réponse
      if (response?.data) {
        console.log('updateOwnedCard - Updated quantities:', {
          cardId,
          normal: response.data.normal,
          foil: response.data.foil
        });
      }

      return response;
    } catch (error) {
      console.error('Error in updateOwnedCard:', error);
      throw error;
    }
  },

  // Liste des ensembles
  getSets: async (token) => {
    if (!token) {
      throw new Error('Token requis pour récupérer les sets');
    }
    try {
      console.log('Fetching sets with token:', token);
      const response = await api.request('GET', 'sets', null, token);
      console.log('Sets response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw error;
    }
  },

  // Détails d'un ensemble
  getSet: async (setId, token) => {
    return api.request('GET', `sets/${setId}`, null, token);
  },

  // Cartes d'un ensemble
  getSetCards: async (setId, token) => {
    return api.request('GET', `sets/${setId}/cards`, null, token);
  },

  // Toutes les cartes
  getAllCards: async (token) => {
    return api.request('GET', 'me/cards', null, token);
  },

  // Cartes dans la wishlist
  getWishlist: async (token) => {
    return api.request('GET', 'wishlist', null, token);
  },

  // Ajouter une carte à la wishlist
  addToWishlist: async (cardId, token) => {
    return api.request('POST', 'wishlist/add', { card_id: cardId }, token);
  },

  // Retirer une carte de la wishlist
  removeFromWishlist: async (cardId, token) => {
    return api.request('POST', 'wishlist/remove', { card_id: cardId }, token);
  }
};