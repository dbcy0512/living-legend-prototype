import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import { applyEnemyDamageResponse, updateEnemies } from '../src/game/simulation/systems/enemySystem';

describe('enemy telegraph', () => {
  it('telegraphs before a committed lunge can damage the player', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
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
    const state = createGameState();
    state.world.openingStage = 'open';
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
    const state = createGameState();
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 20;
    enemy.y = state.player.y;

    updateEnemies(state, 260);

    expect(enemy.mode).toBe('watching');
    expect(state.player.health).toBe(state.player.maxHealth);
  });

  it('makes enemies more cautious while the player is protected by active fire', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    state.campfires[0].fuelMs = 10000;
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 48;
    enemy.y = state.player.y;
    enemy.hunger = 100;
    enemy.fear = 0;

    updateEnemies(state, 16);

    expect(enemy.mode).toBe('stalking');
    expect(state.player.health).toBe(state.player.maxHealth);
  });

  it('slows enemy stalking near active fire compared with exposed ground', () => {
    const exposed = createGameState();
    exposed.world.openingStage = 'open';
    const exposedEnemy = exposed.enemies[0];
    exposedEnemy.x = exposed.player.x + 120;
    exposedEnemy.y = exposed.player.y;

    const protectedState = createGameState();
    protectedState.world.openingStage = 'open';
    protectedState.campfires[0].fuelMs = 10000;
    const protectedEnemy = protectedState.enemies[0];
    protectedEnemy.x = protectedState.player.x + 120;
    protectedEnemy.y = protectedState.player.y;

    updateEnemies(exposed, 1000);
    updateEnemies(protectedState, 1000);

    expect(exposedEnemy.x).toBeLessThan(protectedEnemy.x);
  });

  it('adds fear and recovery after a missed lunge', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
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

  it('uses scaled creature damage response when the wolf is hit', () => {
    const state = createGameState();
    const enemy = state.enemies[0];
    enemy.fear = 0;
    enemy.health -= 16;

    applyEnemyDamageResponse(enemy, 16);

    expect(enemy.fear).toBeGreaterThan(0);
    expect(enemy.fear).toBeLessThan(30);
    expect(enemy.mode).toBe('recovering');
  });

  it('spikes wolf fear when damage leaves it critically wounded', () => {
    const state = createGameState();
    const enemy = state.enemies[0];
    enemy.fear = 0;
    enemy.health = 8;

    applyEnemyDamageResponse(enemy, 16);

    expect(enemy.fear).toBeGreaterThan(45);
    expect(enemy.phaseTimerMs).toBeGreaterThanOrEqual(1200);
  });
});
