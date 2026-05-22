import {
  createEcosystemResourceSeeds,
  type EcosystemResourceSource
} from './ecosystem';
import type { ZoneOneRegionId } from './maps/zoneOneConcept';

export type ResourceKind = 'twigs' | 'dryGrass' | 'bark' | 'wood' | 'stone' | 'herbs' | 'food';
export type ResourceCategory = 'kindling' | 'crafting' | 'medicine' | 'food';
export type ResourceSourcePurpose = 'first-fire' | 'early-crafting' | 'medicine' | 'food';
export type ResourcePlacementMode = 'opening-fixed' | 'zone-fixed' | 'tree-attached' | 'zone-seeded' | 'unplaced';
export type ResourceEcologyTag =
  | 'dead-fire-debris'
  | 'dry-clearing-edge'
  | 'tree-shed'
  | 'exposed-stone'
  | 'damp-shade'
  | 'edge-growth';

export type StaticResourceSource = {
  type: 'opening' | 'fixed-zone';
  zoneId: ZoneOneRegionId;
  purpose: ResourceSourcePurpose;
  ecology: ResourceEcologyTag;
  placementNote: string;
};

export type ResourceSource = StaticResourceSource | EcosystemResourceSource;

export type ResourceProfile = {
  kind: ResourceKind;
  label: string;
  category: ResourceCategory;
  openingMaterial: boolean;
  defaultRespawnMs: number;
  defaultAmount: number;
  interactionRadius: number;
  facingReach: number;
  visualScale: number;
  highlightColor: number;
  highlightWidth: number;
  highlightHeight: number;
  ecologyTags: readonly ResourceEcologyTag[];
  placementLogic: string;
};

export type ResourceSeed = {
  id: string;
  kind: ResourceKind;
  x: number;
  y: number;
  amount: number;
  respawnMs: number;
  source?: ResourceSource;
};

const resourceProfiles = {
  twigs: {
    kind: 'twigs',
    label: 'Twigs',
    category: 'kindling',
    openingMaterial: true,
    defaultRespawnMs: Number.POSITIVE_INFINITY,
    defaultAmount: 1,
    interactionRadius: 86,
    facingReach: 38,
    visualScale: 0.86,
    highlightColor: 0xfff3a3,
    highlightWidth: 46,
    highlightHeight: 18,
    ecologyTags: ['tree-shed', 'dead-fire-debris'],
    placementLogic: 'Twigs should read as shed tree matter, windfall, or old camp debris rather than open-field loot.'
  },
  dryGrass: {
    kind: 'dryGrass',
    label: 'Dry Grass',
    category: 'kindling',
    openingMaterial: true,
    defaultRespawnMs: Number.POSITIVE_INFINITY,
    defaultAmount: 1,
    interactionRadius: 94,
    facingReach: 42,
    visualScale: 0.9,
    highlightColor: 0xfff3a3,
    highlightWidth: 58,
    highlightHeight: 24,
    ecologyTags: ['dry-clearing-edge', 'dead-fire-debris'],
    placementLogic: 'Dry grass belongs where sun and wind would dry it: clearing edges, exposed dirt, or failed-fire scraps.'
  },
  bark: {
    kind: 'bark',
    label: 'Bark',
    category: 'kindling',
    openingMaterial: true,
    defaultRespawnMs: Number.POSITIVE_INFINITY,
    defaultAmount: 1,
    interactionRadius: 86,
    facingReach: 38,
    visualScale: 0.86,
    highlightColor: 0xfff3a3,
    highlightWidth: 48,
    highlightHeight: 20,
    ecologyTags: ['tree-shed', 'dead-fire-debris'],
    placementLogic: 'Bark should come from tree shed, roots, fallen limbs, or stripped camp debris.'
  },
  wood: {
    kind: 'wood',
    label: 'Wood',
    category: 'crafting',
    openingMaterial: false,
    defaultRespawnMs: 12000,
    defaultAmount: 3,
    interactionRadius: 88,
    facingReach: 38,
    visualScale: 0.72,
    highlightColor: 0x8ff7ff,
    highlightWidth: 62,
    highlightHeight: 24,
    ecologyTags: ['tree-shed'],
    placementLogic: 'Wood should usually be attached to trees, deadfall, roots, or visible broken limbs.'
  },
  stone: {
    kind: 'stone',
    label: 'Stone',
    category: 'crafting',
    openingMaterial: true,
    defaultRespawnMs: 12000,
    defaultAmount: 2,
    interactionRadius: 80,
    facingReach: 34,
    visualScale: 0.78,
    highlightColor: 0xfff3a3,
    highlightWidth: 46,
    highlightHeight: 20,
    ecologyTags: ['exposed-stone', 'dead-fire-debris'],
    placementLogic: 'Stone belongs on exposed dirt, erosion lines, rock clusters, or fire rings.'
  },
  herbs: {
    kind: 'herbs',
    label: 'Herbs',
    category: 'medicine',
    openingMaterial: false,
    defaultRespawnMs: 12000,
    defaultAmount: 2,
    interactionRadius: 82,
    facingReach: 36,
    visualScale: 0.7,
    highlightColor: 0x9ef0a2,
    highlightWidth: 44,
    highlightHeight: 20,
    ecologyTags: ['damp-shade', 'edge-growth'],
    placementLogic: 'Herbs should prefer shade, damp edges, tree shelter, and growth pockets.'
  },
  food: {
    kind: 'food',
    label: 'Food',
    category: 'food',
    openingMaterial: false,
    defaultRespawnMs: 12000,
    defaultAmount: 2,
    interactionRadius: 80,
    facingReach: 34,
    visualScale: 0.68,
    highlightColor: 0xffc86f,
    highlightWidth: 42,
    highlightHeight: 20,
    ecologyTags: ['edge-growth'],
    placementLogic: 'Food should come from bushes, edge growth, or living plants rather than isolated open ground.'
  }
} as const satisfies Record<ResourceKind, ResourceProfile>;

