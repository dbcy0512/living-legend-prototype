import type { Direction } from '../input/actions';

export type MeleeSeed = 'bare-hands' | 'branch-club' | 'stone-edge';
export type MeleeLineage = 'body' | 'blade' | 'axe';

export type MeleeSeedProfile = {
  id: MeleeSeed;
  name: string;
  lineage: MeleeLineage;
  staminaCost: number;
  damage: number;
  reach: number;
  width: number;
  windupMs: number;
  activeMs: number;
  recoveryMs: number;
  hitStopMs: number;
  affinityGain: number;
};

const meleeSeedProfiles = {
  'bare-hands': {
    id: 'bare-hands',
    name: 'Bare Hands',
    lineage: 'body',
    staminaCost: 18,
    damage: 16,
    reach: 72,
    width: 72,
    windupMs: 105,
    activeMs: 135,
    recoveryMs: 210,
    hitStopMs: 55,
    affinityGain: 0
  },
  'branch-club': {
    id: 'branch-club',
    name: 'Branch Club',
    lineage: 'blade',
    staminaCost: 20,
    damage: 17,
    reach: 92,
    width: 96,
    windupMs: 112,
    activeMs: 150,
    recoveryMs: 230,
    hitStopMs: 62,
    affinityGain: 1
  },
  'stone-edge': {
    id: 'stone-edge',
    name: 'Stone Edge',
    lineage: 'axe',
    staminaCost: 24,
    damage: 22,
    reach: 66,
    width: 46,
    windupMs: 128,
    activeMs: 112,
    recoveryMs: 280,
    hitStopMs: 76,
    affinityGain: 1
  }
} as const satisfies Record<MeleeSeed, MeleeSeedProfile>;

export const getMeleeSeedProfile = (seed: MeleeSeed): MeleeSeedProfile => meleeSeedProfiles[seed];

export const getMeleeForwardAxis = (direction: Direction): { x: number; y: number } => {
  switch (direction) {
    case 'north':
      return { x: 0, y: -1 };
    case 'south':
      return { x: 0, y: 1 };
    case 'west':
      return { x: -1, y: 0 };
    case 'east':
      return { x: 1, y: 0 };
  }
};
