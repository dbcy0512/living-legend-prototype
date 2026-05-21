import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import { craftRecipe } from '../src/game/simulation/systems/craftingSystem';
import {
  getHotbarMobilityFrame,
  getHotbarSlots,
  getHotbarWeaponFrame,
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
    expect(slots[0].abilityId).toBe('unarmed-survival-swipe');
    expect(slots[0].linkedWeapon).toBe('bare-hands');
    expect(slots[0].animationKey).toBe('combat.unarmed.survivalSwipe');
    expect(slots[0].damage).toBeGreaterThan(0);
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

  it('keeps equipped weapons in a separate fire-bordered frame', () => {
    const state = createGameState();
    state.equipment.mainHand = 'stone-edge';
    state.inventory.stoneEdges = 1;

    const weaponFrame = getHotbarWeaponFrame(state);
    const slots = getHotbarSlots(state);

    expect(weaponFrame.weapon).toBe('stone-edge');
    expect(weaponFrame.iconItemId).toBe('stone-edge');
    expect(weaponFrame.equipped).toBe(true);
    expect(slots[0].abilityId).toBe('stone-edge-cleaving-cut');
    expect(slots[0].linkedWeapon).toBe('stone-edge');
    expect(slots[0].statusTags).toContain('bleed-seed');
  });

  it('keeps number one as the weapon-linked ability foundation', () => {
    const state = createGameState();
    state.equipment.mainHand = 'stone-edge';

    expect(selectOrUseHotbarSlot(state, 0)).toBe(false);
    expect(state.equipment.mainHand).toBe('stone-edge');
    expect(state.ui.selectedHotbarSlot).toBe(0);
    expect(state.ui.hotbarMessage).toBe('Cleaving Cut is forming.');
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

  it('exposes Shift mobility as a separate evolution-monitored frame', () => {
    const state = createGameState();
    state.combat.rollCooldownMs = 210;

    const baseline = getHotbarMobilityFrame(state);

    expect(baseline.keyLabel).toBe('Shift');
    expect(baseline.label).toBe('Dodge Roll');
    expect(baseline.roleLabel).toBe('MOB');
    expect(baseline.ready).toBe(false);
    expect(baseline.cooldownMs).toBe(210);

    state.combat.rollCooldownMs = 0;
    state.evolution.cleanerRoll = true;
    const evolved = getHotbarMobilityFrame(state);

    expect(evolved.label).toBe('Cleaner Roll');
    expect(evolved.roleLabel).toBe('MOB+');
    expect(evolved.staminaCost).toBeLessThan(baseline.staminaCost);
    expect(evolved.cooldownDurationMs).toBeLessThan(baseline.cooldownDurationMs);
    expect(evolved.ready).toBe(true);
  });
});
