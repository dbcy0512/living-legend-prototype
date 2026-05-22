import { startingArea, type TreeInstance, type TreePlacementRole } from './maps/startingArea';
import { getZoneOneRegion, type ZoneOneRegionId } from './maps/zoneOneConcept';
import type { ResourceEcologyTag, ResourceKind } from './resources';

export type EcosystemResourceRuleId =
  | 'fallen-branch-near-resource-parent'
  | 'dew-herb-herb-berry-patch'
  | 'loose-stone-stone-outcrop'
  | 'wind-dry-grass-camp-clearing';

export type EcosystemResourceSource =
  | {
      type: 'tree-dependent';
      parentId: string;
      rule: EcosystemResourceRuleId;
      ecology: ResourceEcologyTag;
      placementNote: string;
    }
  | {
      type: 'zone-dependent';
      zoneId: ZoneOneRegionId;
      rule: EcosystemResourceRuleId;
      ecology: ResourceEcologyTag;
      placementNote: string;
    };

export type TreeDependentResourceRule = {
  id: EcosystemResourceRuleId;
  seedKey: string;
  seedIdPrefix: string;
  kind: Extract<ResourceKind, 'wood'>;
  parentRole: TreePlacementRole;
  amount: number;
  respawnMs: number;
  maxActivePerParent: number;
  minDistanceFromTrunk: number;
  maxDistanceFromTrunk: number;
  excludeParentTrunkCollision: boolean;
  ecology: ResourceEcologyTag;
  placementNote: string;
  offsets: readonly { x: number; y: number }[];
};

export type ZoneDependentResourceRule = {
  id: EcosystemResourceRuleId;
  seedKey: string;
  seedIdPrefix: string;
  kind: ResourceKind;
  zoneId: ZoneOneRegionId;
  amount: number;
  respawnMs: number;
  maxActive: number;
  collisionClearance: number;
  ecology: ResourceEcologyTag;
  placementNote: string;
  candidates: readonly { x: number; y: number }[];
};

type EcosystemSpawnCandidate = {
  index: number;
  x: number;
  y: number;
};

export type EcosystemResourceSeed = {
  id: string;
  kind: ResourceKind;
  x: number;
  y: number;
  amount: number;
  respawnMs: number;
  source: EcosystemResourceSource;
};

export const defaultEcosystemSeed = 'zone-1-first-breath';

const treeDependentResourceRules = [
  {
    id: 'fallen-branch-near-resource-parent',
    seedKey: 'zone-1-fallen-branches',
    seedIdPrefix: 'fallen-branch',
    kind: 'wood',
    parentRole: 'resource-parent',
    amount: 1,
    respawnMs: 0,
    maxActivePerParent: 3,
    minDistanceFromTrunk: 34,
    maxDistanceFromTrunk: 96,
    excludeParentTrunkCollision: true,
    ecology: 'tree-shed',
    placementNote: 'Branches spawn as tree windfall within a believable ring around a resource-parent tree.',
    offsets: [
      { x: -54, y: 46 },
      { x: 46, y: 38 },
      { x: 18, y: 70 },
      { x: -78, y: 22 },
      { x: 72, y: 58 },
      { x: -26, y: 82 },
      { x: 4, y: 42 }
    ]
  }
] as const satisfies readonly TreeDependentResourceRule[];

const zoneDependentResourceRules = [
  {
    id: 'dew-herb-herb-berry-patch',
    seedKey: 'zone-1-dew-herbs',
    seedIdPrefix: 'dew-herb',
    kind: 'herbs',
    zoneId: 'herb-berry-patch',
    amount: 1,
    respawnMs: 0,
    maxActive: 2,
    collisionClearance: 20,
    ecology: 'damp-shade',
    placementNote: 'Dew herbs prefer the bright damp edge of the herb and berry patch where low plant life is already established.',
    candidates: [
      { x: 560, y: 420 },
      { x: 650, y: 470 },
      { x: 470, y: 500 },
      { x: 720, y: 380 },
      { x: 520, y: 560 }
    ]
  },
  {
    id: 'loose-stone-stone-outcrop',
    seedKey: 'zone-1-loose-stones',
    seedIdPrefix: 'loose-stone',
    kind: 'stone',
    zoneId: 'stone-outcrop',
    amount: 1,
    respawnMs: 0,
    maxActive: 2,
    collisionClearance: 24,
    ecology: 'exposed-stone',
    placementNote: 'Loose stones appear on exposed outcrop ground, erosion marks, and rock edges.',
    candidates: [
      { x: 380, y: 720 },
      { x: 490, y: 768 },
      { x: 560, y: 860 },
      { x: 315, y: 830 },
      { x: 635, y: 720 }
    ]
  },
  {
    id: 'wind-dry-grass-camp-clearing',
    seedKey: 'zone-1-dry-grass',
    seedIdPrefix: 'dry-grass',
    kind: 'dryGrass',
    zoneId: 'camp-clearing-hub',
    amount: 1,
    respawnMs: 0,
    maxActive: 2,
    collisionClearance: 18,
    ecology: 'dry-clearing-edge',
    placementNote: 'Dry grass gathers on exposed clearing edges where wind and weak sun can dry it.',
    candidates: [
      { x: 1488, y: 806 },
      { x: 1536, y: 782 },
      { x: 1588, y: 828 },
      { x: 1508, y: 884 },
      { x: 1644, y: 868 }
    ]
  }
] as const satisfies readonly ZoneDependentResourceRule[];

