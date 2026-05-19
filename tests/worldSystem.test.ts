import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import {
  getDawnDuskGlow,
  getLocalNightPressure,
  getNightPressure,
  updateWorld
} from '../src/game/simulation/systems/worldSystem';

describe('living world pressure', () => {
  it('raises pressure at night and lowers it during safe daylight', () => {
    expect(getNightPressure(0.9)).toBe(1);
    expect(getNightPressure(0.45)).toBe(0);
  });

  it('raises glow at dawn and dusk without affecting midday', () => {
    expect(getDawnDuskGlow(0.31)).toBe(1);
    expect(getDawnDuskGlow(0.68)).toBe(1);
    expect(getDawnDuskGlow(0.5)).toBe(0);
  });

  it('advances world pulse and drains hunger through simulation state', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    const hunger = state.player.hunger;

    updateWorld(state, 1000);

    expect(state.world.windPhase).toBeGreaterThan(0);
    expect(state.player.hunger).toBeLessThan(hunger);
  });

  it('accumulates ecosystem windfall pressure from world pressure', () => {
    const state = createGameState();
    state.world.timeOfDay = 0.9;
    const pressure = state.ecosystem.windfallPressure;

    updateWorld(state, 1000);

    expect(state.ecosystem.windfallPressure).toBeGreaterThan(pressure);
  });

  it('reduces local night pressure when the player is inside an active campfire radius', () => {
    const state = createGameState();
    state.campfires.push({
      id: 'campfire-test',
      x: state.player.x,
      y: state.player.y,
      radius: 150,
      fuelMs: 1000
    });

    expect(getLocalNightPressure(state, 1)).toBeLessThan(1);
  });

  it('warms the player near the first flame and then opens the survival loop', () => {
    const state = createGameState();
    state.world.openingStage = 'first-flame';
    state.world.cold = 20;
    state.campfires[0].fuelMs = 10000;

    updateWorld(state, 1000);

    expect(state.world.cold).toBeLessThan(20);
    expect(state.world.openingStage).toBe('open');
  });

  it('slowly damages health when cold exposure is ignored', () => {
    const state = createGameState();
    state.world.openingStage = 'cold';
    state.world.cold = 100;
    const health = state.player.health;

    updateWorld(state, 1000);

    expect(state.player.health).toBeLessThan(health);
  });

  it('respawns the player at the sleeping spot when health reaches zero', () => {
    const state = createGameState();
    state.player.health = 0;
    state.player.x = 900;
    state.player.y = 180;

    updateWorld(state, 16);

    expect(state.world.status).toBe('playing');
    expect(state.world.respawns).toBe(1);
    expect(state.player.x).toBe(state.respawnPoint.x);
    expect(state.player.y).toBe(state.respawnPoint.y);
    expect(state.player.health).toBeGreaterThan(0);
    expect(state.player.invulnerableMs).toBeGreaterThan(0);
  });

  it('regenerates depleted tree-dependent resources at the next dawn', () => {
    const state = createGameState();
    const resource = state.resources.find((node) => node.source?.type === 'tree-dependent');
    if (!resource) {
      throw new Error('tree-dependent resource fixture missing');
    }
    resource.amount = 0;
    resource.respawnMs = Number.POSITIVE_INFINITY;
    state.world.day = 2;
    state.world.timeOfDay = 0.279;
    state.ecosystem.lastRegenerationDay = 1;
    state.ecosystem.windfallPressure = 0.5;

    updateWorld(state, 250);

    expect(resource.amount).toBe(1);
    expect(resource.respawnMs).toBe(0);
    expect(state.ecosystem.lastRegenerationDay).toBe(2);
    expect(state.ecosystem.lastRegenerationPressure).toBeGreaterThanOrEqual(0.5);
    expect(state.ecosystem.windfallPressure).toBeLessThan(0.5);
  });

  it('regenerates depleted zone-dependent ecosystem resources at the next dawn', () => {
    const state = createGameState();
    const resource = state.resources.find((node) => node.source?.type === 'zone-dependent');
    if (!resource) {
      throw new Error('zone-dependent resource fixture missing');
    }
    resource.amount = 0;
    resource.respawnMs = Number.POSITIVE_INFINITY;
    state.world.day = 2;
    state.world.timeOfDay = 0.279;
    state.ecosystem.lastRegenerationDay = 1;
    state.ecosystem.windfallPressure = 0.5;

    updateWorld(state, 250);

    expect(resource.kind).toBe('herbs');
    expect(resource.amount).toBe(1);
    expect(resource.respawnMs).toBe(0);
    expect(state.ecosystem.lastRegenerationDay).toBe(2);
  });

  it('waits to regenerate ecosystem resources until enough world pressure has accumulated', () => {
    const state = createGameState();
    const resource = state.resources.find((node) => node.source?.type === 'tree-dependent');
    if (!resource) {
      throw new Error('tree-dependent resource fixture missing');
    }
    resource.amount = 0;
    state.world.day = 2;
    state.world.timeOfDay = 0.28;
    state.ecosystem.lastRegenerationDay = 1;
    state.ecosystem.windfallPressure = 0.05;

    updateWorld(state, 16);

    expect(resource.amount).toBe(0);
    expect(state.ecosystem.lastRegenerationDay).toBe(1);
  });

  it('marks the run won after surviving into the next dawn window', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    state.world.day = 2;
    state.world.timeOfDay = 0.3;

    updateWorld(state, 16);

    expect(state.world.status).toBe('won');
  });
});
