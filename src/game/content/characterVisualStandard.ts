export type CharacterDirection = 'north' | 'south' | 'east' | 'west';

export type CharacterEquipmentSocket = 'mainHand' | 'tool' | 'body' | 'back' | 'hands';

export type CharacterConditionState = 'cold' | 'warming' | 'exhausted' | 'hurt' | 'under-threat';

export type CharacterAnimationGroup =
  | 'idle-cold'
  | 'idle-warm'
  | 'walk'
  | 'gather'
  | 'fire-kneel'
  | 'attack-bare'
  | 'attack-main-hand'
  | 'dodge-roll'
  | 'hurt'
  | 'collapse'
  | 'use-item';

export type CharacterVisualStandard = {
  id: string;
  frame: {
    width: number;
    height: number;
    footAnchor: {
      x: number;
      y: number;
    };
    visualHeightPx: {
      min: number;
      max: number;
    };
  };
  artDirection: {
    camera: string;
    style: string[];
    forbidden: string[];
  };
  equipmentSockets: readonly CharacterEquipmentSocket[];
  conditionStates: readonly CharacterConditionState[];
  animationGroups: Readonly<Record<CharacterAnimationGroup, readonly CharacterDirection[]>>;
};

const allDirections = ['north', 'south', 'east', 'west'] as const satisfies readonly CharacterDirection[];

export const starterChildCharacterStandard = {
  id: 'starter-child-character-standard-v1',
  frame: {
    width: 64,
    height: 64,
    footAnchor: {
      x: 0.5,
      y: 0.78
    },
    visualHeightPx: {
      min: 36,
      max: 44
    }
  },
  artDirection: {
    camera: 'top-down-3-4',
    style: ['cel-shaded-anime', 'gritty-survival-fantasy', 'small-vulnerable-silhouette'],
    forbidden: ['baked-ground', 'scenery', 'labels', 'ui-elements', 'heroic-ready-stance']
  },
  equipmentSockets: ['mainHand', 'tool', 'body', 'back', 'hands'],
  conditionStates: ['cold', 'warming', 'exhausted', 'hurt', 'under-threat'],
  animationGroups: {
    'idle-cold': allDirections,
    'idle-warm': allDirections,
    walk: allDirections,
    gather: allDirections,
    'fire-kneel': allDirections,
    'attack-bare': allDirections,
    'attack-main-hand': allDirections,
    'dodge-roll': allDirections,
    hurt: allDirections,
    collapse: allDirections,
    'use-item': allDirections
  }
} as const satisfies CharacterVisualStandard;

export const getStarterChildCharacterStandard = (): CharacterVisualStandard => starterChildCharacterStandard;
