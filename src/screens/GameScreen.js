import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BIRD_HEIGHT,
  BIRD_START_X,
  BIRD_START_Y,
  BIRD_STEP,
  BIRD_WIDTH,
  FOOD_HEIGHT,
  FOOD_WIDTH,
  GAME_LOOP_MS,
  INITIAL_SPEED,
  OBSTACLE_HEIGHT,
  OBSTACLE_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SPAWN_INTERVAL,
  SPEED_INCREMENT,
} from "../constants/gameConfig";
import { checkCollision } from "../utils/collision";

import { Audio } from "expo-av";

// --- Fonction pour jouer un son ---
const playSound = async (type) => {
  try {
    const soundPaths = {
      hit: require("../assets/rock-hit.mp3"),
      over: require("../assets/game-over.mp3"),
      collect: require("../assets/coin-collect.mp3"),
    };

    // On charge le son
    const { sound } = await Audio.Sound.createAsync(
      soundPaths[type],
      { shouldPlay: true, volume: 1.0 }
    );

    // On force la lecture au cas où shouldPlay ne suffit pas
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // SI TU NE VOIS RIEN DANS LA CONSOLE, LE PROBLÈME EST PHYSIQUE (VOLUME)
    // SI TU VOIS UN MESSAGE ICI, LE PROBLÈME EST LE CHEMIN DU FICHIER
    console.log("ERREUR AUDIO DETECTÉE :", error);
  }
};

let obstacleId = 0;
let foodId = 0;