const fallenBranchRule = treeDependentResourceRules[0];
const dewHerbRule = zoneDependentResourceRules[0];

export const getTreeDependentResourceRules = (): readonly TreeDependentResourceRule[] => treeDependentResourceRules;

export const getZoneDependentResourceRules = (): readonly ZoneDependentResourceRule[] => zoneDependentResourceRules;

export const getResourceParentTrees = (rule: TreeDependentResourceRule = fallenBranchRule): readonly TreeInstance[] =>
  startingArea.environment.trees.filter((tree) => tree.placementRole === rule.parentRole);

export const isTreeDependentResourceSeed = (seed: EcosystemResourceSeed): boolean =>
  seed.source.type === 'tree-dependent' &&
  treeDependentResourceRules.some((rule) => rule.id === seed.source.rule);

export const isZoneDependentResourceSeed = (seed: EcosystemResourceSeed): boolean =>
  seed.source.type === 'zone-dependent' &&
  zoneDependentResourceRules.some((rule) => rule.id === seed.source.rule);

export const isEcosystemResourceSeed = (seed: EcosystemResourceSeed): boolean =>
  isTreeDependentResourceSeed(seed) || isZoneDependentResourceSeed(seed);

export const getTreeDependentResourceParent = (seed: EcosystemResourceSeed): TreeInstance | undefined => {
  const source = seed.source;
  return source.type === 'tree-dependent'
    ? startingArea.environment.trees.find((tree) => tree.id === source.parentId)
    : undefined;
};

export const createTreeDependentResourceSeeds = (seed = defaultEcosystemSeed): EcosystemResourceSeed[] =>
  treeDependentResourceRules.flatMap((rule) =>
    getResourceParentTrees(rule).flatMap((tree) => {
      const candidates = getValidTreeDependentSpawnCandidates(rule, tree);
      return selectStableSpawnCandidates(rule, tree.id, candidates, seed, rule.maxActivePerParent).map((candidate) => ({
        id: `${tree.id}-${rule.seedIdPrefix}-${candidate.index + 1}`,
        kind: rule.kind,
        x: candidate.x,
        y: candidate.y,
        amount: rule.amount,
        respawnMs: rule.respawnMs,
        source: {
          type: 'tree-dependent' as const,
          parentId: tree.id,
          rule: rule.id,
          ecology: rule.ecology,
          placementNote: rule.placementNote
        }
      }));
    })
  );

export const createZoneDependentResourceSeeds = (seed = defaultEcosystemSeed): EcosystemResourceSeed[] =>
  zoneDependentResourceRules.flatMap((rule) =>
    selectStableSpawnCandidates(rule, rule.zoneId, getValidZoneDependentSpawnCandidates(rule), seed, rule.maxActive)
      .map((candidate) => ({
        id: `${rule.zoneId}-${rule.seedIdPrefix}-${candidate.index + 1}`,
        kind: rule.kind,
        x: candidate.x,
        y: candidate.y,
        amount: rule.amount,
        respawnMs: rule.respawnMs,
        source: {
          type: 'zone-dependent' as const,
          zoneId: rule.zoneId,
          rule: rule.id,
          ecology: rule.ecology,
          placementNote: rule.placementNote
        }
      }))
  );

export const createEcosystemResourceSeeds = (seed = defaultEcosystemSeed): EcosystemResourceSeed[] => [
  ...createTreeDependentResourceSeeds(seed),
  ...createZoneDependentResourceSeeds(seed)
];

