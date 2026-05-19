import type { GameState } from '../state';
import { createTreeDependentResourceSeeds } from '../../content/ecosystem';
import { clamp, distance } from '../rules/math';
import { forceEnemyRespawnGrace, isPlayerUnderThreat } from './enemySystem';

const ecosystemRegenerationTime = 0.28;
const ecosystemRegenerationPressureCost = 0.24;

export const updateWorld = (state: GameState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }

  const seconds = deltaMs / 1000;
  const world = state.world;
  const player = state.player;

  world.timeOfDay += seconds / 180;
  if (world.timeOfDay >= 1) {
    world.timeOfDay -= 1;
    world.day += 1;
  }

  const nightPressure = getNightPressure(world.timeOfDay);
  const dawnDuskGlow = getDawnDuskGlow(world.timeOfDay);
  const localNightPressure = getLocalNightPressure(state, nightPressure);
  world.rawNightPressure = nightPressure;
  world.localNightPressure = localNightPressure;
  world.dawnDuskGlow = dawnDuskGlow;
  world.windPhase += seconds * (0.9 + nightPressure * 0.5);
  world.lifePulse = (Math.sin(world.windPhase * 2.1) + 1) / 2;
  world.mood = clamp(0.35 + localNightPressure * 0.45 + dawnDuskGlow * 0.16 + world.lifePulse * 0.12, 0, 1);
  updateBehaviorMemory(state, deltaMs);
  updateEcosystemWorldEventInfluence(state, seconds);
  updateEcosystemLifecycle(state);

  updateCold(state, seconds);

  if (world.openingStage === 'open') {
    player.hunger = clamp(player.hunger - seconds * (0.18 + localNightPressure * 0.08), 0, player.maxHunger);
    if (player.hunger <= 0) {
      player.health = clamp(player.health - seconds * 3.5, 0, player.maxHealth);
    }
  }

  if (player.health <= 0) {
    respawnPlayer(state);
  } else if (world.openingStage === 'open' && world.day > 1 && world.timeOfDay >= 0.28 && world.timeOfDay <= 0.36) {
    world.status = 'won';
  }
};

const updateEcosystemWorldEventInfluence = (state: GameState, seconds: number): void => {
  const world = state.world;
  const pressureGain = seconds * (world.rawNightPressure * 0.18 + world.dawnDuskGlow * 0.04);
  state.ecosystem.windfallPressure = clamp(state.ecosystem.windfallPressure + pressureGain, 0, 1);
};

const updateEcosystemLifecycle = (state: GameState): void => {
  const world = state.world;
  if (world.day <= state.ecosystem.lastRegenerationDay || world.timeOfDay < ecosystemRegenerationTime) {
    return;
  }
  if (state.ecosystem.windfallPressure < ecosystemRegenerationPressureCost) {
    return;
  }

  const seeds = createTreeDependentResourceSeeds(state.ecosystem.seed);
  for (const seed of seeds) {
    const existing = state.resources.find((resource) => resource.id === seed.id);
    if (existing) {
      if (existing.amount <= 0) {
        existing.x = seed.x;
        existing.y = seed.y;
        existing.amount = seed.amount;
        existing.respawnMs = seed.respawnMs;
      }
      continue;
    }
    state.resources.push({ ...seed });
  }

  state.ecosystem.lastRegenerationPressure = state.ecosystem.windfallPressure;
  state.ecosystem.windfallPressure = clamp(
    state.ecosystem.windfallPressure - ecosystemRegenerationPressureCost,
    0,
    1
  );
  state.ecosystem.lastRegenerationDay = world.day;
};

export const getNightPressure = (timeOfDay: number): number => {
  if (timeOfDay > 0.76 || timeOfDay < 0.2) {
    return 1;
  }
  if (timeOfDay > 0.64) {
    return (timeOfDay - 0.64) / 0.12;
  }
  if (timeOfDay < 0.32) {
    return (0.32 - timeOfDay) / 0.12;
  }
  return 0;
};

export const getLocalNightPressure = (state: GameState, nightPressure: number): number => {
  const activeCampfire = state.campfires.find(
    (campfire) =>
      campfire.fuelMs > 0 &&
      distance(state.player.x, state.player.y, campfire.x, campfire.y) <= campfire.radius
  );
  return activeCampfire ? nightPressure * 0.32 : nightPressure;
};

export const getDawnDuskGlow = (timeOfDay: number): number => {
  const dawn = bellCurve(timeOfDay, 0.31, 0.07);
  const dusk = bellCurve(timeOfDay, 0.68, 0.08);
  return clamp(Math.max(dawn, dusk), 0, 1);
};

const updateCold = (state: GameState, seconds: number): void => {
  const world = state.world;
  const nearActiveFire = state.campfires.some(
    (campfire) =>
      campfire.fuelMs > 0 &&
      distance(state.player.x, state.player.y, campfire.x, campfire.y) <= campfire.radius
  );

  if (nearActiveFire) {
    world.cold = clamp(world.cold - seconds * 18, 0, world.maxCold);
  } else if (world.openingStage !== 'open') {
    world.cold = clamp(world.cold + seconds * 2, 0, world.maxCold);
  } else {
    world.cold = clamp(world.cold + seconds * 4, 0, world.maxCold);
  }

  if (world.openingStage === 'cold' && world.cold >= 85 && !nearActiveFire) {
    const danger = (world.cold - 84) / 16;
    state.player.health = clamp(state.player.health - seconds * danger * 1.15, 0, state.player.maxHealth);
  }

  if (world.openingStage === 'first-flame' && world.cold <= 18) {
    world.openingStage = 'open';
  }
};

const respawnPlayer = (state: GameState): void => {
  const player = state.player;
  player.x = state.respawnPoint.x;
  player.y = state.respawnPoint.y;
  player.facing = 'south';
  player.health = Math.max(45, player.maxHealth * 0.6);
  player.stamina = Math.max(55, player.maxStamina * 0.7);
  player.hunger = Math.max(player.hunger, 35);
  player.invulnerableMs = 1200;
  state.combat.phase = 'idle';
  state.combat.timerMs = 0;
  state.combat.cooldownMs = 0;
  state.combat.rollCooldownMs = 0;
  state.combat.hitStopMs = 0;
  state.combat.lastHitFlashMs = 0;
  state.world.cold = Math.min(state.world.cold, 72);
  state.world.status = 'playing';
  state.world.respawns += 1;
  state.behaviorMemory.body.collapses += 1;
  for (const enemy of state.enemies) {
    forceEnemyRespawnGrace(enemy);
  }
};

const updateBehaviorMemory = (state: GameState, deltaMs: number): void => {
  if (state.world.cold >= 60) {
    state.behaviorMemory.body.coldMs += deltaMs;
  }
  if (state.player.stamina <= state.player.maxStamina * 0.2) {
    state.behaviorMemory.body.exhaustedMs += deltaMs;
  }

  const nearActiveFire = state.campfires.some(
    (campfire) =>
      campfire.fuelMs > 0 &&
      distance(state.player.x, state.player.y, campfire.x, campfire.y) <= campfire.radius
  );
  if (nearActiveFire) {
    state.behaviorMemory.fire.timeNearActiveFireMs += deltaMs;
    if (isPlayerUnderThreat(state)) {
      state.behaviorMemory.fire.foughtNearFireMs += deltaMs;
    }
  }
};

const bellCurve = (value: number, center: number, radius: number): number => {
  const distanceFromCenter = Math.abs(value - center);
  if (distanceFromCenter >= radius) {
    return 0;
  }
  return 1 - distanceFromCenter / radius;
};
