import {
  createEcosystemResourceSeeds,
  type EcosystemResourceSource
} from './ecosystem';

export type ResourceKind = 'twigs' | 'dryGrass' | 'bark' | 'wood' | 'stone' | 'herbs' | 'food';
export type ResourceCategory = 'kindling' | 'crafting' | 'medicine' | 'food';
export type ResourceSourcePurpose = 'first-fire' | 'early-crafting' | 'medicine' | 'food';
export type ResourcePlacementMode = 'opening-fixed' | 'zone-fixed' | 'tree-attached' | 'zone-seeded' | 'unplaced';

export type StaticResourceSource = {
  type: 'opening' | 'fixed-zone';
  zoneId: 'first-clearing' | 'first-shelter-edge' | 'wolf-territory-edge';
  purpose: ResourceSourcePurpose;
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
    highlightHeight: 18
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
    highlightHeight: 24
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
    highlightHeight: 20
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
    highlightHeight: 24
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
    highlightHeight: 20
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
    highlightHeight: 20
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
    highlightHeight: 20
  }
} as const satisfies Record<ResourceKind, ResourceProfile>;

const staticStartingResources = [
  openingResource('first-twig', 'twigs', 620, 524),
  openingResource('dry-grass-handful', 'dryGrass', 815, 506),
  openingResource('curl-of-bark', 'bark', 642, 608),
  openingResource('striking-stone', 'stone', 832, 598),
  fixedZoneResource('elder-branch', 'wood', 405, 520, 'first-shelter-edge', 'early-crafting', 3),
  fixedZoneResource('moon-stone', 'stone', 1045, 332, 'wolf-territory-edge', 'early-crafting', 2),
  fixedZoneResource('sun-herb', 'herbs', 520, 720, 'first-shelter-edge', 'medicine', 2),
  fixedZoneResource('wild-fruit', 'food', 1116, 674, 'wolf-territory-edge', 'food', 2),
  fixedZoneResource('silver-herb', 'herbs', 268, 684, 'first-shelter-edge', 'medicine', 2)
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
  y: number
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
      purpose: 'first-fire'
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
      purpose
    }
  };
}
