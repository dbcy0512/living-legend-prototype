import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { createGameState } from '../src/game/simulation/state';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';

describe('weapon ability foundation', () => {
  it('starts the equipped weapon ability from hotbar slot one', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.equipment.mainHand = 'branch-club';
    state.inventory.branchClubs = 1;
    const actions = idleActions();
    actions.hotbarSlot = 0;

    updateSimulation(state, actions, 16);

    expect(state.ability.activeId).toBe('branch-club-heavy-swing');
    expect(state.ability.animationKey).toBe('combat.branchClub.heavySwing');
    expect(state.ability.statusTags).toContain('stagger');
    expect(state.combat.phase).toBe('windup');
    expect(state.player.stamina).toBeLessThan(state.player.maxStamina);
    expect(state.behaviorMemory.abilities.used['branch-club-heavy-swing']).toBe(1);
    expect(state.evolution.bladeSeedAffinity).toBe(1);
  });

  it('applies weapon ability damage once during the active phase', () => {
    const state = createGameState({ includePrototypeEnemies: true });
    state.equipment.mainHand = 'stone-edge';
    state.inventory.stoneEdges = 1;
    state.player.facing = 'east';
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 68;
    enemy.y = state.player.y + 5;
    const actions = idleActions();
    actions.hotbarSlot = 0;

    updateSimulation(state, actions, 16);
    actions.hotbarSlot = undefined;
    advance(state, actions, 180);
    const healthAfterHit = enemy.health;
    advance(state, actions, 40);

    expect(healthAfterHit).toBeLessThan(enemy.maxHealth);
    expect(enemy.health).toBe(healthAfterHit);
    expect(state.behaviorMemory.abilities.hits['stone-edge-cleaving-cut']).toBe(1);
    expect(state.combat.lastHitFlashMs).toBeGreaterThan(0);
  });

  it('blocks repeated weapon ability use while it is cooling down', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.hotbarSlot = 0;

    updateSimulation(state, actions, 16);
    actions.hotbarSlot = 0;
    updateSimulation(state, actions, 16);

    expect(state.behaviorMemory.abilities.used['unarmed-survival-swipe']).toBe(1);
    expect(state.ui.hotbarMessage).toBe('Survival Swipe is not ready.');
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
