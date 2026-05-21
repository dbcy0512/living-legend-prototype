import type { EnemyHabitatTag, EnemyKind } from '../enemies';
import type { ResourceEcologyTag, ResourceKind } from '../resources';

export type ZoneOneRegionId =
  | 'camp-clearing-hub'
  | 'herb-berry-patch'
  | 'stone-outcrop'
  | 'water-source'
  | 'clay-mud-bank'
  | 'deep-forest'
  | 'dense-forest-east'
  | 'deadwood-mushrooms'
  | 'animal-trails'
  | 'future-danger-gate';

export type ZoneOneRegion = {
  id: ZoneOneRegionId;
  label: string;
  role: 'hub' | 'resource-pocket' | 'path' | 'danger-gate';
  dangerTier: 0 | 1 | 2 | 3;
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
  resourceKinds: readonly ResourceKind[];
  ecologyTags: readonly ResourceEcologyTag[];
  enemyHabitats: readonly EnemyHabitatTag[];
  designIntent: string;
};

export type ZoneOneTriggerId = 'deadwood-skitter-trigger' | 'animal-trail-pressure-trigger' | 'future-gate-warning-trigger';

export type ZoneOneEnemyWaveTrigger = {
  id: ZoneOneTriggerId;
  label: string;
  regionId: ZoneOneRegionId;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  enemyKinds: readonly EnemyKind[];
  maxActive: number;
  triggerWhen: 'enter-region' | 'linger-in-region' | 'return-at-night';
  designIntent: string;
};

const zoneOneRegions = [
  {
    id: 'camp-clearing-hub',
    label: 'Camp Clearing / Hub',
    role: 'hub',
    dangerTier: 0,
    center: { x: 710, y: 542 },
    radius: { x: 230, y: 120 },
    resourceKinds: ['twigs', 'dryGrass', 'bark', 'stone'],
    ecologyTags: ['dead-fire-debris', 'dry-clearing-edge', 'exposed-stone'],
    enemyHabitats: [],
    designIntent: 'The first breath area. Resources here should look like survival debris around a failed camp, not rewards.'
  },
  {
    id: 'herb-berry-patch',
    label: 'Herb & Berry Patch',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 320, y: 330 },
    radius: { x: 170, y: 110 },
    resourceKinds: ['herbs', 'food'],
    ecologyTags: ['damp-shade', 'edge-growth'],
    enemyHabitats: ['damp-shade'],
    designIntent: 'A softer pocket that teaches living plants have use, with light creature risk later.'
  },
  {
    id: 'stone-outcrop',
    label: 'Stone Outcrop',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 260, y: 520 },
    radius: { x: 150, y: 90 },
    resourceKinds: ['stone'],
    ecologyTags: ['exposed-stone'],
    enemyHabitats: [],
    designIntent: 'Exposed rock and erosion should visually explain stone and future flint.'
  },
  {
    id: 'water-source',
    label: 'Water Source',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 210, y: 710 },
    radius: { x: 190, y: 120 },
    resourceKinds: ['herbs', 'food'],
    ecologyTags: ['damp-shade', 'edge-growth'],
    enemyHabitats: ['damp-shade'],
    designIntent: 'Future water/reed/fish logic. For now it anchors damp resources and mud-side life.'
  },
  {
    id: 'clay-mud-bank',
    label: 'Clay & Mud',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 520, y: 735 },
    radius: { x: 130, y: 80 },
    resourceKinds: ['stone'],
    ecologyTags: ['exposed-stone', 'damp-shade'],
    enemyHabitats: ['damp-shade'],
    designIntent: 'Future crafting material pocket that connects water, mud, and survival building.'
  },
  {
    id: 'deep-forest',
    label: 'Deep Forest',
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 730, y: 220 },
    radius: { x: 220, y: 140 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'dense-forest-edge'],
    designIntent: 'A denser wood pocket. Better tree materials come from stronger forest identity.'
  },
  {
    id: 'dense-forest-east',
    label: 'Dense Forest',
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 1210, y: 250 },
    radius: { x: 250, y: 140 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'edge-growth'],
    enemyHabitats: ['dense-forest-edge', 'deadwood'],
    designIntent: 'A thicker forest edge that should feel useful but less comfortable than the hub.'
  },
  {
    id: 'deadwood-mushrooms',
    label: 'Deadwood & Mushrooms',
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 1110, y: 470 },
    radius: { x: 180, y: 110 },
    resourceKinds: ['wood', 'herbs'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'damp-shade'],
    designIntent: 'The best first place for spiders/blobs because it visually supports small damp/deadwood life.'
  },
  {
    id: 'animal-trails',
    label: 'Animal Trails',
    role: 'path',
    dangerTier: 2,
    center: { x: 1140, y: 640 },
    radius: { x: 230, y: 115 },
    resourceKinds: ['twigs', 'food'],
    ecologyTags: ['edge-growth', 'tree-shed'],
    enemyHabitats: ['animal-trail'],
    designIntent: 'A movement corridor for first trigger zones and small enemy waves.'
  },
  {
    id: 'future-danger-gate',
    label: 'Future Danger / Exploration',
    role: 'danger-gate',
    dangerTier: 3,
    center: { x: 730, y: 825 },
    radius: { x: 150, y: 90 },
    resourceKinds: [],
    ecologyTags: ['damp-shade'],
    enemyHabitats: ['dense-forest-edge'],
    designIntent: 'A locked emotional promise: the world continues, but Zone 1 should not push the child here immediately.'
  }
] as const satisfies readonly ZoneOneRegion[];

export const getZoneOneRegions = (): readonly ZoneOneRegion[] => zoneOneRegions;

export const getZoneOneRegion = (id: ZoneOneRegionId): ZoneOneRegion =>
  zoneOneRegions.find((region) => region.id === id) ?? zoneOneRegions[0];

const zoneOneEnemyWaveTriggers = [
  {
    id: 'deadwood-skitter-trigger',
    label: 'Deadwood Skitter',
    regionId: 'deadwood-mushrooms',
    bounds: { x: 950, y: 380, width: 310, height: 190 },
    enemyKinds: ['mire-spider', 'violet-moss-blob'],
    maxActive: 2,
    triggerWhen: 'enter-region',
    designIntent: 'First real danger pocket. Small creatures should feel like they belong to damp deadwood, not as random attackers.'
  },
  {
    id: 'animal-trail-pressure-trigger',
    label: 'Animal Trail Pressure',
    regionId: 'animal-trails',
    bounds: { x: 1010, y: 555, width: 300, height: 170 },
    enemyKinds: ['thorn-shell-mite', 'mire-spider'],
    maxActive: 2,
    triggerWhen: 'linger-in-region',
    designIntent: 'A path-pressure trigger for testing waves without spawning enemies in the safe hub.'
  },
  {
    id: 'future-gate-warning-trigger',
    label: 'Future Gate Warning',
    regionId: 'future-danger-gate',
    bounds: { x: 620, y: 765, width: 220, height: 120 },
    enemyKinds: ['violet-moss-blob', 'thorn-shell-mite'],
    maxActive: 3,
    triggerWhen: 'return-at-night',
    designIntent: 'A later escalation trigger that keeps early exploration open but makes deeper movement feel consequential.'
  }
] as const satisfies readonly ZoneOneEnemyWaveTrigger[];

export const getZoneOneEnemyWaveTriggers = (): readonly ZoneOneEnemyWaveTrigger[] => zoneOneEnemyWaveTriggers;
