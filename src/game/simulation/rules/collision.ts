import { startingArea } from '../../content/maps/startingArea';

export type CircleObstacle = {
  id: string;
  kind: 'tree';
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

export const getPlayerCollisionRadius = (): number => playerCollisionRadius;

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

export const resolveMapCollisions = (x: number, y: number, actorRadius = playerCollisionRadius): CollisionResult => {
  let resolvedX = x;
  let resolvedY = y;
  let blocked = false;

  for (const obstacle of startingArea.collision) {
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