export default function GameScreen() {
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [displayObstacles, setDisplayObstacles] = useState([]);
  const [displayFood, setDisplayFood] = useState([]);
  const [birdX, setBirdX] = useState(BIRD_START_X);

  const birdXRef = useRef(BIRD_START_X);
  const obstaclesRef = useRef([]);
  const foodRef = useRef([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const speedRef = useRef(INITIAL_SPEED);
  const gameOverRef = useRef(false);
  const invincibleRef = useRef(false);
  const movingLeft = useRef(false);
  const movingRight = useRef(false);

  const spawnObstacle = useCallback(() => {
    if (gameOverRef.current) return;
    const x = Math.random() * (SCREEN_WIDTH - OBSTACLE_WIDTH);
    obstaclesRef.current = [
      ...obstaclesRef.current,
      {
        id: obstacleId++,
        x,
        y: -OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      },
    ];
  }, []);

  const spawnFood = useCallback(() => {
    if (gameOverRef.current) return;
    const x = Math.random() * (SCREEN_WIDTH - FOOD_WIDTH);
    foodRef.current = [
      ...foodRef.current,
      {
        id: foodId++,
        x,
        y: -FOOD_HEIGHT,
        width: FOOD_WIDTH,
        height: FOOD_HEIGHT,
      },
    ];
  }, []);

  const tick = useCallback(() => {
    if (gameOverRef.current) return;

    speedRef.current += SPEED_INCREMENT;
    const speed = speedRef.current;

    let newObs = obstaclesRef.current
      .map((o) => ({ ...o, y: o.y + speed }))
      .filter((o) => o.y < SCREEN_HEIGHT + OBSTACLE_HEIGHT);

    let newFood = foodRef.current
      .map((f) => ({ ...f, y: f.y + speed }))
      .filter((f) => f.y < SCREEN_HEIGHT + FOOD_HEIGHT);

    const bird = {
      x: birdXRef.current,
      y: BIRD_START_Y,
      width: BIRD_WIDTH,
      height: BIRD_HEIGHT,
    };

    // --- Gestion Collisions Obstacles ---
    if (!invincibleRef.current) {
      newObs = newObs.filter((o) => {
        if (checkCollision(bird, o)) {
          playSound("hit"); // JOUE LE SON DE COLLISION
          const newLives = livesRef.current - 1;
          livesRef.current = newLives;
          setLives(newLives);
          if (newLives <= 0) {
            gameOverRef.current = true;
            playSound("over"); // JOUE LE SON GAME OVER
            router.push({
              pathname: "/gameover",
              params: { score: scoreRef.current },
            });
          } else {
            invincibleRef.current = true;
            setTimeout(() => {
              invincibleRef.current = false;
            }, 1500);
          }
          return false;
        }
        return true;
      });
    }

    // --- Gestion Collisions Nourriture ---
    newFood = newFood.filter((f) => {
      if (checkCollision(bird, f)) {
        playSound("collect"); // JOUE LE SON DE COLLECTE
        const newScore = scoreRef.current + 5; // +5 points pour la nourriture
        scoreRef.current = newScore;
        setScore(newScore);
        return false;
      }
      return true;
    });

    obstaclesRef.current = newObs;
    foodRef.current = newFood;
    setDisplayObstacles([...newObs]);
    setDisplayFood([...newFood]);
  }, [router]);

  const startMoveLoop = useCallback(() => {
    const interval = setInterval(() => {
      if (movingLeft.current) {
        birdXRef.current = Math.max(0, birdXRef.current - BIRD_STEP);
        setBirdX(birdXRef.current);
      }
      if (movingRight.current) {
        birdXRef.current = Math.min(
          SCREEN_WIDTH - BIRD_WIDTH,
          birdXRef.current + BIRD_STEP,
        );
        setBirdX(birdXRef.current);
      }
    }, 30);
    return interval;
  }, []);

  useEffect(() => {
    const obsGen = setInterval(spawnObstacle, SPAWN_INTERVAL);
    const foodGen = setInterval(spawnFood, SPAWN_INTERVAL * 1.5);
    const mainLoop = setInterval(tick, GAME_LOOP_MS);
    const moveLoop = startMoveLoop();

    return () => {
      clearInterval(obsGen);
      clearInterval(foodGen);
      clearInterval(mainLoop);
      clearInterval(moveLoop);
    };
  }, [tick, spawnObstacle, spawnFood, startMoveLoop]);

  return (
    <ImageBackground
      source={require("../assets/forest-level.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.hud}>
        <Text style={styles.hudText}>⭐ {score}</Text>
        <Text style={styles.hudText}>❤️ {lives}</Text>
      </View>

      {/* L'OISEAU (IMAGE) */}
      <View
        style={[
          styles.bird,
          { left: birdX, top: BIRD_START_Y },
          invincibleRef.current && { opacity: 0.5 },
        ]}
      >
        <Image
          source={require("../assets/blue-bird.png")}
          style={styles.imageFull}
          resizeMode="contain"
        />
      </View>

      {/* OBSTACLES (IMAGE) */}
      {displayObstacles.map((o) => (
        <View key={o.id} style={[styles.obstacle, { left: o.x, top: o.y }]}>
          <Image
            source={require("../assets/rock.png")}
            style={styles.imageFull}
            resizeMode="contain"
          />
        </View>
      ))}

      {/* NOURRITURE (IMAGE) */}
      {displayFood.map((f) => (
        <View key={f.id} style={[styles.food, { left: f.x, top: f.y }]}>
          <Image
            source={require("../assets/food.png")}
            style={styles.imageFull}
            resizeMode="contain"
          />
        </View>
      ))}

      <View style={styles.controls}>
        <Pressable
          style={styles.controlBtn}
          onPressIn={() => {
            movingLeft.current = true;
          }}
          onPressOut={() => {
            movingLeft.current = false;
          }}
        >
          <Text style={styles.controlText}>◀</Text>
        </Pressable>
        <Pressable
          style={styles.controlBtn}
          onPressIn={() => {
            movingRight.current = true;
          }}
          onPressOut={() => {
            movingRight.current = false;
          }}
        >
          <Text style={styles.controlText}>▶</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,                 // Prend tout l'espace disponible
    width: SCREEN_WIDTH,     // Forcer la largeur de l'écran (importé de gameConfig)
    height: SCREEN_HEIGHT,   // Forcer la hauteur de l'écran
    backgroundColor: "#1a1a2e" },
  hud: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  hudText: {
    color: "#fff",
  fontSize: 24,
  fontWeight: "bold",
  // Remplace les 3 lignes précédentes par celle-ci :
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)",
  },
  bird: { position: "absolute", width: BIRD_WIDTH, height: BIRD_HEIGHT },
  obstacle: {
    position: "absolute",
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
  },
  food: { position: "absolute", width: FOOD_WIDTH, height: FOOD_HEIGHT },
  imageFull: { width: "100%", height: "100%" },
  controls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controlBtn: {
    backgroundColor: "rgba(233, 69, 96, 0.7)",
  padding: 25,
  borderRadius: 50,
  width: 100,
  alignItems: "center",
  // Nouvelle norme :
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
  },
  controlText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
});
