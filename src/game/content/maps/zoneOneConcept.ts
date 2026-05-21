import { assetKeys } from '../../assets/manifest';
import type { EnemyHabitatTag, EnemyKind } from '../enemies';
import type { ResourceEcologyTag, ResourceKind } from '../resources';
import { startingAreaLayout } from './startingArea';

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
  triggerWhen: 'gather-resource' | 'enter-region' | 'linger-in-region' | 'return-at-night';
  designIntent: string;
};

export type ZoneOneSanctuary = {
  id: 'camp-sanctuary';
  label: string;
  center: {
    x: number;
    y: number;
  };
  radius: number;
  designIntent: string;
};

export type ZoneOneHabitatAnchor = {
  id: string;
  triggerId: ZoneOneTriggerId;
  label: string;
  textureKey: string;
  x: number;
  y: number;
  scale: number;
  enemyKinds: readonly EnemyKind[];
  spawnPoint: {
    x: number;
    y: number;
  };
  designIntent: string;
};

export type ZoneOnePreparedGroundPatch = {
  id: string;
  regionId: ZoneOneRegionId;
  material: 'damp-deadwood-floor' | 'rotting-log-litter' | 'soft-shade-edge';
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
  designIntent: string;
};

const zoneOneRegions = [
  {
    id: 'camp-clearing-hub',
    label: 'Camp Clearing / Hub',
    role: 'hub',
    dangerTier: 0,
    center: startingAreaLayout.campCenter,
    radius: { x: 260, y: 150 },
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
    center: { x: 590, y: 450 },
    radius: { x: 220, y: 150 },
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
    center: { x: 470, y: 790 },
    radius: { x: 210, y: 135 },
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
    center: { x: 450, y: 1240 },
    radius: { x: 260, y: 180 },
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
    center: { x: 860, y: 1285 },
    radius: { x: 190, y: 120 },
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
    center: { x: 1400, y: 390 },
    radius: { x: 280, y: 180 },
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
    center: { x: 2180, y: 440 },
    radius: { x: 330, y: 190 },
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
    center: { x: 2180, y: 850 },
    radius: { x: 270, y: 170 },
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
    center: { x: 2180, y: 1120 },
    radius: { x: 300, y: 160 },
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
    center: { x: 1400, y: 1450 },
    radius: { x: 230, y: 140 },
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
    bounds: { x: 1955, y: 715, width: 470, height: 300 },
    enemyKinds: ['mire-spider', 'violet-moss-blob'],
    maxActive: 2,
    triggerWhen: 'gather-resource',
    designIntent: 'First real danger pocket. Small creatures should feel like they belong to damp deadwood, not as random attackers.'
  },
  {
    id: 'animal-trail-pressure-trigger',
    label: 'Animal Trail Pressure',
    regionId: 'animal-trails',
    bounds: { x: 1960, y: 1030, width: 470, height: 240 },
    enemyKinds: ['thorn-shell-mite', 'mire-spider'],
    maxActive: 2,
    triggerWhen: 'linger-in-region',
    designIntent: 'A path-pressure trigger for testing waves without spawning enemies in the safe hub.'
  },
  {
    id: 'future-gate-warning-trigger',
    label: 'Future Gate Warning',
    regionId: 'future-danger-gate',
    bounds: { x: 1250, y: 1360, width: 320, height: 220 },
    enemyKinds: ['violet-moss-blob', 'thorn-shell-mite'],
    maxActive: 3,
    triggerWhen: 'return-at-night',
    designIntent: 'A later escalation trigger that keeps early exploration open but makes deeper movement feel consequential.'
  }
] as const satisfies readonly ZoneOneEnemyWaveTrigger[];

export const getZoneOneEnemyWaveTriggers = (): readonly ZoneOneEnemyWaveTrigger[] => zoneOneEnemyWaveTriggers;

