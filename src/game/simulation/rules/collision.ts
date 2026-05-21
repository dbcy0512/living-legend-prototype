import { startingArea } from '../../content/maps/startingArea';
import type { CampfireState } from '../state';

export type CircleObstacle = {
  id: string;
  kind: 'tree' | 'campfire';
  x: number;
  y: number;
  segmentEndY?: number;
  radius: number;
};

export type CollisionResult = {
  x: number;
  y: number;
  blocked: boolean;
};

const playerCollisionRadius = 14;
const enemyCollisionRadius = 10;
const campfireCollisionRadius = 28;

export const getPlayerCollisionRadius = (): number => playerCollisionRadius;
export const getEnemyCollisionRadius = (): number => enemyCollisionRadius;

const resolveVerticalTrunkCollision = (
  x: number,
  y: number,
  obstacle: CircleObstacle,
  actorRadius: number
): CollisionResult => {
  const top = Math.min(obstacle.y, obstacle.segmentEndY ?? obstacle.y);
  const bottom = Math.max(obstacle.y, obstacle.segmentEndY ?? obstacle.y);
  const left = obstacle.x - obstacle.radius - actorRadius;
  const right = obstacle.x + obstacle.radius + actorRadius;
  const expandedTop = top - actorRadius;
  const expandedBottom = bottom + actorRadius;

  if (x <= left || x >= right || y <= expandedTop || y >= expandedBottom) {
    return { x, y, blocked: false };
  }

  const pushLeft = Math.abs(x - left);
  const pushRight = Math.abs(right - x);
  const pushTop = Math.abs(y - expandedTop);
  const pushBottom = Math.abs(expandedBottom - y);
  const minPush = Math.min(pushLeft, pushRight, pushTop, pushBottom);

  if (minPush === pushLeft) {
    return { x: left, y, blocked: true };
  }
  if (minPush === pushRight) {
    return { x: right, y, blocked: true };
  }
  if (minPush === pushTop) {
    return { x, y: expandedTop, blocked: true };
  }
  return { x, y: expandedBottom, blocked: true };
};

export const resolveCircleObstacleCollision = (
  x: number,
  y: number,
  obstacle: CircleObstacle,
  actorRadius = playerCollisionRadius
): CollisionResult => {
  if (obstacle.segmentEndY !== undefined) {
    return resolveVerticalTrunkCollision(x, y, obstacle, actorRadius);
  }

  const minDistance = obstacle.radius + actorRadius;
  const obstacleY = obstacle.y;
  const dx = x - obstacle.x;
  const dy = y - obstacleY;
  const distanceSq = dx * dx + dy * dy;

  if (distanceSq >= minDistance * minDistance) {
    return { x, y, blocked: false };
  }

  if (distanceSq === 0) {
    return {
      x: obstacle.x + minDistance,
      y: obstacleY,
      blocked: true
    };
  }

  const distance = Math.sqrt(distanceSq);
  const push = minDistance / distance;
  return {
    x: obstacle.x + dx * push,
    y: obstacleY + dy * push,
    blocked: true
  };
};

export const resolveObstacleListCollisions = (
  x: number,
  y: number,
  obstacles: readonly CircleObstacle[],
  actorRadius = playerCollisionRadius
): CollisionResult => {
  let resolvedX = x;
  let resolvedY = y;
  let blocked = false;

  for (const obstacle of obstacles) {
    const resolved = resolveCircleObstacleCollision(resolvedX, resolvedY, obstacle, actorRadius);
    resolvedX = resolved.x;
    resolvedY = resolved.y;
    blocked = blocked || resolved.blocked;
  }

  return {
    x: resolvedX,
    y: resolvedY,
    blocked
  };
};

export const resolveMapCollisions = (x: number, y: number, actorRadius = playerCollisionRadius): CollisionResult =>
  resolveObstacleListCollisions(x, y, startingArea.collision, actorRadius);

export const getCampfireCollisionObstacles = (campfires: readonly CampfireState[]): CircleObstacle[] =>
  campfires.map((campfire) => ({
    id: `collision-${campfire.id}`,
    kind: 'campfire',
    x: campfire.x,
    y: campfire.y + 8,
    radius: campfireCollisionRadius
  }));

export const resolveWorldCollisions = (
  campfires: readonly CampfireState[],
  x: number,
  y: number,
  actorRadius = playerCollisionRadius
): CollisionResult => {
  const mapResolved = resolveMapCollisions(x, y, actorRadius);
  const campfireResolved = resolveObstacleListCollisions(
    mapResolved.x,
    mapResolved.y,
    getCampfireCollisionObstacles(campfires),
    actorRadius
  );
  return {
    x: campfireResolved.x,
    y: campfireResolved.y,
    blocked: mapResolved.blocked || campfireResolved.blocked
  };
};
