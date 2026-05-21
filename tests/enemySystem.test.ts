import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import { applyEnemyDamageResponse, forceEnemyRespawnGrace, isPlayerUnderThreat, updateEnemies } from '../src/game/simulation/systems/enemySystem';
import { getCampfireCollisionObstacles, getEnemyCollisionRadius } from '../src/game/simulation/rules/collision';
import { distance } from '../src/game/simulation/rules/math';

describe('enemy telegraph', () => {
  it('telegraphs before a committed lunge can damage the player', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 20;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;
    const health = state.player.health;

    updateEnemies(state, 16);

    expect(enemy.mode).toBe('telegraphing');
    expect(enemy.telegraphMs).toBeGreaterThan(0);
    expect(state.player.health).toBe(health);
  });

  it('applies one damage event during the committed lunge', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 20;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;

    updateEnemies(state, 16);
    updateEnemies(state, 420);
    updateEnemies(state, 16);
    const healthAfterHit = state.player.health;
    updateEnemies(state, 80);

    expect(state.player.health).toBeLessThan(state.player.maxHealth);
    expect(state.player.health).toBe(healthAfterHit);
    expect(enemy.mode).toBe('recovering');
  });

  it('keeps enemies dormant before the opening resolves', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 20;
    enemy.y = state.player.y;

    updateEnemies(state, 260);

    expect(enemy.mode).toBe('watching');
    expect(state.player.health).toBe(state.player.maxHealth);
  });

  it('makes night enemies target the fire before the player', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    state.campfires[0].fuelMs = 10000;
    const enemy = state.enemies[0];
    enemy.x = state.campfires[0].x + 90;
    enemy.y = state.campfires[0].y;
    enemy.hunger = 100;
    enemy.fear = 0;
    const playerHealth = state.player.health;
    const startX = enemy.x;

    updateEnemies(state, 1000);

    expect(enemy.mode).toBe('stalking');
    expect(enemy.x).toBeLessThan(startX);
    expect(state.player.health).toBe(playerHealth);
  });

  it('builds daytime aggression when the player gets too close', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.42;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 82;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;
    const startX = enemy.x;

    updateEnemies(state, 1000);

    expect(enemy.aggression).toBeGreaterThan(28);
    expect(enemy.mode).toBe('stalking');
    expect(enemy.x).toBeLessThan(startX);
    expect(isPlayerUnderThreat(state)).toBe(true);
  });

  it('telegraphs a daytime lunge when aggression is already high', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.42;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 76;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;
    enemy.aggression = 72;

    updateEnemies(state, 16);

    expect(enemy.mode).toBe('telegraphing');
    expect(enemy.telegraphMs).toBeGreaterThan(0);
    expect(state.behaviorMemory.creatures.wolfLungesFaced).toBe(1);
  });

  it('keeps night enemies outside campfire collision while they assault the fire', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    state.campfires[0].fuelMs = 10000;
    const enemy = state.enemies[0];
    enemy.x = state.campfires[0].x + 90;
    enemy.y = state.campfires[0].y + 8;
    enemy.hunger = 100;
    enemy.fear = 0;
    const fireCollision = getCampfireCollisionObstacles(state.campfires)[0];

    updateEnemies(state, 1000);

    expect(distance(enemy.x, enemy.y, fireCollision.x, fireCollision.y)).toBeGreaterThanOrEqual(
      fireCollision.radius + getEnemyCollisionRadius() - 0.01
    );
    expect(distance(enemy.x, enemy.y, state.campfires[0].x, state.campfires[0].y)).toBeLessThanOrEqual(42);
  });

  it('damages fire integrity during a night assault without reducing fuel directly', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    state.campfires[0].fuelMs = 10000;
    const enemy = state.enemies[0];
    enemy.x = state.campfires[0].x + 20;
    enemy.y = state.campfires[0].y;
    const fuel = state.campfires[0].fuelMs;

    updateEnemies(state, 16);
    updateEnemies(state, 520);

    expect(state.campfires[0].integrity).toBeLessThan(state.campfires[0].maxIntegrity);
    expect(state.campfires[0].fuelMs).toBe(fuel);
  });

  it('adds fear and recovery after a missed lunge', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.world.openingStage = 'open';
    state.world.timeOfDay = 0.9;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 80;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;

    updateEnemies(state, 16);
    updateEnemies(state, 420);
    state.player.y += 120;
    updateEnemies(state, 280);

    expect(enemy.mode).toBe('recovering');
    expect(enemy.fear).toBeGreaterThan(0);
    expect(state.player.health).toBe(state.player.maxHealth);
  });

  it('uses scaled creature damage response when a small enemy is hit hard', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const enemy = state.enemies[0];
    enemy.fear = 0;
    enemy.health -= 16;

    applyEnemyDamageResponse(enemy, 16);

    expect(enemy.fear).toBeGreaterThan(0);
    expect(enemy.fear).toBeLessThan(50);
    expect(enemy.mode).toBe('recovering');
  });

  it('spikes creature fear when damage leaves it critically wounded', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const enemy = state.enemies[0];
    enemy.fear = 0;
    enemy.health = 5;

    applyEnemyDamageResponse(enemy, 16);

    expect(enemy.fear).toBeGreaterThan(65);
    expect(enemy.phaseTimerMs).toBeGreaterThanOrEqual(1200);
  });

  it('clears aggression during respawn grace', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const enemy = state.enemies[0];
    enemy.aggression = 80;

    forceEnemyRespawnGrace(enemy);

    expect(enemy.aggression).toBe(0);
    expect(enemy.mode).toBe('recovering');
  });
});
