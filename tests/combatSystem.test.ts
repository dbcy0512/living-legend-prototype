import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { createGameState } from '../src/game/simulation/state';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';

describe('combat system', () => {
  it('moves attack through windup, active, recovery, and idle without scene state', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.attack = true;

    updateSimulation(state, actions, 16);
    expect(state.combat.phase).toBe('windup');
    expect(state.player.stamina).toBeLessThan(100);

    actions.attack = false;
    advance(state, actions, 120);
    expect(state.combat.phase).toBe('active');

    advance(state, actions, 150);
    expect(state.combat.phase).toBe('recovery');

    advance(state, actions, 220);
    expect(state.combat.phase).toBe('idle');
  });

  it('records hit feedback when an attack connects', () => {
    const state = createGameState();
    const actions = idleActions();
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 34;
    enemy.y = state.player.y;
    actions.attack = true;

    updateSimulation(state, actions, 16);
    actions.attack = false;
    advance(state, actions, 120);

    expect(enemy.health).toBeLessThan(35);
    expect(state.combat.hitStopMs).toBeGreaterThan(0);
    expect(state.combat.lastHitFlashMs).toBeGreaterThan(0);
  });
});

const advance = (
  state: ReturnType<typeof createGameState>,
  actions: ReturnType<typeof idleActions>,
  totalMs: number
): void => {
  let elapsed = 0;
  while (elapsed < totalMs) {
    const step = Math.min(16, totalMs - elapsed);
    updateSimulation(state, actions, step);
    elapsed += step;
  }
};
