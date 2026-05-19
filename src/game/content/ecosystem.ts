import { startingArea, type TreeInstance, type TreePlacementRole } from './maps/startingArea';

export type EcosystemResourceRuleId = 'fallen-branch-near-resource-parent';

export type TreeDependentResourceRule = {
  id: EcosystemResourceRuleId;
  seedIdPrefix: string;
  kind: 'wood';
  parentRole: TreePlacementRole;
  amount: number;
  respawnMs: number;
  minDistanceFromTrunk: number;
  maxDistanceFromTrunk: number;
  excludeParentTrunkCollision: boolean;
  offsets: readonly { x: number; y: number }[];
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

const treeDependentResourceRules = [
  {
    id: 'fallen-branch-near-resource-parent',
    seedIdPrefix: 'fallen-branch',
    kind: 'wood',
    parentRole: 'resource-parent',
    amount: 1,
    respawnMs: 0,
    minDistanceFromTrunk: 34,
    maxDistanceFromTrunk: 96,
    excludeParentTrunkCollision: true,
    offsets: [
      { x: -54, y: 46 },
      { x: 46, y: 38 },
      { x: 18, y: 70 }
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

export const createTreeDependentResourceSeeds = (): EcosystemResourceSeed[] =>
  treeDependentResourceRules.flatMap((rule) =>
    getResourceParentTrees(rule).flatMap((tree) =>
      rule.offsets
        .map((offset, index) => ({
          id: `${tree.id}-${rule.seedIdPrefix}-${index + 1}`,
          kind: rule.kind,
          x: tree.x + offset.x,
          y: tree.y + offset.y,
          amount: rule.amount,
          respawnMs: rule.respawnMs,
          source: {
            type: 'tree-dependent' as const,
            parentId: tree.id,
            rule: rule.id
          }
        }))
        .filter((seed) => isValidTreeDependentSpawn(rule, tree, seed.x, seed.y))
    )
  );

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
