import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const BIRD_WIDTH = 180;
export const BIRD_HEIGHT = 180;
export const BIRD_START_X = width / 2 - 25;
export const BIRD_START_Y = height * 0.6;
export const BIRD_STEP = 20;

export const OBSTACLE_WIDTH = 180;
export const OBSTACLE_HEIGHT = 180;
export const FOOD_WIDTH = 180;
export const FOOD_HEIGHT = 180;

export const INITIAL_SPEED = 4;
export const SPEED_INCREMENT = 0.002;
export const SPAWN_INTERVAL = 1500;
export const GAME_LOOP_MS = 16;

export const HITBOX_MARGIN = 40;