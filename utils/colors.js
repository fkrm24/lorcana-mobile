export const Colors = {
  // Couleurs de base
  background: '#FFFFFF',  // Blanc pur
  white: '#FFFFFF',
  black: '#333333',
  
  // Palette de bleu clair et violet pastel
  primary: '#6A9EF3',     // Bleu clair vif
  primaryLight: '#A5C4F7', // Bleu clair plus pastel
  primaryDark: '#4A7FD1',  // Bleu clair foncé
  
  secondary: '#B084C6',   // Violet pastel
  secondaryLight: '#D1B0E1', // Violet pastel plus clair
  secondaryDark: '#8C6CA9', // Violet pastel foncé
  
  // Nuances de gris pour le texte et les bordures
  text: '#333333',        // Gris foncé pour le texte principal
  textLight: '#666666',   // Gris moyen
  textMuted: '#999999',   // Gris clair
  
  // Couleurs d'état
  success: '#4CAF50',     // Vert pour les succès
  error: '#F44336',       // Rouge pour les erreurs
  warning: '#FF9800',     // Orange pour les avertissements
  
  // Couleurs de fond et de carte
  cardBg: '#F5F5FA',      // Fond de carte très clair avec une teinte de bleu
  overlay: 'rgba(106, 158, 243, 0.1)', // Overlay bleu très transparent
  
  // Bordures et séparateurs
  border: '#E0E0E6',      // Bordure claire avec une teinte de bleu
  
  // Icônes et accents
  icon: '#6A9EF3',        // Couleur d'icône basée sur le bleu clair
  accent: '#B084C6'       // Couleur d'accent basée sur le violet pastel
};

// Styles de thème global
export const GlobalStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Style de texte
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 12,
  },
  
  // Boutons
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Cartes
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
};