const staticStartingResources = [
  openingResource('first-twig', 'twigs', 1344, 958, 'dead-fire-debris', 'A twig left in the failed camp debris.'),
  openingResource('dry-grass-handful', 'dryGrass', 1540, 818, 'dry-clearing-edge', 'Dry grass caught on the sun-exposed clearing edge.'),
  openingResource('curl-of-bark', 'bark', 1318, 1000, 'tree-shed', 'Loose bark near deadfall and root litter, not open grass.'),
  openingResource('striking-stone', 'stone', 1508, 976, 'exposed-stone', 'A usable stone from the exposed dirt and fire ring.'),
  fixedZoneResource('moon-stone', 'stone', 470, 780, 'stone-outcrop', 'early-crafting', 'exposed-stone', 'Loose stone near the western outcrop and erosion line.', 2),
  fixedZoneResource('sun-herb', 'herbs', 610, 420, 'herb-berry-patch', 'medicine', 'damp-shade', 'Herbs in the lower damp shade of the herb and berry patch.', 2),
  fixedZoneResource('wild-fruit', 'food', 640, 360, 'herb-berry-patch', 'food', 'edge-growth', 'Fruit tucked into dense edge growth, not open field.', 2),
  fixedZoneResource('silver-herb', 'herbs', 510, 510, 'herb-berry-patch', 'medicine', 'damp-shade', 'A shaded herb pocket near the first western path.', 2),
  fixedZoneResource('reed-bank-root', 'food', 520, 1215, 'water-source', 'food', 'edge-growth', 'Edible roots and small food traces belong on the reed-heavy shoreline.', 2),
  fixedZoneResource('waterline-herb', 'herbs', 598, 1168, 'water-source', 'medicine', 'damp-shade', 'Damp herbs grow against the shoreline and reed bend.', 2),
  fixedZoneResource('clay-bank-flat-stone', 'stone', 860, 1285, 'clay-mud-bank', 'early-crafting', 'exposed-stone', 'Flat stones sit in the wet clay bank as future vessel and tool support.', 2),
  fixedZoneResource('deep-bark-sheet', 'bark', 1338, 430, 'deep-forest', 'early-crafting', 'tree-shed', 'A bark sheet shed by older deep-forest trees; this is a workbench material source.', 2),
  fixedZoneResource('deep-deadfall-branch', 'wood', 1426, 412, 'deep-forest', 'early-crafting', 'tree-shed', 'A heavier deadfall branch that belongs to the old forest floor.', 2),
  fixedZoneResource('dense-forest-bark', 'bark', 2138, 468, 'dense-forest-east', 'early-crafting', 'tree-shed', 'Routine bark from the eastern dense forest edge.', 2),
  fixedZoneResource('deadwood-rotten-branch', 'wood', 2098, 868, 'deadwood-mushrooms', 'early-crafting', 'tree-shed', 'Rotten deadwood that can wake what lives under the log.', 2),
  fixedZoneResource('deadwood-moss-herb', 'herbs', 2248, 922, 'deadwood-mushrooms', 'medicine', 'damp-shade', 'Damp moss herbs grow in the rot pocket after danger is handled.', 2),
  fixedZoneResource('trail-bent-twigs', 'twigs', 2180, 1120, 'animal-trails', 'early-crafting', 'tree-shed', 'Twigs snapped and carried along repeated animal movement.', 2),
  fixedZoneResource('trail-foraged-food', 'food', 2270, 1150, 'animal-trails', 'food', 'edge-growth', 'Small food traces sit along the animal trail edge rather than in open grass.', 1)
] as const satisfies readonly ResourceSeed[];