export const getValidTreeDependentSpawnCandidates = (
  rule: TreeDependentResourceRule,
  tree: TreeInstance
): readonly EcosystemSpawnCandidate[] =>
  rule.offsets
    .map((offset, index) => ({
      index,
      x: tree.x + offset.x,
      y: tree.y + offset.y
    }))
    .filter((candidate) => isValidTreeDependentSpawn(rule, tree, candidate.x, candidate.y));

export const getValidZoneDependentSpawnCandidates = (
  rule: ZoneDependentResourceRule = dewHerbRule
): readonly EcosystemSpawnCandidate[] =>
  rule.candidates
    .map((candidate, index) => ({
      index,
      x: candidate.x,
      y: candidate.y
    }))
    .filter((candidate) => isValidZoneDependentSpawn(rule, candidate.x, candidate.y));

export const isInsideZoneDependentRegion = (rule: ZoneDependentResourceRule, x: number, y: number): boolean => {
  const region = getZoneOneRegion(rule.zoneId);
  const dx = Math.abs(x - region.center.x);
  const dy = Math.abs(y - region.center.y);

  return dx <= region.radius.x && dy <= region.radius.y;
};

export const isZoneDependentRuleAllowedByRegion = (rule: ZoneDependentResourceRule): boolean => {
  const region = getZoneOneRegion(rule.zoneId);

  return (
    region.resourceKinds.includes(rule.kind) &&
    region.ecologyTags.includes(rule.ecology) &&
    region.resourceProfile.density !== 'none'
  );
};

export const isInsideTreeBranchSpawnBand = (tree: TreeInstance, x: number, y: number): boolean => {
  return isInsideTreeDependentSpawnBand(fallenBranchRule, tree, x, y);
};

const isInsideTreeDependentSpawnBand = (
  rule: TreeDependentResourceRule,
  tree: TreeInstance,
  x: number,
  y: number
): boolean => {
  const dx = x - tree.x;
  const dy = y - tree.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= rule.minDistanceFromTrunk && distance <= rule.maxDistanceFromTrunk;
};

export const isOutsideParentTrunkCollision = (tree: TreeInstance, x: number, y: number): boolean => {
  const collisionEndY = tree.y + tree.trunkCollisionOffsetY;
  const top = Math.min(tree.y, collisionEndY);
  const bottom = Math.max(tree.y, collisionEndY);
  const left = tree.x - tree.trunkCollisionRadius;
  const right = tree.x + tree.trunkCollisionRadius;

  return x < left || x > right || y < top || y > bottom;
};

const isValidTreeDependentSpawn = (
  rule: TreeDependentResourceRule,
  tree: TreeInstance,
  x: number,
  y: number
): boolean =>
  isInsideTreeDependentSpawnBand(rule, tree, x, y) &&
  (!rule.excludeParentTrunkCollision || isOutsideParentTrunkCollision(tree, x, y));

const isValidZoneDependentSpawn = (rule: ZoneDependentResourceRule, x: number, y: number): boolean =>
  isZoneDependentRuleAllowedByRegion(rule) &&
  isInsideZoneDependentRegion(rule, x, y) &&
  isOutsideMapCollision(x, y, rule.collisionClearance);

const selectStableSpawnCandidates = (
  rule: TreeDependentResourceRule | ZoneDependentResourceRule,
  scopeId: string,
  candidates: readonly EcosystemSpawnCandidate[],
  seed: string,
  maxActive: number
): EcosystemSpawnCandidate[] =>
  [...candidates]
    .sort((left, right) => {
      const leftScore = getStableSeedScore(`${seed}:${rule.seedKey}:${scopeId}:${left.index}`);
      const rightScore = getStableSeedScore(`${seed}:${rule.seedKey}:${scopeId}:${right.index}`);
      return leftScore - rightScore;
    })
    .slice(0, maxActive)
    .sort((left, right) => left.index - right.index);

const isOutsideMapCollision = (x: number, y: number, clearance: number): boolean =>
  startingArea.collision.every((obstacle) => {
    const endY = obstacle.segmentEndY ?? obstacle.y;
    const top = Math.min(obstacle.y, endY) - clearance;
    const bottom = Math.max(obstacle.y, endY) + clearance;
    const left = obstacle.x - obstacle.radius - clearance;
    const right = obstacle.x + obstacle.radius + clearance;

    return x < left || x > right || y < top || y > bottom;
  });

const getStableSeedScore = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};
