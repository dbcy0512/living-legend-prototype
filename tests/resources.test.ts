import { describe, expect, it } from 'vitest';
import {
  createStartingResourceSeeds,
  getResourcePlacementMode,
  getResourceProfile,
  getResourceProfiles,
  getStaticStartingResourceSeeds,
  isEcosystemResourceSource
} from '../src/game/content/resources';
import { createEcosystemResourceSeeds } from '../src/game/content/ecosystem';
import { getZoneOneRegion } from '../src/game/content/maps/zoneOneConcept';

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

  it('defines resource readability and interaction tuning on profiles', () => {
    expect(getResourceProfile('dryGrass').interactionRadius).toBeGreaterThan(getResourceProfile('stone').interactionRadius);
    expect(getResourceProfile('dryGrass').visualScale).toBeGreaterThan(getResourceProfile('food').visualScale);
    expect(getResourceProfile('wood').highlightWidth).toBeGreaterThan(getResourceProfile('herbs').highlightWidth);
    expect(getResourceProfiles().every((profile) => profile.facingReach > 0 && profile.highlightHeight > 0)).toBe(true);
    expect(getResourceProfile('wood').ecologyTags).toContain('tree-shed');
    expect(getResourceProfile('stone').placementLogic).toContain('exposed dirt');
  });

  it('tags static opening resources separately from fixed zone resources', () => {
    const resources = getStaticStartingResourceSeeds();
    const opening = resources.filter((resource) => resource.source?.type === 'opening');
    const fixed = resources.filter((resource) => resource.source?.type === 'fixed-zone');

    expect(opening.map((resource) => resource.kind)).toEqual(['twigs', 'dryGrass', 'bark', 'stone']);
    expect(
      opening.every((resource) => resource.source?.type === 'opening' && resource.source.purpose === 'first-fire')
    ).toBe(true);
    expect(opening.map((resource) => resource.source?.ecology)).toEqual([
      'dead-fire-debris',
      'dry-clearing-edge',
      'tree-shed',
      'exposed-stone'
    ]);
    expect(fixed.length).toBeGreaterThan(0);
    expect(
      fixed.some((resource) => resource.source?.type === 'fixed-zone' && resource.source.zoneId === 'stone-outcrop')
    ).toBe(true);
    expect(resources.every((resource) => resource.source?.type === 'opening' || resource.source?.type === 'fixed-zone')).toBe(true);
    expect(fixed.every((resource) => resource.source?.placementNote)).toBe(true);
  });

  it('keeps authored fixed resources inside POIs that support their ecology', () => {
    const fixed = getStaticStartingResourceSeeds().filter((resource) => resource.source?.type === 'fixed-zone');

    expect(fixed.map((resource) => {
      if (resource.source?.type !== 'fixed-zone') {
        throw new Error('fixed resource fixture has wrong source type');
      }
      return resource.source.zoneId;
    })).toEqual(
      expect.arrayContaining([
        'herb-berry-patch',
        'stone-outcrop',
        'water-source',
        'clay-mud-bank',
        'deep-forest',
        'dense-forest-east',
        'deadwood-mushrooms',
        'animal-trails'
      ])
    );
    for (const resource of fixed) {
      if (resource.source?.type !== 'fixed-zone') {
        throw new Error('fixed resource fixture has wrong source type');
      }
      const region = getZoneOneRegion(resource.source.zoneId);

      expect(region.resourceKinds).toContain(resource.kind);
      expect(region.ecologyTags).toContain(resource.source.ecology);
      expect(Math.abs(resource.x - region.center.x)).toBeLessThanOrEqual(region.radius.x + 210);
      expect(Math.abs(resource.y - region.center.y)).toBeLessThanOrEqual(region.radius.y + 210);
    }
  });

  it('classifies placement modes for authored and living-world resource sources', () => {
    const opening = getStaticStartingResourceSeeds().find((resource) => resource.source?.type === 'opening');
    const fixed = getStaticStartingResourceSeeds().find((resource) => resource.source?.type === 'fixed-zone');
    const treeAttached = createEcosystemResourceSeeds('placement-test').find(
      (resource) => resource.source.type === 'tree-dependent'
    );
    const zoneSeeded = createEcosystemResourceSeeds('placement-test').find(
      (resource) => resource.source.type === 'zone-dependent'
    );

    expect(getResourcePlacementMode(opening?.source)).toBe('opening-fixed');
    expect(getResourcePlacementMode(fixed?.source)).toBe('zone-fixed');
    expect(getResourcePlacementMode(treeAttached?.source)).toBe('tree-attached');
    expect(getResourcePlacementMode(zoneSeeded?.source)).toBe('zone-seeded');
    expect(getResourcePlacementMode()).toBe('unplaced');
    expect(isEcosystemResourceSource(opening?.source)).toBe(false);
    expect(isEcosystemResourceSource(zoneSeeded?.source)).toBe(true);
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
