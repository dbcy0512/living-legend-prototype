import type { Direction } from '../input/actions';
import { assetKeys } from '../assets/manifest';
import type { CharacterActionPose, CharacterModelState } from './characterModel';
import { canEquipmentFitCharacter, type EquipmentItemId, type EquipmentSlot, type EquipmentState } from './equipment';

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
  fitStatus: 'ready' | 'empty' | 'blocked-body-stage';
  blockedReason?: string;
};

export type PaperDollResolveContext = {
  model: CharacterModelState;
  facing: Direction;
  coldPressure: number;
  action: CharacterActionPose;
};

export const getStarterChildPaperDollLayers = (
  equipment: EquipmentState,
  context: PaperDollResolveContext
): readonly PaperDollLayer[] => [
  createStaticLayer('feet', 'feet', equipment.feet, context),
  createStaticLayer('body', 'body', equipment.body, context),
  createStaticLayer('hands', 'hands', equipment.hands, context),
  createStaticLayer('back', 'back', equipment.back, context),
  createStaticLayer('tool', 'tool', equipment.tool, context),
  createHeldMainHandLayer(equipment, context),
  createStaticLayer('offHand', 'offHand', equipment.offHand, context),
  createStaticLayer('head', 'head', equipment.head, context)
];

const createStaticLayer = (
  id: PaperDollLayerId,
  slot: EquipmentSlot,
  itemId: EquipmentItemId,
  context: PaperDollResolveContext
): PaperDollLayer => {
  const fitStatus = getLayerFitStatus(itemId, slot, context);

  return {
    id,
    slot,
    itemId,
    visible: false,
    drawOffset: { x: 0, y: 0 },
    scale: 1,
    angle: 0,
    depthOffset: 0,
    ...fitStatus
  };
};

const createHeldMainHandLayer = (
  equipment: EquipmentState,
  context: PaperDollResolveContext
): PaperDollLayer => {
  const fitStatus = getLayerFitStatus(equipment.mainHand, 'mainHand', context);
  const textureKey = getMainHandTextureKey(equipment.mainHand);
  const baseLayer: PaperDollLayer = {
    id: 'mainHand',
    slot: 'mainHand',
    itemId: equipment.mainHand,
    visible: fitStatus.fitStatus === 'ready' && textureKey !== undefined,
    textureKey,
    drawOffset: { x: 0, y: 0 },
    scale: 0.78 - context.coldPressure * 0.04,
    angle: 0,
    depthOffset: 0.01,
    ...fitStatus
  };

  switch (context.facing) {
    case 'north':
      return {
        ...baseLayer,
        drawOffset: { x: -11, y: 2 + context.coldPressure * 2 },
        angle: -118,
        depthOffset: -0.01
      };
    case 'south':
      return {
        ...baseLayer,
        drawOffset: { x: 12, y: 3 + context.coldPressure * 2 },
        angle: 34,
        depthOffset: 0.01
      };
    case 'west':
      return {
        ...baseLayer,
        drawOffset: { x: -13, y: 1 + context.coldPressure * 2 },
        angle: -34,
        depthOffset: 0.01
      };
    case 'east':
      return {
        ...baseLayer,
        drawOffset: { x: 13, y: 1 + context.coldPressure * 2 },
        angle: 34,
        depthOffset: 0.01
      };
  }
};

const getLayerFitStatus = (
  itemId: EquipmentItemId,
  slot: EquipmentSlot,
  context: PaperDollResolveContext
): Pick<PaperDollLayer, 'fitStatus' | 'blockedReason'> => {
  if (itemId === 'none') {
    return { fitStatus: 'empty' };
  }

  if (!canEquipmentFitCharacter(itemId, slot, context.model.bodyStage)) {
    return {
      fitStatus: 'blocked-body-stage',
      blockedReason: `${itemId} has no generated fit for ${context.model.bodyStage}.`
    };
  }

  return { fitStatus: 'ready' };
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
