import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { createGameState } from '../src/game/simulation/state';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';

describe('combat system', () => {
  it('moves attack through windup, active, recovery, and idle without scene state', () => {
    const state = createGameState({ includePrototypeEnemies: true });
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
    const state = createGameState({ includePrototypeEnemies: true });
    const actions = idleActions();
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 34;
    enemy.y = state.player.y;
    actions.attack = true;

    updateSimulation(state, actions, 16);
    actions.attack = false;
    advance(state, actions, 120);

    expect(enemy.health).toBeLessThan(enemy.maxHealth);
    expect(state.combat.hitStopMs).toBeGreaterThan(0);
    expect(state.combat.lastHitFlashMs).toBeGreaterThan(0);
  });

  it('uses the branch club as the first blade-line seed with wider reach', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const actions = idleActions();
    const enemy = state.enemies[0];
    state.equipment.mainHand = 'branch-club';
    state.player.facing = 'east';
    enemy.x = state.player.x + 86;
    enemy.y = state.player.y + 40;
    actions.attack = true;

    updateSimulation(state, actions, 16);
    actions.attack = false;
    advance(state, actions, 128);

    expect(enemy.health).toBe(enemy.maxHealth - 17);
    expect(state.behaviorMemory.combat.branchClubAttacks).toBe(1);
    expect(state.evolution.bladeSeedAffinity).toBe(1);
    expect(state.evolution.axeSeedAffinity).toBe(0);
  });

  it('uses the stone edge as the first axe-line seed with a heavier narrow chop', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    const actions = idleActions();
    const enemy = state.enemies[0];
    state.equipment.mainHand = 'stone-edge';
    state.player.facing = 'east';
    enemy.x = state.player.x + 64;
    enemy.y = state.player.y + 8;
    actions.attack = true;

    updateSimulation(state, actions, 16);
    actions.attack = false;
    advance(state, actions, 144);

    expect(enemy.health).toBe(enemy.maxHealth - 22);
    expect(state.player.stamina).toBeLessThan(78);
    expect(state.behaviorMemory.combat.stoneEdgeAttacks).toBe(1);
    expect(state.evolution.axeSeedAffinity).toBe(1);
    expect(state.evolution.bladeSeedAffinity).toBe(0);
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