export const getResourceProfile = (kind: ResourceKind): ResourceProfile => resourceProfiles[kind];

export const getResourceProfiles = (): readonly ResourceProfile[] => Object.values(resourceProfiles);

export const getResourcePlacementMode = (source?: ResourceSource): ResourcePlacementMode => {
  if (!source) {
    return 'unplaced';
  }
  if (source.type === 'opening') {
    return 'opening-fixed';
  }
  if (source.type === 'fixed-zone') {
    return 'zone-fixed';
  }
  if (source.type === 'tree-dependent') {
    return 'tree-attached';
  }
  return 'zone-seeded';
};

export const isEcosystemResourceSource = (source?: ResourceSource): boolean => {
  const placementMode = getResourcePlacementMode(source);
  return placementMode === 'tree-attached' || placementMode === 'zone-seeded';
};

export const getStaticStartingResourceSeeds = (): ResourceSeed[] =>
  staticStartingResources.map((resource) => ({ ...resource, source: resource.source ? { ...resource.source } : undefined }));

export const createStartingResourceSeeds = (ecosystemSeed: string): ResourceSeed[] => [
  ...getStaticStartingResourceSeeds(),
  ...createEcosystemResourceSeeds(ecosystemSeed)
];

function openingResource(
  id: string,
  kind: Extract<ResourceKind, 'twigs' | 'dryGrass' | 'bark' | 'stone'>,
  x: number,
  y: number,
  ecology: ResourceEcologyTag,
  placementNote: string
): ResourceSeed {
  return {
    id,
    kind,
    x,
    y,
    amount: 1,
    respawnMs: 0,
    source: {
      type: 'opening',
      zoneId: 'camp-clearing-hub',
      purpose: 'first-fire',
      ecology,
      placementNote
    }
  };
}

function fixedZoneResource(
  id: string,
  kind: ResourceKind,
  x: number,
  y: number,
  zoneId: StaticResourceSource['zoneId'],
  purpose: ResourceSourcePurpose,
  ecology: ResourceEcologyTag,
  placementNote: string,
  amount = getResourceProfile(kind).defaultAmount
): ResourceSeed {
  return {
    id,
    kind,
    x,
    y,
    amount,
    respawnMs: 0,
    source: {
      type: 'fixed-zone',
      zoneId,
      purpose,
      ecology,
      placementNote
    }
  };
}
