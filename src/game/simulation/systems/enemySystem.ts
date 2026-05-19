import type { CampfireState, EnemyState, GameState } from '../state';
import { clamp, distance, normalizeAxis } from '../rules/math';
import { applyCreatureDamageResponse } from '../rules/creatureResponses';

const stalkDistance = 250;
const fireStalkDistance = 155;
const lungeStartDistance = 92;
const fireLungeStartDistance = 46;
const stalkSpeed = 54;
const fireStalkSpeedMultiplier = 0.45;
const telegraphMs = 420;
const lungeMs = 260;
const lungeSpeed = 260;
const lungeDamage = 32;
const lungeHitDistance = 34;
const recoveryAfterHitMs = 700;
const recoveryAfterMissMs = 1100;
const boldnessToLunge = 36;
const respawnGraceMs = 1400;

export const updateEnemies = (state: GameState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }
  if (state.world.openingStage !== 'open') {
    return;
  }

  const seconds = deltaMs / 1000;
  const protectiveFire = getProtectiveFire(state);
  const fireProtected = protectiveFire !== undefined;

  for (const enemy of state.enemies) {
    if (enemy.health <= 0) {
      enemy.telegraphMs = 0;
      continue;
    }

    updateWolfNeeds(state, enemy, protectiveFire, seconds);
    enemy.attackTimerMs = Math.max(0, enemy.attackTimerMs - deltaMs);

    if (enemy.mode === 'recovering') {
      updateRecovery(enemy, state, deltaMs, seconds);
      continue;
    }

    if (enemy.mode === 'telegraphing') {
      updateTelegraph(enemy, deltaMs);
      continue;
    }

    if (enemy.mode === 'lunging') {
      updateLunge(enemy, state, deltaMs, seconds);
      continue;
    }

    updateStalkDecision(enemy, state, fireProtected, seconds);
  }
};

const updateWolfNeeds = (
  state: GameState,
  enemy: EnemyState,
  protectiveFire: CampfireState | undefined,
  seconds: number
): void => {
  enemy.hunger = clamp(enemy.hunger + seconds * (2.2 + state.world.rawNightPressure * 3.6), 0, 100);
  enemy.territoryPressure = getTerritoryPressure(state);

  if (protectiveFire) {
    enemy.fear = clamp(enemy.fear + seconds * 22, 0, 100);
  } else {
    enemy.fear = clamp(enemy.fear - seconds * 7, 0, 100);
  }

  const staminaWeakness = (1 - state.player.stamina / state.player.maxStamina) * 18;
  const healthWeakness = (1 - state.player.health / state.player.maxHealth) * 14;
  const coldWeakness = state.world.cold / state.world.maxCold * 10;
  const exposedWeakness = protectiveFire ? -18 : 18;
  const playerWeakness = staminaWeakness + healthWeakness + coldWeakness + exposedWeakness;

  enemy.boldness = clamp(enemy.hunger * 0.55 + enemy.territoryPressure * 0.8 + playerWeakness - enemy.fear * 0.75, 0, 100);
};

const updateStalkDecision = (
  enemy: EnemyState,
  state: GameState,
  fireProtected: boolean,
  seconds: number
): void => {
  const dist = distance(enemy.x, enemy.y, state.player.x, state.player.y);
  const canLunge =
    enemy.attackTimerMs <= 0 &&
    state.player.invulnerableMs <= 0 &&
    enemy.boldness >= boldnessToLunge &&
    dist <= (fireProtected ? fireLungeStartDistance : lungeStartDistance);

  if (canLunge) {
    const axis = normalizeAxis(state.player.x - enemy.x, state.player.y - enemy.y);
    enemy.mode = 'telegraphing';
    enemy.phaseTimerMs = telegraphMs;
    enemy.telegraphMs = 1;
    enemy.lungeX = axis.x;
    enemy.lungeY = axis.y;
    enemy.hasDamagedThisLunge = false;
    state.behaviorMemory.creatures.wolfLungesFaced += 1;
    return;
  }

  if (dist <= (fireProtected ? fireStalkDistance : stalkDistance) || enemy.boldness > 24) {
    enemy.mode = 'stalking';
    enemy.telegraphMs = 0;
    const desiredDistance = fireProtected ? 58 : 34;
    if (dist > desiredDistance) {
      const axis = normalizeAxis(state.player.x - enemy.x, state.player.y - enemy.y);
      const speed = stalkSpeed * (fireProtected ? fireStalkSpeedMultiplier : 1);
      enemy.x += axis.x * speed * seconds;
      enemy.y += axis.y * speed * seconds;
    }
  } else {
    enemy.mode = 'watching';
    enemy.telegraphMs = 0;
  }
};

