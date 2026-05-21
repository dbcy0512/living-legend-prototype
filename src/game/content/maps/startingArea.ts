import type { EnvironmentAssetId } from '../environmentCatalog';

export const viewportSize = {
  width: 960,
  height: 540
} as const;

export type GroundMaterial = 'cold-grass' | 'damp-dirt';
export type BiomeId = 'cold-wild-grassland';

export type TreeVariant = 'cluster' | 'cluster-alt';
export type TreePlacementRole = 'shelter' | 'boundary' | 'threshold' | 'wolf-cover' | 'resource-parent' | 'landmark' | 'screen-frame';

type TreeBase = {
  id: string;
  biome: BiomeId;
  groundMaterial: GroundMaterial;
  placementRole: TreePlacementRole;
  zoneTags: readonly ('unknown-woods' | 'first-zone' | 'wolf-territory' | 'edge-growth')[];
  x: number;
  y: number;
  trunkCollisionRadius: number;
  trunkCollisionOffsetY: number;
  canopyOffsetY: number;
  canopyRadiusX: number;
  canopyRadiusY: number;
  scaleX: number;
  scaleY: number;
  windWeight: number;
};

export type WholeTreeInstance = TreeBase & {
  renderMode: 'whole';
  variant: TreeVariant;
  assetId: EnvironmentAssetId;
};

export type AssembledTreeInstance = TreeBase & {
  renderMode: 'assembled';
  rootAssetId: EnvironmentAssetId;
  trunkAssetId: EnvironmentAssetId;
  canopyAssetId: EnvironmentAssetId;
};

export type TreeInstance = WholeTreeInstance | AssembledTreeInstance;

type AssembledTreeOptions = {
  canopyOffsetY?: number;
  canopyRadiusX?: number;
  canopyRadiusY?: number;
  scaleX?: number;
  scaleY?: number;
  windWeight?: number;
  trunkCollisionOffsetY?: number;
};

const firstZoneBiome = {
  id: 'cold-wild-grassland',
  groundMaterials: ['cold-grass', 'damp-dirt'],
  lightProfile: 'upper-left-cold-dawn',
  windProfile: 'low-cold-crosswind',
  toneTags: ['unknown', 'cold', 'young-survivor', 'not-yet-mastered']
} as const;

export const startingAreaLayout = {
  width: 2800,
  height: 1700,
  campCenter: {
    x: 1400,
    y: 850
  },
  playerStart: {
    x: 1400,
    y: 808
  }
} as const;

const tree = (
  id: string,
  x: number,
  y: number,
  variant: TreeVariant,
  trunkCollisionRadius: number,
  placementRole: TreePlacementRole,
  zoneTags: TreeInstance['zoneTags'],
  wild = false
): TreeInstance => {
  const alt = variant === 'cluster-alt';
  return {
    id,
    biome: firstZoneBiome.id,
    groundMaterial: 'cold-grass',
    placementRole,
    zoneTags,
    renderMode: 'whole',
    variant,
    assetId: alt ? 'cold-grass-tree-cluster-alt-whole-v1' : 'cold-grass-tree-cluster-whole-v1',
    x,
    y,
    trunkCollisionRadius,
    trunkCollisionOffsetY: -36 * (alt ? (wild ? 1.42 : 1.28) : wild ? 1.62 : 1.46),
    canopyOffsetY: (alt ? -78 : -72) * (wild ? 1.08 : 1),
    canopyRadiusX: (alt ? 74 : 70) * (wild ? 1.12 : 1),
    canopyRadiusY: (alt ? 56 : 52) * (wild ? 1.08 : 1),
    scaleX: alt ? (wild ? 1.1 : 0.98) : wild ? 1.12 : 1.02,
    scaleY: alt ? (wild ? 1.42 : 1.28) : wild ? 1.62 : 1.46,
    windWeight: wild ? 0.34 : 0.22
  };
};

const assembledTree = (
  id: string,
  x: number,
  y: number,
  trunkCollisionRadius: number,
  placementRole: TreePlacementRole,
  zoneTags: TreeInstance['zoneTags'],
  options: AssembledTreeOptions = {}
): TreeInstance => ({
  id,
  biome: firstZoneBiome.id,
  groundMaterial: 'cold-grass',
  placementRole,
  zoneTags,
  renderMode: 'assembled',
  rootAssetId: 'cold-grass-tree-roots-v1',
  trunkAssetId: 'cold-grass-tree-trunk-body-v1',
  canopyAssetId: 'cold-grass-tree-canopy-v1',
  x,
  y,
  trunkCollisionRadius,
  trunkCollisionOffsetY: options.trunkCollisionOffsetY ?? -44 * (options.scaleY ?? 1),
  canopyOffsetY: options.canopyOffsetY ?? -178,
  canopyRadiusX: options.canopyRadiusX ?? 106,
  canopyRadiusY: options.canopyRadiusY ?? 82,
  scaleX: options.scaleX ?? 1,
  scaleY: options.scaleY ?? 1,
  windWeight: options.windWeight ?? 0.3
});

