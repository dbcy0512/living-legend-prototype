import { startingArea, type TreeInstance } from './maps/startingArea';

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
    rule: 'fallen-branch-near-resource-parent';
  };
};

const branchSpawnOffsets = [
  { x: -54, y: 46 },
  { x: 46, y: 38 },
  { x: 18, y: 70 }
] as const;

const branchSpawnMinDistanceFromTrunk = 34;
const branchSpawnMaxDistanceFromTrunk = 96;

export const getResourceParentTrees = (): readonly TreeInstance[] =>
  startingArea.environment.trees.filter((tree) => tree.placementRole === 'resource-parent');

export const isTreeDependentResourceSeed = (seed: EcosystemResourceSeed): boolean =>
  seed.source.type === 'tree-dependent' && seed.source.rule === 'fallen-branch-near-resource-parent';

export const getTreeDependentResourceParent = (seed: EcosystemResourceSeed): TreeInstance | undefined =>
  getResourceParentTrees().find((tree) => tree.id === seed.source.parentId);

export const createTreeDependentResourceSeeds = (): EcosystemResourceSeed[] =>
  getResourceParentTrees().flatMap((tree) =>
    branchSpawnOffsets.map((offset, index) => ({
      id: `${tree.id}-fallen-branch-${index + 1}`,
      kind: 'wood',
      x: tree.x + offset.x,
      y: tree.y + offset.y,
      amount: 1,
      respawnMs: 0,
      source: {
        type: 'tree-dependent',
        parentId: tree.id,
        rule: 'fallen-branch-near-resource-parent'
      }
    }))
  );

export const isInsideTreeBranchSpawnBand = (tree: TreeInstance, x: number, y: number): boolean => {
  const dx = x - tree.x;
  const dy = y - tree.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance >= branchSpawnMinDistanceFromTrunk && distance <= branchSpawnMaxDistanceFromTrunk;
};

export const isOutsideParentTrunkCollision = (tree: TreeInstance, x: number, y: number): boolean => {
  const collisionEndY = tree.y + tree.trunkCollisionOffsetY;
  const top = Math.min(tree.y, collisionEndY);
  const bottom = Math.max(tree.y, collisionEndY);
  const left = tree.x - tree.trunkCollisionRadius;
  const right = tree.x + tree.trunkCollisionRadius;

  return x < left || x > right || y < top || y > bottom;
};