const updateTelegraph = (enemy: EnemyState, deltaMs: number): void => {
  enemy.phaseTimerMs = Math.max(0, enemy.phaseTimerMs - deltaMs);
  enemy.telegraphMs = telegraphMs - enemy.phaseTimerMs;
  if (enemy.phaseTimerMs <= 0) {
    enemy.mode = 'lunging';
    enemy.phaseTimerMs = lungeMs;
    enemy.telegraphMs = 0;
    enemy.hasDamagedThisLunge = false;
  }
};

const updateLunge = (enemy: EnemyState, state: GameState, deltaMs: number, seconds: number): void => {
  enemy.phaseTimerMs = Math.max(0, enemy.phaseTimerMs - deltaMs);
  enemy.x += enemy.lungeX * lungeSpeed * seconds;
  enemy.y += enemy.lungeY * lungeSpeed * seconds;

  if (
    !enemy.hasDamagedThisLunge &&
    state.player.invulnerableMs <= 0 &&
    distance(enemy.x, enemy.y, state.player.x, state.player.y) <= lungeHitDistance
  ) {
    state.player.health = clamp(state.player.health - lungeDamage, 0, state.player.maxHealth);
    state.behaviorMemory.body.damageTaken += lungeDamage;
    state.behaviorMemory.combat.hitsTaken += 1;
    enemy.hasDamagedThisLunge = true;
    startRecovery(enemy, recoveryAfterHitMs);
    return;
  }

  if (enemy.phaseTimerMs <= 0) {
    if (!enemy.hasDamagedThisLunge) {
      enemy.fear = clamp(enemy.fear + 16, 0, 100);
      state.behaviorMemory.combat.wolfLungesDodged += 1;
      state.behaviorMemory.creatures.wolfLungesAvoided += 1;
    }
    startRecovery(enemy, enemy.hasDamagedThisLunge ? recoveryAfterHitMs : recoveryAfterMissMs);
  }
};

const updateRecovery = (enemy: EnemyState, state: GameState, deltaMs: number, seconds: number): void => {
  enemy.phaseTimerMs = Math.max(0, enemy.phaseTimerMs - deltaMs);
  enemy.telegraphMs = 0;
  const axis = normalizeAxis(enemy.x - state.player.x, enemy.y - state.player.y);
  enemy.x += axis.x * 24 * seconds;
  enemy.y += axis.y * 24 * seconds;
  if (enemy.phaseTimerMs <= 0) {
    enemy.mode = 'stalking';
  }
};

export const applyEnemyDamageResponse = (enemy: EnemyState, damage: number): void => {
  const response = applyCreatureDamageResponse(enemy, damage);
  startRecovery(enemy, response.recoveryMs);
};

export const isPlayerUnderThreat = (state: GameState): boolean => {
  if (state.world.openingStage !== 'open') {
    return false;
  }
  return state.enemies.some((enemy) => {
    if (enemy.health <= 0) {
      return false;
    }
    const dist = distance(enemy.x, enemy.y, state.player.x, state.player.y);
    return enemy.mode === 'telegraphing' || enemy.mode === 'lunging' || (enemy.mode === 'stalking' && dist <= 175 && enemy.boldness >= 24);
  });
};

export const forceEnemyRespawnGrace = (enemy: EnemyState): void => {
  enemy.fear = clamp(enemy.fear + 45, 0, 100);
  enemy.boldness = 0;
  enemy.attackTimerMs = Math.max(enemy.attackTimerMs, respawnGraceMs);
  startRecovery(enemy, respawnGraceMs);
};

const startRecovery = (enemy: EnemyState, durationMs: number): void => {
  enemy.mode = 'recovering';
  enemy.phaseTimerMs = durationMs;
  enemy.attackTimerMs = Math.max(enemy.attackTimerMs, durationMs);
  enemy.telegraphMs = 0;
  enemy.hasDamagedThisLunge = false;
};

const getProtectiveFire = (state: GameState) =>
  state.campfires.find(
    (campfire) =>
      campfire.fuelMs > 0 &&
      distance(state.player.x, state.player.y, campfire.x, campfire.y) <= campfire.radius
  );

const getTerritoryPressure = (state: GameState): number => {
  const northPressure = clamp((350 - state.player.y) / 170, 0, 1);
  const eastPressure = clamp((state.player.x - 1010) / 280, 0, 1);
  return Math.max(northPressure, eastPressure) * 42;
};
