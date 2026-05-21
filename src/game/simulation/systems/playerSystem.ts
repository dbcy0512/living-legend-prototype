import type { ActionState } from '../../input/actions';
import { startingArea } from '../../content/maps/startingArea';
import type { CampfireState, GameState } from '../state';
import { resolveCircleObstacleCollision, resolveMapCollisions, type CircleObstacle } from '../rules/collision';
import { clamp, normalizeAxis } from '../rules/math';

const rollCost = 26;
const cleanerRollCost = 22;
const rollDurationMs = 280;
const rollCooldownMs = 420;
const cleanerRollCooldownMs = 360;
const campfireCollisionRadius = 28;

export const updatePlayer = (state: GameState, actions: ActionState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }

  const player = state.player;
  const combat = state.combat;
  const seconds = deltaMs / 1000;

  player.invulnerableMs = Math.max(0, player.invulnerableMs - deltaMs);
  combat.cooldownMs = Math.max(0, combat.cooldownMs - deltaMs);
  combat.rollCooldownMs = Math.max(0, combat.rollCooldownMs - deltaMs);

  const recovering = combat.phase === 'recovery' || combat.phase === 'windup' || combat.phase === 'active';
  const rolling = combat.phase === 'rolling';
  const currentRollCost = state.evolution.cleanerRoll ? cleanerRollCost : rollCost;
  const currentRollCooldownMs = state.evolution.cleanerRoll ? cleanerRollCooldownMs : rollCooldownMs;

  if (actions.dodge && combat.rollCooldownMs <= 0 && combat.phase === 'idle' && player.stamina >= currentRollCost) {
    player.stamina -= currentRollCost;
    player.invulnerableMs = rollDurationMs;
    combat.phase = 'rolling';
    combat.timerMs = rollDurationMs;
    combat.rollCooldownMs = currentRollCooldownMs;
    state.behaviorMemory.combat.dodgesUsed += 1;
  }

  const axis = normalizeAxis(actions.moveX, actions.moveY);
  if (axis.x !== 0 || axis.y !== 0) {
    if (Math.abs(axis.x) > Math.abs(axis.y)) {
      player.facing = axis.x > 0 ? 'east' : 'west';
    } else {
      player.facing = axis.y > 0 ? 'south' : 'north';
    }
  }

  const moveSpeed = rolling ? player.speed * 2.25 : recovering ? player.speed * 0.35 : player.speed;
  const nextX = clamp(
    player.x + axis.x * moveSpeed * seconds,
    startingArea.boundsPadding.x,
    startingArea.width - startingArea.boundsPadding.x
  );
  const resolvedX = resolveMapCollisions(nextX, player.y);
  const campfireResolvedX = resolveCampfireCollisions(state.campfires, resolvedX.x, resolvedX.y);
  player.x = clamp(campfireResolvedX.x, startingArea.boundsPadding.x, startingArea.width - startingArea.boundsPadding.x);

  const nextY = clamp(
    player.y + axis.y * moveSpeed * seconds,
    startingArea.boundsPadding.y,
    startingArea.height - startingArea.boundsPadding.y
  );
  const resolvedY = resolveMapCollisions(player.x, nextY);
  const campfireResolvedY = resolveCampfireCollisions(state.campfires, resolvedY.x, resolvedY.y);
  player.x = clamp(campfireResolvedY.x, startingArea.boundsPadding.x, startingArea.width - startingArea.boundsPadding.x);
  player.y = clamp(campfireResolvedY.y, startingArea.boundsPadding.y, startingArea.height - startingArea.boundsPadding.y);

  const hungerPenalty = player.hunger < 18 ? 0.35 : 1;
  const coldPressure = state.world.openingStage === 'open' ? 0 : state.world.cold / state.world.maxCold;
  const coldPenalty = 1 - coldPressure * 0.65;
  player.stamina = clamp(player.stamina + 18 * hungerPenalty * coldPenalty * seconds, 0, player.maxStamina);
};

export const getCampfireCollisionObstacles = (campfires: readonly CampfireState[]): CircleObstacle[] =>
  campfires.map((campfire) => ({
    id: `collision-${campfire.id}`,
    kind: 'campfire',
    x: campfire.x,
    y: campfire.y + 8,
    radius: campfireCollisionRadius
  }));

const resolveCampfireCollisions = (campfires: readonly CampfireState[], x: number, y: number) => {
  let resolvedX = x;
  let resolvedY = y;
  let blocked = false;

  for (const obstacle of getCampfireCollisionObstacles(campfires)) {
    const resolved = resolveCircleObstacleCollision(resolvedX, resolvedY, obstacle);
    resolvedX = resolved.x;
    resolvedY = resolved.y;
    blocked = blocked || resolved.blocked;
  }

  return { x: resolvedX, y: resolvedY, blocked };
};
