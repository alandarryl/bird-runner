
Markdown
# 🐦 Bird Runner - React Native Game

Un jeu mobile dynamique développé avec **React Native** et **Expo**. Incarnez un oiseau, évitez les rochers et collectez de la nourriture pour obtenir le meilleur score possible !

## 🚀 Fonctionnalités
- **Gameplay Fluide** : Contrôles tactiles réactifs pour des mouvements horizontaux.
- **Difficulté Progressive** : La vitesse du jeu augmente au fur et à mesure que votre score grimpe.
- **Système de Score** : Enregistrement persistant du meilleur score (High Score) via `AsyncStorage`.
- **Audio Immersif** : Effets sonores pour les collisions, la collecte d'objets et le Game Over.
- **Graphismes Personnalisés** : Utilisation d'assets originaux pour les personnages, obstacles et décors.

## 🛠️ Stack Technique
- **Framework** : React Native (Expo SDK)
- **Navigation** : Expo Router
- **Gestion Audio** : Expo-AV
- **Stockage** : AsyncStorage
- **Langage** : JavaScript / React

## 📦 Installation et Lancement

1. **Cloner le projet**
   ```bash
   git clone [https://github.com/ton-pseudo/bird-runner.git](https://github.com/ton-pseudo/bird-runner.git)
   cd bird-runner
Installer les dépendances

Bash
npm install
Lancer le projet

Bash
npx expo start
🎮 Comment jouer ?
Utilisez les boutons GAUCHE et DROITE pour déplacer l'oiseau.

Évitez les Rochers 🪨 (vous avez 3 vies).

Collectez le Blé 🌾 pour gagner des points bonus (+5).

Tenez le plus longtemps possible pour battre votre record !

🖼️ Assets
Les images et sons sont situés dans le dossier /src/assets.

Oiseau : blue-bird.png

Décor : forest-level.png

Sons : rock-hit.mp3, collect-coin.mp3, game-over.mp3