import type { GameState } from '../state';
import { clamp } from '../rules/math';
import { getMobilityFrame, type MobilityFrame } from '../rules/mobility';

export const utilitySlotCooldownMs = 4800;

export type HotbarItemId = 'simple-poultice' | 'branch-club' | 'stone-edge';
export type HotbarSlotRole = 'ability' | 'heal' | 'utility';

export type HotbarSlot = {
  index: number;
  role: HotbarSlotRole;
  roleLabel: string;
  itemId?: HotbarItemId;
  label: string;
  count: number;
  locked: boolean;
  ready: boolean;
  cooldownMs: number;
  cooldownDurationMs: number;
};

export const getHotbarSlots = (state: GameState): HotbarSlot[] => [
  {
    index: 0,
    role: 'ability',
    roleLabel: 'A1',
    itemId: 'branch-club',
    label: 'Branch Club',
    count: state.inventory.branchClubs,
    locked: false,
    ready: state.inventory.branchClubs > 0,
    cooldownMs: 0,
    cooldownDurationMs: 0
  },
  {
    index: 1,
    role: 'ability',
    roleLabel: 'A2',
    itemId: 'stone-edge',
    label: 'Stone Edge',
    count: state.inventory.stoneEdges,
    locked: false,
    ready: state.inventory.stoneEdges > 0,
    cooldownMs: 0,
    cooldownDurationMs: 0
  },
  {
    index: 2,
    role: 'ability',
    roleLabel: 'A3',
    label: 'Ability 3',
    count: 0,
    locked: false,
    ready: false,
    cooldownMs: 0,
    cooldownDurationMs: 0
  },
  {
    index: 3,
    role: 'ability',
    roleLabel: 'A4',
    label: 'Ability 4',
    count: 0,
    locked: false,
    ready: false,
    cooldownMs: 0,
    cooldownDurationMs: 0
  },
  {
    index: 4,
    role: 'heal',
    roleLabel: 'HEAL',
    itemId: 'simple-poultice',
    label: 'Poultice',
    count: state.inventory.poultices,
    locked: false,
    ready: state.inventory.poultices > 0,
    cooldownMs: 0,
    cooldownDurationMs: 0
  },
  {
    index: 5,
    role: 'utility',
    roleLabel: 'UTIL',
    label: 'Utility',
    count: 0,
    locked: false,
    ready: state.hotbar.utilityCooldownMs <= 0,
    cooldownMs: state.hotbar.utilityCooldownMs,
    cooldownDurationMs: utilitySlotCooldownMs
  }
];

export const getHotbarMobilityFrame = (state: GameState): MobilityFrame => getMobilityFrame(state);

export const updateHotbar = (state: GameState, deltaMs: number): void => {
  state.hotbar.utilityCooldownMs = Math.max(0, state.hotbar.utilityCooldownMs - deltaMs);
};

export const selectOrUseHotbarSlot = (state: GameState, slotIndex: number): boolean => {
  const slots = getHotbarSlots(state);
  const slot = slots[slotIndex];
  if (!slot) {
    return false;
  }

  state.ui.selectedHotbarSlot = clamp(slotIndex, 0, slots.length - 1);
  state.ui.inventoryMessage = '';
  if (slot.locked) {
    state.ui.hotbarMessage = 'That space is not ready.';
    return false;
  }
  if (slot.role === 'utility') {
    if (slot.cooldownMs > 0) {
      state.ui.hotbarMessage = 'Utility is cooling down.';
      return false;
    }
    state.ui.hotbarMessage = 'No utility move learned.';
    return false;
  }
  if (!slot.itemId && slot.role === 'ability') {
    state.ui.hotbarMessage = `${slot.label} is not learned yet.`;
    return false;
  }
  if (!slot.ready || !slot.itemId) {
    state.ui.hotbarMessage = `${slot.label} is not in the satchel.`;
    return false;
  }

  if (slot.itemId === 'simple-poultice') {
    return usePoultice(state);
  }
  if (slot.itemId === 'branch-club') {
    state.equipment.mainHand = 'branch-club';
    state.ui.hotbarMessage = 'Branch Club held.';
    return true;
  }

  state.equipment.mainHand = 'stone-edge';
  state.ui.hotbarMessage = 'Stone Edge held.';
  return true;
};

export const usePoultice = (state: GameState): boolean => {
  if (state.inventory.poultices <= 0) {
    state.ui.hotbarMessage = 'No poultice ready.';
    return false;
  }
  if (state.player.health >= state.player.maxHealth) {
    state.ui.hotbarMessage = 'No wound needs binding.';
    return false;
  }

  state.inventory.poultices -= 1;
  state.player.health = clamp(state.player.health + 24, 0, state.player.maxHealth);
  state.ui.hotbarMessage = 'Poultice used.';
  return true;
};
