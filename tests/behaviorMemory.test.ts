import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { createGameState } from '../src/game/simulation/state';
import { updateEnemies } from '../src/game/simulation/systems/enemySystem';
import { updateInventory } from '../src/game/simulation/systems/inventorySystem';
import { updatePlayer } from '../src/game/simulation/systems/playerSystem';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';
import { updateWorld } from '../src/game/simulation/systems/worldSystem';
import { updateEvolution } from '../src/game/simulation/rules/evolutionRules';

describe('behavior memory', () => {
  it('records gathered item kinds', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources[0];
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.behaviorMemory.tools.gathered[resource.kind]).toBe(1);
  });

  it('records first fire rebuild', () => {
    const state = createGameState();
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    const actions = idleActions();
    actions.craft = true;

    updateInventory(state, actions, 16);

    expect(state.behaviorMemory.fire.firstFireRebuilt).toBe(true);
  });

  it('records dodge use', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.dodge = true;

    updatePlayer(state, actions, 16);

    expect(state.behaviorMemory.combat.dodgesUsed).toBe(1);
  });

  it('records body collapse on respawn', () => {
    const state = createGameState();
    state.player.health = 0;

    updateWorld(state, 16);

    expect(state.behaviorMemory.body.collapses).toBe(1);
  });

  it('records creature lunge faced and avoided', () => {
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

    expect(state.behaviorMemory.creatures.wolfLungesFaced).toBe(1);
    expect(state.behaviorMemory.creatures.wolfLungesAvoided).toBe(1);
    expect(state.behaviorMemory.combat.wolfLungesDodged).toBe(1);
  });

  it('unlocks cleaner roll from repeated avoided lunges and dodge behavior', () => {
    const state = createGameState();
    state.behaviorMemory.combat.wolfLungesDodged = 3;
    state.behaviorMemory.combat.dodgesUsed = 3;
    state.behaviorMemory.combat.hitsTaken = 1;

    updateEvolution(state);

    expect(state.evolution.cleanerRoll).toBe(true);
  });

  it('cleaner roll lowers stamina cost and cooldown', () => {
    const baseline = createGameState();
    const evolved = createGameState();
    baseline.player.stamina = 80;
    evolved.player.stamina = 80;
    evolved.evolution.cleanerRoll = true;
    const baselineActions = idleActions();
    const evolvedActions = idleActions();
    baselineActions.dodge = true;
    evolvedActions.dodge = true;

    updateSimulation(baseline, baselineActions, 16);
    updateSimulation(evolved, evolvedActions, 16);

    expect(evolved.player.stamina).toBeGreaterThan(baseline.player.stamina);
    expect(evolved.combat.rollCooldownMs).toBeLessThan(baseline.combat.rollCooldownMs);
  });
});
