import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { saveBestScore, getBestScore } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function GameOverScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();
  const numScore = parseInt(score) || 0;
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    async function save() {
      const previousBest = await getBestScore();
      const newBest = await saveBestScore(numScore);
      setBestScore(newBest);
      setIsNewBest(numScore > previousBest);
    }
    save();
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.skull}>💀</Text>
        <Text style={styles.title}>Game Over</Text>
        {isNewBest && (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>🎉 Nouveau record !</Text>
          </View>
        )}
      </View>

      {/* Scores */}
      <View style={styles.scoreBox}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{numScore}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>🏆 Meilleur</Text>
          <Text style={[styles.scoreValue, { color: '#f5a623' }]}>{bestScore}</Text>
        </View>
      </View>

      {/* Boutons */}
      <TouchableOpacity style={styles.btnPrimary} onPress={() => router.replace('/game')}>
        <Text style={styles.btnText}>🔄  Rejouer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={() => router.replace('/')}>
        <Text style={styles.btnTextSecondary}>🏠  Accueil</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  skull: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    color: '#e94560',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  newBestBadge: {
    marginTop: 12,
    backgroundColor: '#f5a623',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  newBestText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreBox: {
    backgroundColor: '#16213e',
    borderRadius: 24,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 8,
  },
  scoreLabel: {
    color: '#a8a8b3',
    fontSize: 18,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  btnPrimary: {
    backgroundColor: '#e94560',
  paddingVertical: 18,
  borderRadius: 50,
  width: '100%',
  alignItems: 'center',
  marginBottom: 16,
  // Remplacement simplifié pour Web/Mobile
  boxShadow: '0px 4px 8px rgba(233, 69, 96, 0.4)',
  },
  btnSecondary: {
    backgroundColor: '#16213e',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTextSecondary: {
    color: '#a8a8b3',
    fontSize: 18,
    fontWeight: '600',
  },
});