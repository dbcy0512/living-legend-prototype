import type { CampfireState, EnemyState, GameState } from '../state';
import { clamp, distance, normalizeAxis } from '../rules/math';
import { applyCreatureDamageResponse } from '../rules/creatureResponses';
import { startingAreaLayout } from '../../content/maps/startingArea';
import { getWorldCyclePhase, isNightAssaultPhase } from '../rules/dayNight';
import { setPlayerThought } from '../rules/thoughts';
import { getEnemyCollisionRadius, resolveWorldCollisions } from '../rules/collision';
import { getActiveEncounterForEnemy, isPlayerInsideCampSanctuary, isPlayerInsideEncounterAggro } from './encounterSystem';

const stalkDistance = 250;
const fireStalkDistance = 155;
const lungeStartDistance = 92;
const fireLungeStartDistance = 46;
const stalkSpeed = 54;
const fireAssaultSpeed = 68;
const fireStalkSpeedMultiplier = 0.45;
const telegraphMs = 420;
const fireAttackWindupMs = 520;
const fireAttackDistance = 42;
const fireAttackDamage = 16;
const fireAttackRecoveryMs = 620;
const lungeMs = 260;
const lungeSpeed = 260;
const lungeDamage = 32;
const lungeHitDistance = 34;
const recoveryAfterHitMs = 700;
const recoveryAfterMissMs = 1100;
const boldnessToLunge = 36;
const daytimeAwarenessDistance = 235;
const daytimeCloseThreatDistance = 92;
const aggressionToStalk = 28;
const aggressionToLunge = 56;
const respawnGraceMs = 1400;
const enemyCollisionRadius = getEnemyCollisionRadius();

