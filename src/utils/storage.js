import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'bird_runner_best_score';

export async function getBestScore() {
  try {
    const val = await AsyncStorage.getItem(KEY);
    return val ? parseInt(val) : 0;
  } catch {
    return 0;
  }
}

export async function saveBestScore(score) {
  try {
    const best = await getBestScore();
    if (score > best) {
      await AsyncStorage.setItem(KEY, score.toString());
      return score;
    }
    return best;
  } catch {
    return score;
  }
}