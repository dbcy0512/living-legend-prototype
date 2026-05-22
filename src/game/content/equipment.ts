import type { MeleeSeed } from './meleeSeeds';

export type EquipmentSlot =
  | 'head'
  | 'body'
  | 'hands'
  | 'back'
  | 'mainHand'
  | 'offHand'
  | 'tool'
  | 'feet';

export type HeadEquipment = 'none';
export type BodyEquipment = 'worn-cloth';
export type HandsEquipment = 'bare-hands-wraps';
export type BackEquipment = 'none';
export type OffHandEquipment = 'none';
export type ToolEquipment = 'none';
export type FeetEquipment = 'bare-feet';

export type EquipmentItemId =
  | MeleeSeed
  | HeadEquipment
  | BodyEquipment
  | HandsEquipment
  | BackEquipment
  | OffHandEquipment
  | ToolEquipment
  | FeetEquipment;

export type EquipmentState = {
  head: HeadEquipment;
  body: BodyEquipment;
  hands: HandsEquipment;
  back: BackEquipment;
  mainHand: MeleeSeed;
  offHand: OffHandEquipment;
  tool: ToolEquipment;
  feet: FeetEquipment;
};

export type EquipmentSlotDefinition = {
  slot: EquipmentSlot;
  label: string;
  accepts: readonly EquipmentItemId[];
  paperDollLayer: number;
  changesSilhouette: boolean;
  designIntent: string;
};

export const starterEquipmentSlots = [
  {
    slot: 'feet',
    label: 'Feet',
    accepts: ['bare-feet'],
    paperDollLayer: 0,
    changesSilhouette: false,
    designIntent: 'Ground contact and future footwear visuals live below the body layer.'
  },
  {
    slot: 'body',
    label: 'Body',
    accepts: ['worn-cloth'],
    paperDollLayer: 10,
    changesSilhouette: true,
    designIntent: 'Primary outfit shape; future armor and clothing should change the child silhouette here.'
  },
  {
    slot: 'hands',
    label: 'Hands',
    accepts: ['bare-hands-wraps'],
    paperDollLayer: 20,
    changesSilhouette: false,
    designIntent: 'Hand wraps, gloves, and grip details sit over body but under active held tools.'
  },
  {
    slot: 'back',
    label: 'Back',
    accepts: ['none'],
    paperDollLayer: 25,
    changesSilhouette: true,
    designIntent: 'Bedrolls, packs, cloaks, and carried tools will visibly change the back profile.'
  },
  {
    slot: 'mainHand',
    label: 'Main Hand',
    accepts: ['bare-hands', 'branch-club', 'stone-edge'],
    paperDollLayer: 35,
    changesSilhouette: true,
    designIntent: 'Weapon seeds attach here and define the first combat evolution read.'
  },
  {
    slot: 'offHand',
    label: 'Off Hand',
    accepts: ['none'],
    paperDollLayer: 34,
    changesSilhouette: true,
    designIntent: 'Future shields, torches, containers, and tools can occupy a second carried silhouette.'
  },
  {
    slot: 'tool',
    label: 'Tool',
    accepts: ['none'],
    paperDollLayer: 30,
    changesSilhouette: true,
    designIntent: 'Harvesting and survival tools can be drawn without becoming the active weapon.'
  },
  {
    slot: 'head',
    label: 'Head',
    accepts: ['none'],
    paperDollLayer: 40,
    changesSilhouette: true,
    designIntent: 'Future hoods, hair states, masks, and weather protection should sit above body animation.'
  }
] as const satisfies readonly EquipmentSlotDefinition[];

export const createStarterEquipmentState = (): EquipmentState => ({
  head: 'none',
  body: 'worn-cloth',
  hands: 'bare-hands-wraps',
  back: 'none',
  mainHand: 'bare-hands',
  offHand: 'none',
  tool: 'none',
  feet: 'bare-feet'
});

export const getStarterEquipmentSlots = (): readonly EquipmentSlotDefinition[] => starterEquipmentSlots;
