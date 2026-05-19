import { startingArea, type TreeInstance, type TreePlacementRole } from './maps/startingArea';

export type EcosystemResourceRuleId = 'fallen-branch-near-resource-parent';

export type TreeDependentResourceRule = {
  id: EcosystemResourceRuleId;
  seedKey: string;
  seedIdPrefix: string;
  kind: 'wood';
  parentRole: TreePlacementRole;
  amount: number;
  respawnMs: number;
  maxActivePerParent: number;
  minDistanceFromTrunk: number;
  maxDistanceFromTrunk: number;
  excludeParentTrunkCollision: boolean;
  offsets: readonly { x: number; y: number }[];
};

type TreeDependentSpawnCandidate = {
  index: number;
  x: number;
  y: number;
};

export type EcosystemResourceSeed = {
  id: string;
  kind: 'wood';
  x: number;
  y: number;
  amount: number;
  respawnMs: number;
  source: {
    type: 'tree-dependent';
    parentId: string;
    rule: EcosystemResourceRuleId;
  };
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

const fallenBranchRule = treeDependentResourceRules[0];

export const getTreeDependentResourceRules = (): readonly TreeDependentResourceRule[] => treeDependentResourceRules;

export const getResourceParentTrees = (rule: TreeDependentResourceRule = fallenBranchRule): readonly TreeInstance[] =>
  startingArea.environment.trees.filter((tree) => tree.placementRole === rule.parentRole);

export const isTreeDependentResourceSeed = (seed: EcosystemResourceSeed): boolean =>
  seed.source.type === 'tree-dependent' &&
  treeDependentResourceRules.some((rule) => rule.id === seed.source.rule);

export const getTreeDependentResourceParent = (seed: EcosystemResourceSeed): TreeInstance | undefined =>
  startingArea.environment.trees.find((tree) => tree.id === seed.source.parentId);

export const createTreeDependentResourceSeeds = (seed = defaultEcosystemSeed): EcosystemResourceSeed[] =>
  treeDependentResourceRules.flatMap((rule) =>
    getResourceParentTrees(rule).flatMap((tree) => {
      const candidates = getValidTreeDependentSpawnCandidates(rule, tree);
      return selectStableSpawnCandidates(rule, tree, candidates, seed).map((candidate) => ({
        id: `${tree.id}-${rule.seedIdPrefix}-${candidate.index + 1}`,
        kind: rule.kind,
        x: candidate.x,
        y: candidate.y,
        amount: rule.amount,
        respawnMs: rule.respawnMs,
        source: {
          type: 'tree-dependent' as const,
          parentId: tree.id,
          rule: rule.id
        }
      }));
    })
  );

export const getValidTreeDependentSpawnCandidates = (
  rule: TreeDependentResourceRule,
  tree: TreeInstance
): readonly TreeDependentSpawnCandidate[] =>
  rule.offsets
    .map((offset, index) => ({
      index,
      x: tree.x + offset.x,
      y: tree.y + offset.y
    }))
    .filter((candidate) => isValidTreeDependentSpawn(rule, tree, candidate.x, candidate.y));

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

const selectStableSpawnCandidates = (
  rule: TreeDependentResourceRule,
  tree: TreeInstance,
  candidates: readonly TreeDependentSpawnCandidate[],
  seed: string
): TreeDependentSpawnCandidate[] =>
  [...candidates]
    .sort((left, right) => {
      const leftScore = getStableSeedScore(`${seed}:${rule.seedKey}:${tree.id}:${left.index}`);
      const rightScore = getStableSeedScore(`${seed}:${rule.seedKey}:${tree.id}:${right.index}`);
      return leftScore - rightScore;
    })
    .slice(0, rule.maxActivePerParent)
    .sort((left, right) => left.index - right.index);

const getStableSeedScore = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};
