# Lorcana Mobile

Une application mobile pour gérer votre collection de cartes Lorcana Disney. Cette application vous permet de suivre vos cartes, gérer votre collection et visualiser les cartes en version normale et foil.

## 🚀 Configuration requise

- Node.js (version recommandée : 18.x ou supérieure)
- npm ou yarn
- iOS Simulator (pour le développement iOS)
- Android Studio et Android SDK (pour le développement Android)
- Expo CLI

## 📱 Technologies utilisées

- React Native avec Expo
- Expo Router pour la navigation
- React Native Paper pour les composants UI
- Async Storage pour le stockage local
- Axios pour les requêtes API

## 🛠 Installation

1. Clonez le repository :
```bash
git clone [votre-repo-url]
cd lorcana-mobile
```

2. Installez les dépendances :
```bash
npm install
```



## 🎮 Lancement de l'application

Pour démarrer l'application  :

```bash
# Démarrer l'application
npx expo start


## 📁 Structure du projet

```
lorcana-mobile/
├── app/                    # Routes et navigation (Expo Router)
│   ├── (auth)/            # Routes d'authentification
│   └── (tabs)/             # Routes principales de l'application
    └── (cards)/            #Route pour les cartes
    └── (set)/              #Route pour les chapitres
├── assets/                 # Ressources statiques
│   ├── animations/        # Animations Lottie
│   ├── fonts/            # Polices personnalisées
│   └── images/           # Images
├── components/            # Composants réutilisables
├── contexts/             # Contextes React (AuthContext, etc.)
├── services/             # Services (API, etc.)
└── utils/                # Utilitaires et constantes
```

## 🔐 Fonctionnalités

- Authentification utilisateur (connexion/inscription)
- Gestion de la collection de cartes
- Visualisation des cartes avec effets spéciaux pour les versions foil
- Interface utilisateur intuitive et responsive
- Animations fluides pour une meilleure expérience utilisateur

## 📱 Navigation

L'application utilise Expo Router pour la navigation, avec deux layouts principaux :
- Layout d'authentification : `/app/(auth)/*`
- Layout principal de l'application : `/app/(app)/*`

## 🎨 Personnalisation

Les couleurs et thèmes peuvent être modifiés dans le fichier `/utils/colors.js`.

##Login 
Etant donnee que nous ne pouvions paa nous register avec L'api : https://lorcana.brybry.fr/api/ 
Arrivee sur la page register appuiyer sur vous avez deja un compte et connectez vous avec l'identifiant : fatime.kerim@epfedu.fr 
mdp :6HAEtlv



