import { describe, expect, it } from 'vitest';
import {
  createTreeDependentResourceSeeds,
  getResourceParentTrees,
  getTreeDependentResourceParent,
  getTreeDependentResourceRules,
  getValidTreeDependentSpawnCandidates,
  isInsideTreeBranchSpawnBand,
  isOutsideParentTrunkCollision,
  isTreeDependentResourceSeed
} from '../src/game/content/ecosystem';
import { createGameState } from '../src/game/simulation/state';

describe('zone one ecosystem rules', () => {
  it('defines tree-dependent resource rules as inspectable data', () => {
    const rules = getTreeDependentResourceRules();
    const fallenBranchRule = rules.find((rule) => rule.id === 'fallen-branch-near-resource-parent');

    expect(fallenBranchRule).toBeDefined();
    expect(fallenBranchRule?.parentRole).toBe('resource-parent');
    expect(fallenBranchRule?.kind).toBe('wood');
    expect(fallenBranchRule?.excludeParentTrunkCollision).toBe(true);
    expect(fallenBranchRule?.maxActivePerParent).toBe(3);
    expect(fallenBranchRule?.offsets.length).toBeGreaterThan(fallenBranchRule?.maxActivePerParent ?? 0);
  });

  it('uses resource-parent trees as fallen branch parents', () => {
    const fallenBranchRule = getTreeDependentResourceRules()[0];
    const parentTrees = getResourceParentTrees(fallenBranchRule);
    const branches = createTreeDependentResourceSeeds();

    expect(parentTrees.length).toBeGreaterThan(0);
    expect(branches.length).toBe(parentTrees.length * 3);
    for (const branch of branches) {
      const parent = parentTrees.find((tree) => tree.id === branch.source.parentId);

      expect(parent).toBeDefined();
      expect(branch.kind).toBe('wood');
      expect(isTreeDependentResourceSeed(branch)).toBe(true);
      expect(branch.source.rule).toBe('fallen-branch-near-resource-parent');
      expect(parent && isInsideTreeBranchSpawnBand(parent, branch.x, branch.y)).toBe(true);
      expect(parent && isOutsideParentTrunkCollision(parent, branch.x, branch.y)).toBe(true);
    }
  });

  it('chooses active tree-dependent resources from a larger valid candidate pool', () => {
    const fallenBranchRule = getTreeDependentResourceRules()[0];
    const parentTrees = getResourceParentTrees(fallenBranchRule);

    for (const parent of parentTrees) {
      const candidates = getValidTreeDependentSpawnCandidates(fallenBranchRule, parent);
      const branches = createTreeDependentResourceSeeds().filter((branch) => branch.source.parentId === parent.id);

      expect(candidates.length).toBeGreaterThan(branches.length);
      expect(branches.length).toBe(fallenBranchRule.maxActivePerParent);
      for (const branch of branches) {
        expect(candidates.some((candidate) => candidate.x === branch.x && candidate.y === branch.y)).toBe(true);
      }
    }
  });

  it('uses a stable seed for controlled resource variation', () => {
    const firstPass = createTreeDependentResourceSeeds('test-seed-a').map((branch) => branch.id);
    const secondPass = createTreeDependentResourceSeeds('test-seed-a').map((branch) => branch.id);
    const differentSeed = createTreeDependentResourceSeeds('test-seed-b').map((branch) => branch.id);

    expect(secondPass).toEqual(firstPass);
    expect(differentSeed).not.toEqual(firstPass);
  });

  it('adds tree-dependent branches to new game state resources', () => {
    const state = createGameState();
    const seeds = createTreeDependentResourceSeeds();
    const ecosystemBranches = state.resources.filter((resource) => resource.source?.type === 'tree-dependent');

    expect(ecosystemBranches.length).toBe(seeds.length);
    for (const branch of ecosystemBranches) {
      const seed = seeds.find((candidate) => candidate.id === branch.id);

      expect(seed).toBeDefined();
      expect(branch.kind).toBe('wood');
      expect(branch.amount).toBe(1);
      expect(branch.source).toEqual(seed?.source);
    }
  });

  it('keeps tree-dependent branch parent rules inspectable', () => {
    for (const branch of createTreeDependentResourceSeeds()) {
      const parent = getTreeDependentResourceParent(branch);

      expect(parent?.placementRole).toBe('resource-parent');
      expect(parent?.zoneTags).toContain('wolf-territory');
    }
  });
});
