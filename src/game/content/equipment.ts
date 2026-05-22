import type { MeleeSeed } from './meleeSeeds';
import type { CharacterActionPose, CharacterBodyStageId, CharacterSocketSetId } from './characterModel';

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

export type EquipmentGeneratedVisualStatus = 'runtime-ready' | 'needs-pixellab-pass' | 'not-planned-for-stage';

export type EquipmentGeneratedVisualRequirement = {
  bodyStage: CharacterBodyStageId;
  socketSet: CharacterSocketSetId;
  actions: readonly CharacterActionPose[];
  status: EquipmentGeneratedVisualStatus;
  designIntent: string;
};

export type EquipmentFitProfile = {
  itemId: EquipmentItemId;
  slot: EquipmentSlot;
  compatibleBodyStages: readonly CharacterBodyStageId[];
  socketSet: CharacterSocketSetId;
  changesSilhouette: boolean;
  visualRequirements: readonly EquipmentGeneratedVisualRequirement[];
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

const starterEquipmentFitProfiles = [
  {
    itemId: 'bare-feet',
    slot: 'feet',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: false,
    visualRequirements: [],
    designIntent: 'Default contact state for the child body; future footwear must be generated against the foot anchor.'
  },
  {
    itemId: 'worn-cloth',
    slot: 'body',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: true,
    visualRequirements: [],
    designIntent: 'The starting clothing belongs to the starter-child body stage and should not be reused on evolved bodies.'
  },
  {
    itemId: 'bare-hands-wraps',
    slot: 'hands',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: false,
    visualRequirements: [],
    designIntent: 'Grip and hand-wrap details must stay aligned with the child hand sockets.'
  },
  {
    itemId: 'bare-hands',
    slot: 'mainHand',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: false,
    visualRequirements: [
      {
        bodyStage: 'starter-child',
        socketSet: 'starter-child-v1',
        actions: ['idle', 'walk', 'attack-bare'],
        status: 'needs-pixellab-pass',
        designIntent: 'Unarmed combat needs its own generated attack frames instead of a generic swing overlay.'
      }
    ],
    designIntent: 'The first combat state is the body itself; it is still stage-bound equipment for evolution tracking.'
  },
  {
    itemId: 'branch-club',
    slot: 'mainHand',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: true,
    visualRequirements: [
      {
        bodyStage: 'starter-child',
        socketSet: 'starter-child-v1',
        actions: ['idle', 'walk'],
        status: 'runtime-ready',
        designIntent: 'The current held branch overlay is acceptable only for idle and walk readability.'
      },
      {
        bodyStage: 'starter-child',
        socketSet: 'starter-child-v1',
        actions: ['attack-main-hand', 'dodge-roll', 'hurt'],
        status: 'needs-pixellab-pass',
        designIntent: 'Combat and recovery frames must be generated to fit the child arm arc and weapon mass.'
      }
    ],
    designIntent: 'Seed weapon for the blade path; later body stages need their own branch-club fit assets.'
  },
  {
    itemId: 'stone-edge',
    slot: 'mainHand',
    compatibleBodyStages: ['starter-child'],
    socketSet: 'starter-child-v1',
    changesSilhouette: true,
    visualRequirements: [
      {
        bodyStage: 'starter-child',
        socketSet: 'starter-child-v1',
        actions: ['idle', 'walk'],
        status: 'runtime-ready',
        designIntent: 'The current held stone edge overlay is acceptable only for idle and walk readability.'
      },
      {
        bodyStage: 'starter-child',
        socketSet: 'starter-child-v1',
        actions: ['attack-main-hand', 'dodge-roll', 'hurt'],
        status: 'needs-pixellab-pass',
        designIntent: 'Axe-line attacks need generated body-and-tool frames because the weight read is different.'
      }
    ],
    designIntent: 'Seed weapon for the axe path; evolved bodies must receive a separately fitted stone-edge visual.'
  }
] as const satisfies readonly EquipmentFitProfile[];

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

export const getStarterEquipmentFitProfiles = (): readonly EquipmentFitProfile[] => starterEquipmentFitProfiles;

export const getEquipmentFitProfile = (
  itemId: EquipmentItemId,
  slot: EquipmentSlot
): EquipmentFitProfile | undefined =>
  starterEquipmentFitProfiles.find((profile) => profile.itemId === itemId && profile.slot === slot);

export const canEquipmentFitCharacter = (
  itemId: EquipmentItemId,
  slot: EquipmentSlot,
  bodyStage: CharacterBodyStageId
): boolean => {
  if (itemId === 'none') {
    return true;
  }

  const profile = getEquipmentFitProfile(itemId, slot);
  return profile?.compatibleBodyStages.includes(bodyStage) ?? false;
};
