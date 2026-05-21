import { describe, expect, it } from 'vitest';
import {
  createStartingResourceSeeds,
  getResourceProfile,
  getResourceProfiles,
  getStaticStartingResourceSeeds
} from '../src/game/content/resources';
import { createEcosystemResourceSeeds } from '../src/game/content/ecosystem';

describe('resource registry', () => {
  it('defines inspectable profiles for each first-zone resource kind', () => {
    const profiles = getResourceProfiles();

    expect(profiles.map((profile) => profile.kind)).toEqual([
      'twigs',
      'dryGrass',
      'bark',
      'wood',
      'stone',
      'herbs',
      'food'
    ]);
    expect(getResourceProfile('dryGrass').openingMaterial).toBe(true);
    expect(getResourceProfile('wood').category).toBe('crafting');
    expect(getResourceProfile('herbs').category).toBe('medicine');
  });

  it('tags static opening resources separately from fixed zone resources', () => {
    const resources = getStaticStartingResourceSeeds();
    const opening = resources.filter((resource) => resource.source?.type === 'opening');
    const fixed = resources.filter((resource) => resource.source?.type === 'fixed-zone');

    expect(opening.map((resource) => resource.kind)).toEqual(['twigs', 'dryGrass', 'bark', 'stone']);
    expect(
      opening.every((resource) => resource.source?.type === 'opening' && resource.source.purpose === 'first-fire')
    ).toBe(true);
    expect(fixed.length).toBeGreaterThan(0);
    expect(
      fixed.some((resource) => resource.source?.type === 'fixed-zone' && resource.source.zoneId === 'wolf-territory-edge')
    ).toBe(true);
  });

  it('combines static and ecosystem resources for new game state creation', () => {
    const seed = 'resource-test-seed';
    const staticResources = getStaticStartingResourceSeeds();
    const ecosystemResources = createEcosystemResourceSeeds(seed);
    const allResources = createStartingResourceSeeds(seed);

    expect(allResources.map((resource) => resource.id)).toEqual([
      ...staticResources.map((resource) => resource.id),
      ...ecosystemResources.map((resource) => resource.id)
    ]);
  });
});
