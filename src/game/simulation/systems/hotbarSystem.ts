import type { GameState } from '../state';
import { clamp } from '../rules/math';
import { useFood } from './inventorySystem';

export type HotbarItemId = 'simple-poultice' | 'food' | 'branch-club' | 'stone-edge';

export type HotbarSlot = {
  index: number;
  itemId?: HotbarItemId;
  label: string;
  count: number;
  locked: boolean;
  ready: boolean;
};

export const getHotbarSlots = (state: GameState): HotbarSlot[] => [
  {
    index: 0,
    itemId: 'simple-poultice',
    label: 'Poultice',
    count: state.inventory.poultices,
    locked: false,
    ready: state.inventory.poultices > 0
  },
  {
    index: 1,
    itemId: 'food',
    label: 'Food',
    count: state.inventory.food,
    locked: false,
    ready: state.inventory.food > 0
  },
  {
    index: 2,
    itemId: 'branch-club',
    label: 'Branch Club',
    count: state.inventory.branchClubs,
    locked: false,
    ready: state.inventory.branchClubs > 0
  },
  {
    index: 3,
    itemId: 'stone-edge',
    label: 'Stone Edge',
    count: state.inventory.stoneEdges,
    locked: false,
    ready: state.inventory.stoneEdges > 0
  },
  {
    index: 4,
    label: 'Locked',
    count: 0,
    locked: true,
    ready: false
  },
  {
    index: 5,
    label: 'Locked',
    count: 0,
    locked: true,
    ready: false
  }
];

export const selectOrUseHotbarSlot = (state: GameState, slotIndex: number): boolean => {
  const slots = getHotbarSlots(state);
  const slot = slots[slotIndex];
  if (!slot) {
    return false;
  }

  state.ui.selectedHotbarSlot = clamp(slotIndex, 0, slots.length - 1);
  if (slot.locked) {
    state.ui.hotbarMessage = 'That space is not ready.';
    return false;
  }
  if (!slot.ready || !slot.itemId) {
    state.ui.hotbarMessage = `${slot.label} is not in the satchel.`;
    return false;
  }

  if (slot.itemId === 'simple-poultice') {
    return usePoultice(state);
  }
  if (slot.itemId === 'food') {
    const used = useFood(state);
    state.ui.hotbarMessage = used ? 'Food eaten.' : 'Food will not help right now.';
    return used;
  }
  if (slot.itemId === 'branch-club') {
    state.evolution.equippedMeleeSeed = 'branch-club';
    state.ui.hotbarMessage = 'Branch Club held.';
    return true;
  }

  state.evolution.equippedMeleeSeed = 'stone-edge';
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
