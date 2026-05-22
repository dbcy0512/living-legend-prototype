import type { Direction } from '../input/actions';
import { assetKeys } from '../assets/manifest';
import type { EquipmentItemId, EquipmentSlot, EquipmentState } from './equipment';

export type PaperDollLayerId = 'body' | 'hands' | 'back' | 'mainHand' | 'offHand' | 'tool' | 'head' | 'feet';

export type PaperDollLayer = {
  id: PaperDollLayerId;
  slot: EquipmentSlot;
  itemId: EquipmentItemId;
  visible: boolean;
  textureKey?: string;
  drawOffset: {
    x: number;
    y: number;
  };
  scale: number;
  angle: number;
  depthOffset: number;
};

export const getStarterChildPaperDollLayers = (
  equipment: EquipmentState,
  facing: Direction,
  coldPressure: number
): readonly PaperDollLayer[] => [
  createStaticLayer('feet', 'feet', equipment.feet),
  createStaticLayer('body', 'body', equipment.body),
  createStaticLayer('hands', 'hands', equipment.hands),
  createStaticLayer('back', 'back', equipment.back),
  createStaticLayer('tool', 'tool', equipment.tool),
  createHeldMainHandLayer(equipment, facing, coldPressure),
  createStaticLayer('offHand', 'offHand', equipment.offHand),
  createStaticLayer('head', 'head', equipment.head)
];

const createStaticLayer = (
  id: PaperDollLayerId,
  slot: EquipmentSlot,
  itemId: EquipmentItemId
): PaperDollLayer => ({
  id,
  slot,
  itemId,
  visible: false,
  drawOffset: { x: 0, y: 0 },
  scale: 1,
  angle: 0,
  depthOffset: 0
});

const createHeldMainHandLayer = (
  equipment: EquipmentState,
  facing: Direction,
  coldPressure: number
): PaperDollLayer => {
  const textureKey = getMainHandTextureKey(equipment.mainHand);
  const baseLayer: PaperDollLayer = {
    id: 'mainHand',
    slot: 'mainHand',
    itemId: equipment.mainHand,
    visible: textureKey !== undefined,
    textureKey,
    drawOffset: { x: 0, y: 0 },
    scale: 0.78 - coldPressure * 0.04,
    angle: 0,
    depthOffset: 0.01
  };

  switch (facing) {
    case 'north':
      return {
        ...baseLayer,
        drawOffset: { x: -11, y: 2 + coldPressure * 2 },
        angle: -118,
        depthOffset: -0.01
      };
    case 'south':
      return {
        ...baseLayer,
        drawOffset: { x: 12, y: 3 + coldPressure * 2 },
        angle: 34,
        depthOffset: 0.01
      };
    case 'west':
      return {
        ...baseLayer,
        drawOffset: { x: -13, y: 1 + coldPressure * 2 },
        angle: -34,
        depthOffset: 0.01
      };
    case 'east':
      return {
        ...baseLayer,
        drawOffset: { x: 13, y: 1 + coldPressure * 2 },
        angle: 34,
        depthOffset: 0.01
      };
  }
};

const getMainHandTextureKey = (mainHand: EquipmentState['mainHand']): string | undefined => {
  switch (mainHand) {
    case 'branch-club':
      return assetKeys.playerHeldBranchClub;
    case 'stone-edge':
      return assetKeys.playerHeldStoneEdge;
    case 'bare-hands':
      return undefined;
  }
};