const treeInstances = [
  assembledTree('tree-northwest-1', 120, 112, 32, 'screen-frame', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -174,
    canopyRadiusX: 108,
    canopyRadiusY: 84,
    scaleX: 0.98,
    scaleY: 1.02,
    windWeight: 0.26
  }),
  assembledTree('tree-northwest-2', 260, 122, 30, 'screen-frame', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -168,
    canopyRadiusX: 100,
    canopyRadiusY: 80,
    scaleX: 0.94,
    scaleY: 0.98,
    windWeight: 0.24
  }),
  assembledTree('tree-north-1', 1040, 118, 34, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -180,
    canopyRadiusX: 114,
    canopyRadiusY: 86,
    scaleX: 1.04,
    scaleY: 1.04,
    windWeight: 0.3
  }),
  assembledTree('tree-north-2', 1270, 112, 32, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -174,
    canopyRadiusX: 108,
    canopyRadiusY: 84,
    scaleX: 1,
    scaleY: 1.02,
    windWeight: 0.3
  }),
  assembledTree('tree-north-3', 1570, 124, 34, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -182,
    canopyRadiusX: 116,
    canopyRadiusY: 88,
    scaleX: 1.06,
    scaleY: 1.04,
    windWeight: 0.32
  }),
  assembledTree('tree-north-4', 1880, 132, 34, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -176,
    canopyRadiusX: 110,
    canopyRadiusY: 84,
    scaleX: 1.02,
    scaleY: 1.02,
    windWeight: 0.3
  }),
  assembledTree('tree-southwest-1', 112, 1510, 34, 'screen-frame', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -180,
    canopyRadiusX: 114,
    canopyRadiusY: 86,
    scaleX: 1.04,
    scaleY: 1.04,
    windWeight: 0.3
  }),
  assembledTree('tree-southwest-2', 286, 1490, 32, 'screen-frame', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -172,
    canopyRadiusX: 106,
    canopyRadiusY: 82,
    scaleX: 0.98,
    scaleY: 1,
    windWeight: 0.28
  }),
  assembledTree('tree-south-1', 1140, 1510, 28, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyRadiusX: 112,
    canopyRadiusY: 86,
    scaleX: 1.04,
    scaleY: 1.04,
    windWeight: 0.32
  }),
  assembledTree('tree-south-2', 1620, 1508, 28, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -172,
    canopyRadiusX: 104,
    canopyRadiusY: 80,
    scaleX: 0.96,
    scaleY: 1.02,
    windWeight: 0.28
  }),
  assembledTree('tree-southeast-1', 2630, 1500, 36, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -184,
    canopyRadiusX: 118,
    canopyRadiusY: 90,
    scaleX: 1.08,
    scaleY: 1.08,
    windWeight: 0.34
  }),
  assembledTree('tree-zone1-shelter-1', 1120, 700, 22, 'shelter', ['unknown-woods', 'first-zone']),
  assembledTree('tree-north-path', 1380, 470, 32, 'threshold', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -174,
    canopyRadiusX: 106,
    canopyRadiusY: 82,
    scaleX: 0.98,
    scaleY: 1.02,
    windWeight: 0.3
  }),
  assembledTree('tree-wild-1', 2020, 520, 34, 'wolf-cover', ['unknown-woods', 'wolf-territory'], {
    canopyOffsetY: -186,
    canopyRadiusX: 122,
    canopyRadiusY: 92,
    scaleX: 1.1,
    scaleY: 1.1,
    windWeight: 0.38
  }),
  assembledTree('tree-wild-2', 2260, 520, 30, 'wolf-cover', ['unknown-woods', 'wolf-territory'], {
    canopyOffsetY: -180,
    canopyRadiusX: 116,
    canopyRadiusY: 88,
    scaleX: 1.04,
    scaleY: 1.08,
    windWeight: 0.36
  }),
  assembledTree('tree-wild-3', 2480, 640, 38, 'wolf-cover', ['unknown-woods', 'wolf-territory'], {
    canopyOffsetY: -190,
    canopyRadiusX: 126,
    canopyRadiusY: 94,
    scaleX: 1.12,
    scaleY: 1.12,
    windWeight: 0.4
  }),
  assembledTree('tree-wild-4', 2360, 860, 38, 'resource-parent', ['unknown-woods', 'wolf-territory'], {
    canopyOffsetY: -184,
    canopyRadiusX: 120,
    canopyRadiusY: 90,
    scaleX: 1.08,
    scaleY: 1.1,
    windWeight: 0.38
  }),
  assembledTree('tree-herb-pocket-1', 560, 340, 28, 'boundary', ['unknown-woods', 'first-zone', 'edge-growth'], {
    canopyOffsetY: -170,
    canopyRadiusX: 104,
    canopyRadiusY: 80,
    scaleX: 0.98,
    scaleY: 1,
    windWeight: 0.26
  }),
  assembledTree('tree-stone-pocket-1', 330, 700, 26, 'landmark', ['unknown-woods', 'first-zone'], {
    canopyOffsetY: -162,
    canopyRadiusX: 96,
    canopyRadiusY: 76,
    scaleX: 0.9,
    scaleY: 0.96,
    windWeight: 0.22
  }),
  assembledTree('tree-water-pocket-1', 560, 1180, 30, 'boundary', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -176,
    canopyRadiusX: 108,
    canopyRadiusY: 84,
    scaleX: 1,
    scaleY: 1.04,
    windWeight: 0.34
  }),
  assembledTree('tree-east-boundary-1', 2660, 410, 34, 'screen-frame', ['unknown-woods', 'edge-growth'], {
    canopyOffsetY: -184,
    canopyRadiusX: 120,
    canopyRadiusY: 90,
    scaleX: 1.08,
    scaleY: 1.1,
    windWeight: 0.38
  })
] as const satisfies readonly TreeInstance[];

export const startingArea = {
  width: startingAreaLayout.width,
  height: startingAreaLayout.height,
  biome: firstZoneBiome,
  playerStart: startingAreaLayout.playerStart,
  boundsPadding: {
    x: 70,
    y: 76
  },
  environment: {
    trees: treeInstances
  },
  collision: treeInstances.map(({ id, x, y, trunkCollisionOffsetY, trunkCollisionRadius }) => ({
    id,
    kind: 'tree' as const,
    x,
    y,
    segmentEndY: y + trunkCollisionOffsetY,
    radius: trunkCollisionRadius
  }))
} as const;