export const getZoneOneEnemyWaveTrigger = (id: ZoneOneTriggerId): ZoneOneEnemyWaveTrigger =>
  zoneOneEnemyWaveTriggers.find((trigger) => trigger.id === id) ?? zoneOneEnemyWaveTriggers[0];

const zoneOneCampSanctuary = {
  id: 'camp-sanctuary',
  label: 'Camp Sanctuary',
  center: startingAreaLayout.campCenter,
  radius: 155,
  designIntent: 'The tight home circle: safety, resting, crafting, upgrading, and learning live here before deeper exploration opens.'
} as const satisfies ZoneOneSanctuary;

export const getZoneOneCampSanctuary = (): ZoneOneSanctuary => zoneOneCampSanctuary;

const zoneOneHabitatAnchors = [
  {
    id: 'deadwood-fallen-log-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Deadwood Fallen Log',
    textureKey: assetKeys.deadwoodLogHabitat,
    x: 2135,
    y: 836,
    scale: 0.98,
    enemyKinds: ['mire-spider', 'violet-moss-blob'],
    spawnPoint: { x: 2098, y: 868 },
    designIntent: 'A readable source for damp deadwood enemies and nearby wood resources.'
  },
  {
    id: 'deadwood-mushroom-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Mushroom Moss Cluster',
    textureKey: assetKeys.mushroomHabitat,
    x: 2218,
    y: 888,
    scale: 0.66,
    enemyKinds: ['violet-moss-blob'],
    spawnPoint: { x: 2248, y: 922 },
    designIntent: 'A damp pocket source for blobs and herbs, tying danger to living ground conditions.'
  },
  {
    id: 'deadwood-root-hole-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Root Hole Den',
    textureKey: assetKeys.rootHoleHabitat,
    x: 2362,
    y: 798,
    scale: 0.82,
    enemyKinds: ['mire-spider', 'thorn-shell-mite'],
    spawnPoint: { x: 2330, y: 826 },
    designIntent: 'A visible den mouth so enemies feel like they emerge from the world.'
  }
] as const satisfies readonly ZoneOneHabitatAnchor[];

export const getZoneOneHabitatAnchors = (): readonly ZoneOneHabitatAnchor[] => zoneOneHabitatAnchors;

export const getZoneOneHabitatAnchorsForTrigger = (triggerId: ZoneOneTriggerId): readonly ZoneOneHabitatAnchor[] =>
  zoneOneHabitatAnchors.filter((anchor) => anchor.triggerId === triggerId);

const zoneOnePreparedGroundPatches = [
  {
    id: 'deadwood-damp-floor',
    regionId: 'deadwood-mushrooms',
    material: 'damp-deadwood-floor',
    center: { x: 2180, y: 850 },
    radius: { x: 355, y: 182 },
    designIntent: 'Turns the deadwood pocket into a damp shaded floor before any object is placed.'
  },
  {
    id: 'deadwood-rot-core',
    regionId: 'deadwood-mushrooms',
    material: 'rotting-log-litter',
    center: { x: 2208, y: 868 },
    radius: { x: 245, y: 106 },
    designIntent: 'Groups the log, mushrooms, and root den into one readable decay cluster.'
  },
  {
    id: 'deadwood-shade-edge',
    regionId: 'deadwood-mushrooms',
    material: 'soft-shade-edge',
    center: { x: 2300, y: 790 },
    radius: { x: 210, y: 84 },
    designIntent: 'Softens the transition from grass into the den and canopy shade.'
  }
] as const satisfies readonly ZoneOnePreparedGroundPatch[];

export const getZoneOnePreparedGroundPatches = (): readonly ZoneOnePreparedGroundPatch[] => zoneOnePreparedGroundPatches;

export const isPointInsideZoneOneTrigger = (trigger: ZoneOneEnemyWaveTrigger, x: number, y: number): boolean =>
  x >= trigger.bounds.x &&
  x <= trigger.bounds.x + trigger.bounds.width &&
  y >= trigger.bounds.y &&
  y <= trigger.bounds.y + trigger.bounds.height;
