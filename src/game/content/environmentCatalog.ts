import { assetKeys } from '../assets/manifest';
import type { BiomeId, GroundMaterial } from './maps/startingArea';

export type EnvironmentAssetRole =
  | 'tree-whole'
  | 'tree-root'
  | 'tree-trunk'
  | 'tree-canopy'
  | 'tree-shade'
  | 'resource-node'
  | 'terrain-detail'
  | 'poi-anchor'
  | 'crafting-station';
export type EnvironmentAssetTag =
  | 'unknown-woods'
  | 'first-zone'
  | 'wolf-territory'
  | 'edge-growth'
  | 'water-source'
  | 'exposed-stone'
  | 'damp-shade'
  | 'animal-trail'
  | 'danger-gate'
  | 'progression-station'
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
  },
  zone1PoiWaterSourceV1: {
    id: 'zone1-poi-water-source-v1',
    textureKey: assetKeys.zone1PoiWaterSource,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass', 'damp-dirt'],
    tags: ['first-zone', 'water-source', 'damp-shade', 'upper-left-lit'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: true
  },
  zone1PoiStoneOutcropV1: {
    id: 'zone1-poi-stone-outcrop-v1',
    textureKey: assetKeys.zone1PoiStoneOutcrop,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass', 'damp-dirt'],
    tags: ['first-zone', 'exposed-stone', 'upper-left-lit'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: true
  },
  zone1PoiHerbBerryPatchV1: {
    id: 'zone1-poi-herb-berry-patch-v1',
    textureKey: assetKeys.zone1PoiHerbBerryPatch,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['first-zone', 'edge-growth', 'damp-shade', 'upper-left-lit'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: true
  },
  zone1PoiClayMudBankV1: {
    id: 'zone1-poi-clay-mud-bank-v1',
    textureKey: assetKeys.zone1PoiClayMudBank,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['damp-dirt', 'cold-grass'],
    tags: ['first-zone', 'damp-shade', 'exposed-stone', 'upper-left-lit'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: true
  },
  zone1PoiAnimalTrailV1: {
    id: 'zone1-poi-animal-trail-v1',
    textureKey: assetKeys.zone1PoiAnimalTrail,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass', 'damp-dirt'],
    tags: ['first-zone', 'animal-trail', 'edge-growth', 'upper-left-lit'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: true
  },
  zone1PoiFutureGateV1: {
    id: 'zone1-poi-future-gate-v1',
    textureKey: assetKeys.zone1PoiFutureGate,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass', 'damp-dirt'],
    tags: ['unknown-woods', 'first-zone', 'danger-gate', 'damp-shade', 'upper-left-lit', 'no-baked-ground'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  zone1PoiDeepForestDeadfallV1: {
    id: 'zone1-poi-deep-forest-deadfall-v1',
    textureKey: assetKeys.zone1PoiDeepForestDeadfall,
    role: 'poi-anchor',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['cold-grass'],
    tags: ['unknown-woods', 'first-zone', 'damp-shade', 'upper-left-lit', 'no-baked-ground'],
    lightProfile: 'upper-left-neutral',
    hasBakedGround: false
  },
  basicWorkbenchV1: {
    id: 'basic-workbench-v1',
    textureKey: assetKeys.basicWorkbench,
    role: 'crafting-station',
    validBiomes: ['cold-wild-grassland'],
    validGroundMaterials: ['damp-dirt', 'cold-grass'],
    tags: ['first-zone', 'progression-station', 'upper-left-lit', 'no-baked-ground'],
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
