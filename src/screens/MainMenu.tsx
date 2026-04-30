import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Pour aller vers le jeu :
  router.push('/game');

  // Pour aller vers game over (avec le score en paramètre) :
  router.push({ pathname: '/gameover', params: { score: 42 } });

  // Pour récupérer les params dans GameOverScreen :
  // import { useLocalSearchParams } from 'expo-router';
  // const { score } = useLocalSearchParams();
}