import type { Inventory } from '../state';

export type SatchelItemKind = keyof Pick<
  Inventory,
  'twigs' | 'dryGrass' | 'bark' | 'wood' | 'stone' | 'herbs' | 'food' | 'poultices' | 'stoneEdges' | 'branchClubs'
>;

export type SatchelSlot = {
  index: number;
  kind?: SatchelItemKind;
  label: string;
  count: number;
  empty: boolean;
};

export type SatchelSummary = {
  occupiedSlots: number;
  slotCount: number;
  hiddenItemKinds: number;
  full: boolean;
};

export const beginnerSatchelSlotCount = 6;

export const beginnerSatchelItemOrder: { kind: SatchelItemKind; label: string }[] = [
  { kind: 'twigs', label: 'Twigs' },
  { kind: 'dryGrass', label: 'Dry Grass' },
  { kind: 'bark', label: 'Bark' },
  { kind: 'stone', label: 'Stone' },
  { kind: 'wood', label: 'Wood' },
  { kind: 'herbs', label: 'Herbs' },
  { kind: 'food', label: 'Food' },
  { kind: 'poultices', label: 'Poultice' },
  { kind: 'stoneEdges', label: 'Stone Edge' },
  { kind: 'branchClubs', label: 'Branch Club' }
];

export const getCarriedSatchelItems = (inventory: Inventory) =>
  beginnerSatchelItemOrder.filter(({ kind }) => inventory[kind] > 0);

export const getSatchelSlots = (inventory: Inventory): SatchelSlot[] => {
  const carried: SatchelSlot[] = getCarriedSatchelItems(inventory)
    .slice(0, beginnerSatchelSlotCount)
    .map((item, index) => ({
      index,
      kind: item.kind,
      label: item.label,
      count: inventory[item.kind],
      empty: false
    }));

  while (carried.length < beginnerSatchelSlotCount) {
    carried.push({
      index: carried.length,
      label: 'Empty',
      count: 0,
      empty: true
    });
  }

  return carried;
};

export const getSatchelSummary = (inventory: Inventory): SatchelSummary => {
  const carriedItemCount = getCarriedSatchelItems(inventory).length;
  const occupiedSlots = Math.min(carriedItemCount, beginnerSatchelSlotCount);
  return {
    occupiedSlots,
    slotCount: beginnerSatchelSlotCount,
    hiddenItemKinds: Math.max(0, carriedItemCount - beginnerSatchelSlotCount),
    full: occupiedSlots >= beginnerSatchelSlotCount
  };
};

export const canAddSatchelItem = (inventory: Inventory, kind: SatchelItemKind): boolean =>
  inventory[kind] > 0 || getSatchelSummary(inventory).occupiedSlots < beginnerSatchelSlotCount;

export const addSatchelItem = (inventory: Inventory, kind: SatchelItemKind, amount: number): boolean => {
  if (amount <= 0) {
    return true;
  }
  if (!canAddSatchelItem(inventory, kind)) {
    return false;
  }
  inventory[kind] += amount;
  return true;
};
