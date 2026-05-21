import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import { craftRecipe } from '../src/game/simulation/systems/craftingSystem';
import { getHotbarSlots, selectOrUseHotbarSlot } from '../src/game/simulation/systems/hotbarSystem';

describe('hotbar system', () => {
  it('uses a crafted poultice from the first slot instead of healing at craft time', () => {
    const state = createGameState();
    state.player.health = 50;
    state.inventory.herbs = 1;
    state.inventory.bark = 1;

    expect(craftRecipe(state, 'simple-poultice')).toBe(true);
    expect(state.player.health).toBe(50);
    expect(state.inventory.poultices).toBe(1);

    expect(selectOrUseHotbarSlot(state, 0)).toBe(true);
    expect(state.player.health).toBe(74);
    expect(state.inventory.poultices).toBe(0);
    expect(state.ui.hotbarMessage).toBe('Poultice used.');
  });

  it('equips crude melee seeds from their hotbar slots', () => {
    const state = createGameState();
    state.inventory.branchClubs = 1;
    state.inventory.stoneEdges = 1;

    expect(selectOrUseHotbarSlot(state, 2)).toBe(true);
    expect(state.equipment.mainHand).toBe('branch-club');
    expect(state.ui.selectedHotbarSlot).toBe(2);

    expect(selectOrUseHotbarSlot(state, 3)).toBe(true);
    expect(state.equipment.mainHand).toBe('stone-edge');
    expect(state.ui.selectedHotbarSlot).toBe(3);
  });

  it('keeps locked slots visible but unusable', () => {
    const state = createGameState();
    const slots = getHotbarSlots(state);

    expect(slots[4].locked).toBe(true);
    expect(selectOrUseHotbarSlot(state, 4)).toBe(false);
    expect(state.ui.selectedHotbarSlot).toBe(4);
    expect(state.ui.hotbarMessage).toBe('That space is not ready.');
  });
});
