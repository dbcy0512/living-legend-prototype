import { assetKeys } from '../assets/manifest';
import type { BiomeId, GroundMaterial } from './maps/startingArea';

export type EnvironmentAssetRole = 'tree-whole' | 'tree-root' | 'tree-trunk' | 'tree-canopy' | 'tree-shade' | 'resource-node' | 'terrain-detail';
export type EnvironmentAssetTag =
  | 'unknown-woods'
  | 'first-zone'
  | 'wolf-territory'
  | 'edge-growth'
  | 'upper-left-lit'
  | 'no-baked-ground'
  | 'wind-responsive'
  | 'trunk-collision'
  | 'canopy-cover';

export type EnvironmentAssetDefinition = {
  id: string;
  textureKey: string;
  role: EnvironmentAssetRole;
  validBiomes: readonly BiomeId[];
  validGroundMaterials: readonly GroundMaterial[];
  tags: readonly EnvironmentAssetTag[];
  lightProfile: 'upper-left-neutral';
  hasBakedGround: boolean;
};

export const environmentAssetCatalog = {
  coldGrassTreeClusterWholeV1: {
    id: 'cold-grass-tree-cluster-whole-v1',
    textureKey: assetKeys.treeCluster,
    role: 'tree-whole',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'edge-growth', 'upper-left-lit', 'no-baked-ground', 'wind-responsive', 'trunk-collision', 'canopy-cover'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  coldGrassTreeClusterAltWholeV1: {
    id: 'cold-grass-tree-cluster-alt-whole-v1',
    textureKey: assetKeys.treeClusterAlt,
    role: 'tree-whole',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'wolf-territory', 'edge-growth', 'upper-left-lit', 'no-baked-ground', 'wind-responsive', 'trunk-collision', 'canopy-cover'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  coldGrassTreeRootsV1: {
    id: 'cold-grass-tree-roots-v1',
    textureKey: assetKeys.zone1TreeRoots,
    role: 'tree-root',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'upper-left-lit', 'no-baked-ground'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  coldGrassTreeTrunkBodyV1: {
    id: 'cold-grass-tree-trunk-body-v1',
    textureKey: assetKeys.zone1TreeTrunkBody,
    role: 'tree-trunk',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'upper-left-lit', 'no-baked-ground', 'trunk-collision'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  coldGrassTreeCanopyV1: {
    id: 'cold-grass-tree-canopy-v1',
    textureKey: assetKeys.zone1TreeCanopy,
    role: 'tree-canopy',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'upper-left-lit', 'no-baked-ground', 'wind-responsive', 'canopy-cover'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  }
} as const satisfies Record<string, EnvironmentAssetDefinition>;

export type EnvironmentAssetId = (typeof environmentAssetCatalog)[keyof typeof environmentAssetCatalog]['id'];

export const getEnvironmentAsset = (id: EnvironmentAssetId): EnvironmentAssetDefinition => {
  const asset = Object.values(environmentAssetCatalog).find((entry) => entry.id === id);
  if (!asset) {
    throw new Error(`Environment asset missing from catalog: ${id}`);
  }
  return asset;
};
