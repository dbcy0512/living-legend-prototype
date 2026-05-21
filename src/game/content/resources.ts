import {
  createEcosystemResourceSeeds,
  type EcosystemResourceSource
} from './ecosystem';

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
  zoneId: 'first-clearing' | 'first-shelter-edge' | 'wolf-territory-edge';
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
  openingResource('first-twig', 'twigs', 654, 608, 'dead-fire-debris', 'A twig left in the failed camp debris.'),
  openingResource('dry-grass-handful', 'dryGrass', 842, 504, 'dry-clearing-edge', 'Dry grass caught on the sun-exposed clearing edge.'),
  openingResource('curl-of-bark', 'bark', 620, 642, 'tree-shed', 'Loose bark near deadfall and root litter, not open grass.'),
  openingResource('striking-stone', 'stone', 806, 632, 'exposed-stone', 'A usable stone from the exposed dirt and fire ring.'),
  fixedZoneResource('elder-branch', 'wood', 470, 430, 'first-shelter-edge', 'early-crafting', 'tree-shed', 'A fallen branch under the shelter tree.', 3),
  fixedZoneResource('moon-stone', 'stone', 1038, 248, 'wolf-territory-edge', 'early-crafting', 'exposed-stone', 'Loose stone near the northern rock and root line.', 2),
  fixedZoneResource('sun-herb', 'herbs', 520, 720, 'first-shelter-edge', 'medicine', 'damp-shade', 'Herbs in the lower damp shade of the shelter edge.', 2),
  fixedZoneResource('wild-fruit', 'food', 1398, 780, 'wolf-territory-edge', 'food', 'edge-growth', 'Fruit tucked into dense edge growth, not open field.', 2),
  fixedZoneResource('silver-herb', 'herbs', 268, 684, 'first-shelter-edge', 'medicine', 'damp-shade', 'A shaded herb pocket near southwest tree cover.', 2)
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
      zoneId: 'first-clearing',
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
