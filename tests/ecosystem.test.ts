import { describe, expect, it } from 'vitest';
import {
  createEcosystemResourceSeeds,
  createTreeDependentResourceSeeds,
  createZoneDependentResourceSeeds,
  defaultEcosystemSeed,
  getResourceParentTrees,
  getTreeDependentResourceParent,
  getTreeDependentResourceRules,
  getValidZoneDependentSpawnCandidates,
  getZoneDependentResourceRules,
  getValidTreeDependentSpawnCandidates,
  isInsideTreeBranchSpawnBand,
  isOutsideParentTrunkCollision,
  isTreeDependentResourceSeed,
  isZoneDependentResourceSeed
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
    expect(fallenBranchRule?.ecology).toBe('tree-shed');
    expect(fallenBranchRule?.offsets.length).toBeGreaterThan(fallenBranchRule?.maxActivePerParent ?? 0);
  });

  it('defines zone-dependent herb rules as inspectable data', () => {
    const rules = getZoneDependentResourceRules();
    const herbRule = rules.find((rule) => rule.id === 'dew-herb-near-first-shelter');

    expect(herbRule).toBeDefined();
    expect(herbRule?.kind).toBe('herbs');
    expect(herbRule?.zoneId).toBe('first-shelter-edge');
    expect(herbRule?.maxActive).toBe(2);
    expect(herbRule?.ecology).toBe('damp-shade');
    expect(herbRule?.candidates.length).toBeGreaterThan(herbRule?.maxActive ?? 0);
  });

  it('defines zone-dependent resource rules for more than herbs', () => {
    const rules = getZoneDependentResourceRules();

    expect(rules.map((rule) => rule.kind)).toEqual(['herbs', 'stone', 'dryGrass']);
    expect(rules.find((rule) => rule.id === 'loose-stone-near-wolf-edge')?.zoneId).toBe('wolf-territory-edge');
    expect(rules.find((rule) => rule.id === 'wind-dry-grass-first-clearing')?.zoneId).toBe('first-clearing');
  });

  it('uses resource-parent trees as fallen branch parents', () => {
    const fallenBranchRule = getTreeDependentResourceRules()[0];
    const parentTrees = getResourceParentTrees(fallenBranchRule);
    const branches = createTreeDependentResourceSeeds();

    expect(parentTrees.length).toBeGreaterThan(0);
    expect(branches.length).toBe(parentTrees.length * 3);
    for (const branch of branches) {
      const source = branch.source;
      if (source.type !== 'tree-dependent') {
        throw new Error('tree-dependent branch fixture has wrong source type');
      }
      const parent = parentTrees.find((tree) => tree.id === source.parentId);

      expect(parent).toBeDefined();
      expect(branch.kind).toBe('wood');
      expect(isTreeDependentResourceSeed(branch)).toBe(true);
      expect(branch.source.rule).toBe('fallen-branch-near-resource-parent');
      expect(branch.source.ecology).toBe('tree-shed');
      expect(branch.source.placementNote).toContain('windfall');
      expect(parent && isInsideTreeBranchSpawnBand(parent, branch.x, branch.y)).toBe(true);
      expect(parent && isOutsideParentTrunkCollision(parent, branch.x, branch.y)).toBe(true);
    }
  });

  it('chooses active tree-dependent resources from a larger valid candidate pool', () => {
    const fallenBranchRule = getTreeDependentResourceRules()[0];
    const parentTrees = getResourceParentTrees(fallenBranchRule);

    for (const parent of parentTrees) {
      const candidates = getValidTreeDependentSpawnCandidates(fallenBranchRule, parent);
      const branches = createTreeDependentResourceSeeds().filter(
        (branch) => branch.source.type === 'tree-dependent' && branch.source.parentId === parent.id
      );

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

  it('creates zone-dependent herbs from valid seeded candidates', () => {
    const herbRule = getZoneDependentResourceRules()[0];
    const candidates = getValidZoneDependentSpawnCandidates(herbRule);
    const herbs = createZoneDependentResourceSeeds().filter((resource) => resource.source.rule === herbRule.id);

    expect(candidates.length).toBeGreaterThan(herbs.length);
    expect(herbs.length).toBe(herbRule.maxActive);
    for (const herb of herbs) {
      expect(herb.kind).toBe('herbs');
      expect(isZoneDependentResourceSeed(herb)).toBe(true);
      expect(herb.source.type).toBe('zone-dependent');
      expect(candidates.some((candidate) => candidate.x === herb.x && candidate.y === herb.y)).toBe(true);
    }
  });

  it('creates seeded zone-dependent resources for each active zone rule', () => {
    const rules = getZoneDependentResourceRules();
    const resources = createZoneDependentResourceSeeds('zone-resource-seed');

    for (const rule of rules) {
      const byRule = resources.filter((resource) => resource.source.rule === rule.id);

      expect(byRule).toHaveLength(rule.maxActive);
      expect(byRule.every((resource) => resource.kind === rule.kind)).toBe(true);
      expect(
        byRule.every(
          (resource) =>
            resource.source.type === 'zone-dependent' &&
            resource.source.zoneId === rule.zoneId &&
            resource.source.ecology === rule.ecology &&
            resource.source.placementNote === rule.placementNote
        )
      ).toBe(true);
    }
  });

  it('creates all current ecosystem resource seeds through the combined generator', () => {
    expect(createEcosystemResourceSeeds()).toHaveLength(
      createTreeDependentResourceSeeds().length + createZoneDependentResourceSeeds().length
    );
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

  it('stores the ecosystem seed on game state and uses it to create resources', () => {
    const state = createGameState({ ecosystemSeed: 'test-seed-b' });
    const seededResources = createEcosystemResourceSeeds('test-seed-b');
    const ecosystemResources = state.resources.filter(
      (resource) => resource.source?.type === 'tree-dependent' || resource.source?.type === 'zone-dependent'
    );

    expect(state.ecosystem.seed).toBe('test-seed-b');
    expect(ecosystemResources.map((resource) => resource.id)).toEqual(seededResources.map((resource) => resource.id));
  });

  it('uses the default ecosystem seed when no game state option is provided', () => {
    const state = createGameState();

    expect(state.ecosystem.seed).toBe(defaultEcosystemSeed);
  });

  it('keeps tree-dependent branch parent rules inspectable', () => {
    for (const branch of createTreeDependentResourceSeeds()) {
      const parent = getTreeDependentResourceParent(branch);

      expect(parent?.placementRole).toBe('resource-parent');
      expect(parent?.zoneTags).toContain('wolf-territory');
    }
  });
});
