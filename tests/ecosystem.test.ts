import { describe, expect, it } from 'vitest';
import { createTreeDependentResourceSeeds, getResourceParentTrees, isInsideTreeBranchSpawnBand } from '../src/game/content/ecosystem';
import { createGameState } from '../src/game/simulation/state';

describe('zone one ecosystem rules', () => {
  it('uses resource-parent trees as fallen branch parents', () => {
    const parentTrees = getResourceParentTrees();
    const branches = createTreeDependentResourceSeeds();

    expect(parentTrees.length).toBeGreaterThan(0);
    expect(branches.length).toBe(parentTrees.length * 3);
    for (const branch of branches) {
      const parent = parentTrees.find((tree) => tree.id === branch.source.parentId);

      expect(parent).toBeDefined();
      expect(branch.kind).toBe('wood');
      expect(branch.source.rule).toBe('fallen-branch-near-resource-parent');
      expect(parent && isInsideTreeBranchSpawnBand(parent, branch.x, branch.y)).toBe(true);
    }
  });

  it('adds tree-dependent branches to new game state resources', () => {
    const state = createGameState();
    const ecosystemBranches = state.resources.filter((resource) => resource.source?.type === 'tree-dependent');

    expect(ecosystemBranches.length).toBe(createTreeDependentResourceSeeds().length);
    for (const branch of ecosystemBranches) {
      expect(branch.kind).toBe('wood');
      expect(branch.amount).toBe(1);
    }
  });
});

