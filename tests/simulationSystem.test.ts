import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { startingArea } from '../src/game/content/maps/startingArea';
import { createGameState } from '../src/game/simulation/state';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';

describe('simulation status', () => {
  it('restarts from a terminal state when restart is requested', () => {
    const state = createGameState();
    const actions = idleActions();
    state.world.status = 'lost';
    state.player.health = 0;
    state.inventory.food = 4;
    state.progression.stations.basicWorkbenchBuilt = true;
    state.progression.exposedPathSteps.blade = 1;
    state.equipment.mainHand = 'stone-edge';
    state.hotbar.utilityCooldownMs = 1200;
    actions.restart = true;

    updateSimulation(state, actions, 16);

    expect(state.world.status).toBe('playing');
    expect(state.player.health).toBe(state.player.maxHealth);
    expect(state.inventory.food).toBe(0);
    expect(state.progression.stations.basicWorkbenchBuilt).toBe(false);
    expect(state.progression.exposedPathSteps.blade).toBe(0);
    expect(state.equipment.mainHand).toBe('bare-hands');
    expect(state.equipment.tool).toBe('none');
    expect(state.equipment.body).toBe('worn-cloth');
    expect(state.equipment.back).toBe('none');
    expect(state.equipment.offHand).toBe('none');
    expect(state.hotbar.utilityCooldownMs).toBe(0);
  });

  it('preserves the active ecosystem seed when restarting', () => {
    const state = createGameState({ ecosystemSeed: 'restart-seed' });
    const actions = idleActions();
    const seededBranchIds = state.resources
      .filter((resource) => resource.source?.type === 'tree-dependent')
      .map((resource) => resource.id);
    state.world.status = 'lost';
    state.resources.splice(0, state.resources.length);
    actions.restart = true;

    updateSimulation(state, actions, 16);

    expect(state.ecosystem.seed).toBe('restart-seed');
    expect(
      state.resources
        .filter((resource) => resource.source?.type === 'tree-dependent')
        .map((resource) => resource.id)
    ).toEqual(seededBranchIds);
  });

  it('toggles pause and stops simulation updates while paused', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.pause = true;

    updateSimulation(state, actions, 16);

    const pausedTime = state.world.timeOfDay;
    const pausedWind = state.world.windPhase;
    expect(state.world.paused).toBe(true);

    const movement = idleActions();
    movement.moveX = 1;
    updateSimulation(state, movement, 1000);

    expect(state.world.timeOfDay).toBe(pausedTime);
    expect(state.world.windPhase).toBe(pausedWind);
    expect(state.player.x).toBe(startingArea.playerStart.x);
  });

  it('resumes simulation when pause is toggled again', () => {
    const state = createGameState();
    const pause = idleActions();
    pause.pause = true;

    updateSimulation(state, pause, 16);
    updateSimulation(state, pause, 16);

    expect(state.world.paused).toBe(false);

    const timeBefore = state.world.timeOfDay;
    updateSimulation(state, idleActions(), 1000);

    expect(state.world.timeOfDay).toBeGreaterThan(timeBefore);
  });

  it('toggles beginner inventory and crafting panels through simulation state', () => {
    const state = createGameState();
    const openInventory = idleActions();
    openInventory.toggleInventory = true;
    const openCrafting = idleActions();
    openCrafting.toggleCrafting = true;

    updateSimulation(state, openInventory, 16);
    updateSimulation(state, openCrafting, 16);

    expect(state.ui.inventoryOpen).toBe(true);
    expect(state.ui.craftingOpen).toBe(true);
  });

  it('opens crafting as a subset of inventory', () => {
    const state = createGameState();
    state.ui.inventoryOpen = true;
    const actions = idleActions();
    actions.toggleCrafting = true;

    updateSimulation(state, actions, 16);

    expect(state.ui.inventoryOpen).toBe(true);
    expect(state.ui.craftingOpen).toBe(true);
  });

  it('does not open crafting without the inventory parent', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.toggleCrafting = true;

    updateSimulation(state, actions, 16);

    expect(state.ui.inventoryOpen).toBe(false);
    expect(state.ui.craftingOpen).toBe(false);
  });

  it('closes crafting when the inventory parent closes', () => {
    const state = createGameState();
    state.ui.inventoryOpen = true;
    state.ui.craftingOpen = true;
    const actions = idleActions();
    actions.toggleInventory = true;

    updateSimulation(state, actions, 16);

    expect(state.ui.inventoryOpen).toBe(false);
    expect(state.ui.craftingOpen).toBe(false);
  });

  it('ticks utility hotbar cooldown only while simulation is running', () => {
    const state = createGameState();
    state.hotbar.utilityCooldownMs = 500;

    updateSimulation(state, idleActions(), 100);

    expect(state.hotbar.utilityCooldownMs).toBe(450);

    const pause = idleActions();
    pause.pause = true;
    updateSimulation(state, pause, 16);
    updateSimulation(state, idleActions(), 100);

    expect(state.hotbar.utilityCooldownMs).toBe(450);
  });
});
