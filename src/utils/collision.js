import { HITBOX_MARGIN } from '../constants/gameConfig';

export function checkCollision(a, b) {
  const m = HITBOX_MARGIN;
  return (
    a.x + m < b.x + b.width - m &&
    a.x + a.width - m > b.x + m &&
    a.y + m < b.y + b.height - m &&
    a.y + a.height - m > b.y + m
  );
}