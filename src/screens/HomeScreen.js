import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getBestScore } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [bestScore, setBestScore] = useState(0);

  // Recharge le meilleur score à chaque fois qu'on revient sur cet écran
  useFocusEffect(
    useCallback(() => {
      getBestScore().then(setBestScore);
    }, [])
  );

  return (
    <View style={styles.container}>

      {/* Déco haut */}
      <View style={styles.topDecor} />

      {/* Titre */}
      <View style={styles.titleContainer}>
        <Text style={styles.emoji}>🐦</Text>
        <Text style={styles.title}>Bird Runner</Text>
        <Text style={styles.subtitle}>Évite les obstacles, mange la nourriture !</Text>
      </View>

      {/* Meilleur score */}
      {bestScore > 0 && (
        <View style={styles.bestScoreBox}>
          <Text style={styles.bestScoreLabel}>🏆 Meilleur score</Text>
          <Text style={styles.bestScoreValue}>{bestScore}</Text>
        </View>
      )}

      {/* Bouton Jouer */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/game')}>
        <Text style={styles.buttonText}>▶  Jouer</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instrRow}>
          <View style={styles.instrCard}>
            <Text style={styles.instrIcon}>🪨</Text>
            <Text style={styles.instrCardText}>Évite les{'\n'}rochers</Text>
          </View>
          <View style={styles.instrCard}>
            <Text style={styles.instrIcon}>🌾</Text>
            <Text style={styles.instrCardText}>Mange la{'\n'}nourriture</Text>
          </View>
          <View style={styles.instrCard}>
            <Text style={styles.instrIcon}>◀▶</Text>
            <Text style={styles.instrCardText}>Change de{'\n'}couloir</Text>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDecor: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: height * 0.35,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#e94560',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#a8a8b3',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bestScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#f5a623',
  },
  bestScoreLabel: {
    color: '#f5a623',
    fontSize: 15,
    fontWeight: '600',
  },
  bestScoreValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginBottom: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructions: {
    position: 'absolute',
    bottom: 48,
    left: 0, right: 0,
    alignItems: 'center',
  },
  instrRow: {
    flexDirection: 'row',
    gap: 12,
  },
  instrCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    width: width / 3 - 20,
  },
  instrIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  instrCardText: {
    color: '#a8a8b3',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});