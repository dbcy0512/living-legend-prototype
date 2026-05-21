import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import { craftRecipe } from '../src/game/simulation/systems/craftingSystem';
import {
  getHotbarSlots,
  selectOrUseHotbarSlot,
  updateHotbar,
  utilitySlotCooldownMs
} from '../src/game/simulation/systems/hotbarSystem';

describe('hotbar system', () => {
  it('reserves four ability slots, one heal slot, and one utility slot', () => {
    const state = createGameState();
    const slots = getHotbarSlots(state);

    expect(slots.map((slot) => slot.role)).toEqual(['ability', 'ability', 'ability', 'ability', 'heal', 'utility']);
    expect(slots.map((slot) => slot.roleLabel)).toEqual(['A1', 'A2', 'A3', 'A4', 'HEAL', 'UTIL']);
    expect(slots[5].cooldownDurationMs).toBe(utilitySlotCooldownMs);
  });

  it('uses a crafted poultice from the heal slot instead of healing at craft time', () => {
    const state = createGameState();
    state.player.health = 50;
    state.inventory.herbs = 1;
    state.inventory.bark = 1;

    expect(craftRecipe(state, 'simple-poultice')).toBe(true);
    expect(state.player.health).toBe(50);
    expect(state.inventory.poultices).toBe(1);

    expect(selectOrUseHotbarSlot(state, 4)).toBe(true);
    expect(state.player.health).toBe(74);
    expect(state.inventory.poultices).toBe(0);
    expect(state.ui.hotbarMessage).toBe('Poultice used.');
  });

  it('equips crude melee seeds from their hotbar slots', () => {
    const state = createGameState();
    state.inventory.branchClubs = 1;
    state.inventory.stoneEdges = 1;

    expect(selectOrUseHotbarSlot(state, 0)).toBe(true);
    expect(state.equipment.mainHand).toBe('branch-club');
    expect(state.ui.selectedHotbarSlot).toBe(0);

    expect(selectOrUseHotbarSlot(state, 1)).toBe(true);
    expect(state.equipment.mainHand).toBe('stone-edge');
    expect(state.ui.selectedHotbarSlot).toBe(1);
  });

  it('keeps unlearned ability slots visible but unusable', () => {
    const state = createGameState();

    expect(selectOrUseHotbarSlot(state, 2)).toBe(false);
    expect(state.ui.selectedHotbarSlot).toBe(2);
    expect(state.ui.hotbarMessage).toBe('Ability 3 is not learned yet.');
  });

  it('tracks the dedicated utility slot cooldown separately from combat', () => {
    const state = createGameState();
    state.hotbar.utilityCooldownMs = utilitySlotCooldownMs;

    expect(getHotbarSlots(state)[5].ready).toBe(false);
    expect(selectOrUseHotbarSlot(state, 5)).toBe(false);
    expect(state.ui.hotbarMessage).toBe('Utility is cooling down.');

    updateHotbar(state, 1000);

    expect(state.hotbar.utilityCooldownMs).toBe(utilitySlotCooldownMs - 1000);
  });
});
