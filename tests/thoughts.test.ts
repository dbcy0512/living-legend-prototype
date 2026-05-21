import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { createGameState } from '../src/game/simulation/state';
import { getGatherThought, setPlayerThought } from '../src/game/simulation/rules/thoughts';
import { updateInventory } from '../src/game/simulation/systems/inventorySystem';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';

describe('player thoughts', () => {
  it('uses subtle gather thoughts instead of literal pickup logs', () => {
    expect(getGatherThought('dryGrass')).toBe('It might catch.');
    expect(getGatherThought('twigs')).not.toContain('gathered');
  });

  it('shows a thought when the player gathers a resource', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources.find((node) => node.id === 'dry-grass-handful');
    if (!resource) {
      throw new Error('dry grass fixture missing');
    }
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.ui.thoughtMessage).toBe('It might catch.');
    expect(state.ui.thoughtTimerMs).toBeGreaterThan(0);
  });

  it('keeps inventory-full direct because it is a hard UI boundary', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources.find((node) => node.kind === 'food');
    if (!resource) {
      throw new Error('food resource fixture missing');
    }
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    state.inventory.wood = 1;
    state.inventory.herbs = 1;
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.ui.inventoryMessage).toBe('No room in the satchel.');
    expect(state.ui.thoughtMessage).toBe('No room in the satchel.');
  });

  it('expires thoughts through simulation time', () => {
    const state = createGameState();
    setPlayerThought(state, 'A small clue.', 40);

    updateSimulation(state, idleActions(), 20);
    expect(state.ui.thoughtMessage).toBe('A small clue.');

    updateSimulation(state, idleActions(), 40);
    expect(state.ui.thoughtMessage).toBe('');
    expect(state.ui.thoughtTimerMs).toBe(0);
  });
});
