import { getMeleeSeedProfile, type MeleeSeed } from './meleeSeeds';

export type WeaponAbilityId = 'unarmed-survival-swipe' | 'branch-club-heavy-swing' | 'stone-edge-cleaving-cut';

export type WeaponAbilityStatusTag = 'impact' | 'stagger' | 'bleed-seed';

export type WeaponAbilityDefinition = {
  id: WeaponAbilityId;
  weapon: MeleeSeed;
  slotIndex: 0;
  name: string;
  shortLabel: string;
  animationKey: string;
  statusTags: WeaponAbilityStatusTag[];
  damage: number;
  staminaCost: number;
  reach: number;
  width: number;
  windupMs: number;
  activeMs: number;
  recoveryMs: number;
  cooldownMs: number;
  hitStopMs: number;
  evolutionTrack: 'body' | 'blade' | 'axe';
};

const createPrimaryAbility = (
  weapon: MeleeSeed,
  id: WeaponAbilityId,
  name: string,
  shortLabel: string,
  animationKey: string,
  statusTags: WeaponAbilityStatusTag[]
): WeaponAbilityDefinition => {
  const profile = getMeleeSeedProfile(weapon);
  return {
    id,
    weapon,
    slotIndex: 0,
    name,
    shortLabel,
    animationKey,
    statusTags,
    damage: Math.round(profile.damage * 1.22),
    staminaCost: profile.staminaCost + 4,
    reach: Math.round(profile.reach * 1.05),
    width: Math.round(profile.width * 1.08),
    windupMs: profile.windupMs + 40,
    activeMs: profile.activeMs + 20,
    recoveryMs: profile.recoveryMs + 55,
    cooldownMs: profile.windupMs + profile.activeMs + profile.recoveryMs + 320,
    hitStopMs: profile.hitStopMs + 20,
    evolutionTrack: profile.lineage
  };
};

const primaryWeaponAbilities = {
  'bare-hands': createPrimaryAbility(
    'bare-hands',
    'unarmed-survival-swipe',
    'Survival Swipe',
    'SWIPE',
    'combat.unarmed.survivalSwipe',
    ['impact']
  ),
  'branch-club': createPrimaryAbility(
    'branch-club',
    'branch-club-heavy-swing',
    'Heavy Swing',
    'SWING',
    'combat.branchClub.heavySwing',
    ['impact', 'stagger']
  ),
  'stone-edge': createPrimaryAbility(
    'stone-edge',
    'stone-edge-cleaving-cut',
    'Cleaving Cut',
    'CUT',
    'combat.stoneEdge.cleavingCut',
    ['impact', 'bleed-seed']
  )
} as const satisfies Record<MeleeSeed, WeaponAbilityDefinition>;

export const getPrimaryWeaponAbility = (weapon: MeleeSeed): WeaponAbilityDefinition => primaryWeaponAbilities[weapon];