export const updateEnemies = (state: GameState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }
  if (state.world.openingStage !== 'open') {
    return;
  }

  const seconds = deltaMs / 1000;
  const cyclePhase = getWorldCyclePhase(state.world.timeOfDay);
  const nightAssault = isNightAssaultPhase(cyclePhase);
  const fireTarget = nightAssault ? getFireDefenseTarget(state) : undefined;
  const protectiveFire = getProtectiveFire(state);
  const fireProtected = protectiveFire !== undefined;

  for (const enemy of state.enemies) {
    if (enemy.health <= 0) {
      enemy.telegraphMs = 0;
      continue;
    }

    if (shouldDisengageEncounterEnemy(state, enemy, seconds)) {
      continue;
    }

    updateCreatureNeeds(state, enemy, protectiveFire, seconds);
    enemy.attackTimerMs = Math.max(0, enemy.attackTimerMs - deltaMs);

    if (!nightAssault) {
      updateDaytimeEnemy(enemy, state, fireProtected, deltaMs, seconds);
      continue;
    }

    if (fireTarget) {
      updateFireAssault(enemy, state, fireTarget, deltaMs, seconds);
      continue;
    }

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

const shouldDisengageEncounterEnemy = (state: GameState, enemy: EnemyState, seconds: number): boolean => {
  if (!getActiveEncounterForEnemy(state, enemy.encounterId)) {
    return false;
  }

  if (isPlayerInsideCampSanctuary(state) || !isPlayerInsideEncounterAggro(state, enemy.encounterId)) {
    enemy.mode = 'watching';
    enemy.telegraphMs = 0;
    enemy.phaseTimerMs = 0;
    enemy.aggression = clamp(enemy.aggression - seconds * 45, 0, 100);
    enemy.boldness = clamp(enemy.boldness - seconds * 55, 0, 100);
    enemy.fear = clamp(enemy.fear + seconds * 28, 0, 100);
    const dist = distance(enemy.x, enemy.y, enemy.homeX, enemy.homeY);
    if (dist > 4) {
      const axis = normalizeAxis(enemy.homeX - enemy.x, enemy.homeY - enemy.y);
      moveEnemy(enemy, state, axis.x * 42 * seconds, axis.y * 42 * seconds);
    }
    return true;
  }

  return false;
};

const updateDaytimeEnemy = (
  enemy: EnemyState,
  state: GameState,
  fireProtected: boolean,
  deltaMs: number,
  seconds: number
): void => {
  enemy.fear = clamp(enemy.fear + seconds * 12, 0, 100);
  enemy.boldness = clamp(enemy.boldness - seconds * 22, 0, 100);
  updateEnemyAggression(enemy, state, fireProtected, seconds);

  if (enemy.mode === 'recovering') {
    updateRecovery(enemy, state, deltaMs, seconds);
    return;
  }

  if (enemy.mode === 'telegraphing') {
    updateTelegraph(enemy, deltaMs);
    return;
  }

  if (enemy.mode === 'lunging') {
    updateLunge(enemy, state, deltaMs, seconds);
    return;
  }

  const playerDistance = distance(enemy.x, enemy.y, state.player.x, state.player.y);
  const canDayLunge =
    enemy.attackTimerMs <= 0 &&
    state.player.invulnerableMs <= 0 &&
    enemy.aggression >= aggressionToLunge &&
    playerDistance <= lungeStartDistance;

  if (canDayLunge) {
    startTelegraph(enemy, state);
    return;
  }

  if (enemy.aggression >= aggressionToStalk || playerDistance <= daytimeCloseThreatDistance) {
    enemy.mode = 'stalking';
    enemy.telegraphMs = 0;
    const desiredDistance = fireProtected ? 64 : 38;
    if (playerDistance > desiredDistance) {
      const axis = normalizeAxis(state.player.x - enemy.x, state.player.y - enemy.y);
      const speed = stalkSpeed * (fireProtected ? fireStalkSpeedMultiplier : 0.86);
      moveEnemy(enemy, state, axis.x * speed * seconds, axis.y * speed * seconds);
    }
    return;
  }

  enemy.mode = 'watching';
  enemy.telegraphMs = 0;
  enemy.phaseTimerMs = 0;
  enemy.hasDamagedThisLunge = false;

  const dist = distance(enemy.x, enemy.y, enemy.homeX, enemy.homeY);
  if (dist <= 3) {
    return;
  }
  const axis = normalizeAxis(enemy.homeX - enemy.x, enemy.homeY - enemy.y);
  moveEnemy(enemy, state, axis.x * 38 * seconds, axis.y * 38 * seconds);
};

const updateEnemyAggression = (
  enemy: EnemyState,
  state: GameState,
  fireProtected: boolean,
  seconds: number
): void => {
  const playerDistance = distance(enemy.x, enemy.y, state.player.x, state.player.y);
  const awareness = clamp((daytimeAwarenessDistance - playerDistance) / daytimeAwarenessDistance, 0, 1);
  const closeThreat = playerDistance <= daytimeCloseThreatDistance ? 1 : 0;
  const hungerPressure = enemy.hunger / 100;
  const territoryPressure = enemy.territoryPressure / 42;
  const exposurePressure = fireProtected ? -0.55 : 0.25;
  const fearPressure = enemy.fear / 100;
  const gain =
    awareness * 18 +
    closeThreat * 34 +
    hungerPressure * 10 +
    territoryPressure * 18 +
    exposurePressure * 18 -
    fearPressure * 16;
  const decay = fireProtected || awareness <= 0 ? 24 : 8;
  enemy.aggression = clamp(enemy.aggression + gain * seconds - decay * seconds, 0, 100);
};

const updateCreatureNeeds = (
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

const updateFireAssault = (
  enemy: EnemyState,
  state: GameState,
  fireTarget: CampfireState,
  deltaMs: number,
  seconds: number
): void => {
  if (enemy.mode === 'recovering') {
    updateRecovery(enemy, state, deltaMs, seconds);
    return;
  }

  if (enemy.mode === 'attacking-fire') {
    updateFireAttack(enemy, state, fireTarget, deltaMs);
    return;
  }

  const dist = distance(enemy.x, enemy.y, fireTarget.x, fireTarget.y);
  enemy.telegraphMs = 0;
  if (dist > fireAttackDistance) {
    enemy.mode = 'stalking';
    const axis = normalizeAxis(fireTarget.x - enemy.x, fireTarget.y - enemy.y);
    moveEnemy(enemy, state, axis.x * fireAssaultSpeed * seconds, axis.y * fireAssaultSpeed * seconds);
    return;
  }

  if (enemy.attackTimerMs <= 0) {
    enemy.mode = 'attacking-fire';
    enemy.phaseTimerMs = fireAttackWindupMs;
    enemy.telegraphMs = 1;
  }
};

const updateFireAttack = (enemy: EnemyState, state: GameState, fireTarget: CampfireState, deltaMs: number): void => {
  if (fireTarget.fuelMs <= 0 || fireTarget.integrity <= 0) {
    enemy.mode = 'watching';
    enemy.telegraphMs = 0;
    return;
  }

  if (distance(enemy.x, enemy.y, fireTarget.x, fireTarget.y) > fireAttackDistance + 16) {
    enemy.mode = 'stalking';
    enemy.telegraphMs = 0;
    return;
  }

  enemy.phaseTimerMs = Math.max(0, enemy.phaseTimerMs - deltaMs);
  enemy.telegraphMs = fireAttackWindupMs - enemy.phaseTimerMs;
  if (enemy.phaseTimerMs > 0) {
    return;
  }

  fireTarget.integrity = clamp(fireTarget.integrity - fireAttackDamage, 0, fireTarget.maxIntegrity);
  if (fireTarget.integrity <= 0) {
    fireTarget.fuelMs = 0;
    setPlayerThought(state, 'The fire is gone.');
  } else if (fireTarget.integrity <= fireTarget.maxIntegrity * 0.35) {
    setPlayerThought(state, 'The fire is breaking.');
  }

  startRecovery(enemy, fireAttackRecoveryMs);
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
    startTelegraph(enemy, state);
    return;
  }

  if (dist <= (fireProtected ? fireStalkDistance : stalkDistance) || enemy.boldness > 24) {
    enemy.mode = 'stalking';
    enemy.telegraphMs = 0;
    const desiredDistance = fireProtected ? 58 : 34;
    if (dist > desiredDistance) {
      const axis = normalizeAxis(state.player.x - enemy.x, state.player.y - enemy.y);
      const speed = stalkSpeed * (fireProtected ? fireStalkSpeedMultiplier : 1);
      moveEnemy(enemy, state, axis.x * speed * seconds, axis.y * speed * seconds);
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
  moveEnemy(enemy, state, enemy.lungeX * lungeSpeed * seconds, enemy.lungeY * lungeSpeed * seconds);

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
  moveEnemy(enemy, state, axis.x * 24 * seconds, axis.y * 24 * seconds);
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
  if (isNightAssaultPhase(getWorldCyclePhase(state.world.timeOfDay)) && getFireDefenseTarget(state)) {
    return state.enemies.some((enemy) => enemy.health > 0 && enemy.mode !== 'watching');
  }
  return state.enemies.some((enemy) => {
    if (enemy.health <= 0) {
      return false;
    }
    const dist = distance(enemy.x, enemy.y, state.player.x, state.player.y);
    return (
      enemy.mode === 'telegraphing' ||
      enemy.mode === 'lunging' ||
      (enemy.mode === 'stalking' && dist <= 175 && (enemy.boldness >= 24 || enemy.aggression >= aggressionToStalk))
    );
  });
};

export const forceEnemyRespawnGrace = (enemy: EnemyState): void => {
  enemy.fear = clamp(enemy.fear + 45, 0, 100);
  enemy.boldness = 0;
  enemy.aggression = 0;
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

const startTelegraph = (enemy: EnemyState, state: GameState): void => {
  const axis = normalizeAxis(state.player.x - enemy.x, state.player.y - enemy.y);
  enemy.mode = 'telegraphing';
  enemy.phaseTimerMs = telegraphMs;
  enemy.telegraphMs = 1;
  enemy.lungeX = axis.x;
  enemy.lungeY = axis.y;
  enemy.hasDamagedThisLunge = false;
  state.behaviorMemory.creatures.wolfLungesFaced += 1;
};

const moveEnemy = (enemy: EnemyState, state: GameState, moveX: number, moveY: number): void => {
  enemy.x += moveX;
  enemy.y += moveY;
  const resolved = resolveWorldCollisions(state.campfires, enemy.x, enemy.y, enemyCollisionRadius);
  enemy.x = resolved.x;
  enemy.y = resolved.y;
};

const getProtectiveFire = (state: GameState) =>
  state.campfires.find(
    (campfire) =>
      campfire.fuelMs > 0 &&
      campfire.integrity > 0 &&
      distance(state.player.x, state.player.y, campfire.x, campfire.y) <= campfire.radius
  );

const getFireDefenseTarget = (state: GameState): CampfireState | undefined =>
  state.campfires.find((campfire) => campfire.id === 'first-fire' && campfire.fuelMs > 0 && campfire.integrity > 0) ??
  state.campfires.find((campfire) => campfire.fuelMs > 0 && campfire.integrity > 0);

const getTerritoryPressure = (state: GameState): number => {
  const northPressure = clamp((startingAreaLayout.campCenter.y - 250 - state.player.y) / 220, 0, 1);
  const eastPressure = clamp((state.player.x - (startingAreaLayout.campCenter.x + 520)) / 360, 0, 1);
  return Math.max(northPressure, eastPressure) * 42;
};
