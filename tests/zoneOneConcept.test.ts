import { describe, expect, it } from 'vitest';
import {
  getZoneOneCampSanctuary,
  getZoneOneEnemyWaveTriggers,
  getZoneOneHabitatAnchorsForTrigger,
  getZoneOnePreparedGroundPatches,
  getZoneOneRegion,
  getZoneOneRegions,
  isPointInsideZoneOneTrigger
} from '../src/game/content/maps/zoneOneConcept';
import { startingArea, startingAreaLayout } from '../src/game/content/maps/startingArea';

describe('zone one concept map', () => {
  it('keeps the camp clearing as the safe hub while resources live in named pockets', () => {
    const regions = getZoneOneRegions();
    const hub = getZoneOneRegion('camp-clearing-hub');

    expect(regions.length).toBeGreaterThanOrEqual(10);
    expect(hub.role).toBe('hub');
    expect(hub.dangerTier).toBe(0);
    expect(hub.resourceKinds).toEqual(['twigs', 'dryGrass', 'bark', 'stone']);
  });

  it('maps the concept resources into explicit region logic', () => {
    expect(getZoneOneRegion('stone-outcrop').resourceKinds).toContain('stone');
    expect(getZoneOneRegion('deadwood-mushrooms').ecologyTags).toContain('tree-shed');
    expect(getZoneOneRegion('herb-berry-patch').resourceKinds).toEqual(['herbs', 'food']);
    expect(getZoneOneRegion('deep-forest').resourceKinds).toEqual(['wood', 'twigs', 'bark']);
  });

  it('gives every POI a full design profile before implementation details depend on it', () => {
    for (const region of getZoneOneRegions()) {
      expect(region.poiProfile.emotionalRole.length).toBeGreaterThan(18);
      expect(region.poiProfile.worldLogic.length).toBeGreaterThan(18);
      expect(region.poiProfile.resourceLogic.length).toBeGreaterThan(18);
      expect(region.poiProfile.threatLogic.length).toBeGreaterThan(18);
      expect(region.poiProfile.progressionUse.length).toBeGreaterThan(18);
      expect(region.poiProfile.placementRules.length).toBeGreaterThanOrEqual(3);
      expect(region.poiProfile.placementRules.every((rule) => rule.length > 18)).toBe(true);
    }
  });

  it('keeps POI resource logic grounded in authored ecology instead of loose pickup placement', () => {
    for (const region of getZoneOneRegions()) {
      if (region.resourceKinds.length <= 0) {
        expect(region.poiProfile.resourceLogic).toContain('No early resources');
        continue;
      }

      expect(region.ecologyTags.length).toBeGreaterThan(0);
      expect(region.poiProfile.placementRules.some((rule) => /ground|tree|shade|edge|shoreline|trail|debris|rock|rot/i.test(rule))).toBe(true);
    }
  });

  it('locks the deadwood POI as the first full living-world pocket standard', () => {
    const deadwood = getZoneOneRegion('deadwood-mushrooms');

    expect(deadwood.poiProfile.emotionalRole).toContain('Decay');
    expect(deadwood.poiProfile.resourceLogic).toContain('prepared rot floor');
    expect(deadwood.poiProfile.threatLogic).toContain('action-triggered');
    expect(deadwood.poiProfile.progressionUse).toContain('disturb the world');
    expect(deadwood.poiProfile.placementRules).toContain('Every spawned creature needs a visible habitat anchor nearby.');
  });

  it('defines enemy wave trigger candidates outside the camp hub', () => {
    const triggers = getZoneOneEnemyWaveTriggers();

    expect(triggers).toHaveLength(3);
    expect(triggers.every((trigger) => trigger.regionId !== 'camp-clearing-hub')).toBe(true);
    expect(triggers[0].enemyKinds).toContain('mire-spider');
    expect(triggers[0].triggerWhen).toBe('gather-resource');
    expect(triggers[1].triggerWhen).toBe('linger-in-region');
  });

  it('defines a tight camp sanctuary and visible habitat anchors for the first action trigger', () => {
    const sanctuary = getZoneOneCampSanctuary();
    const trigger = getZoneOneEnemyWaveTriggers()[0];
    const anchors = getZoneOneHabitatAnchorsForTrigger(trigger.id);

    expect(sanctuary.radius).toBeLessThan(getZoneOneRegion('camp-clearing-hub').radius.x);
    expect(anchors.length).toBeGreaterThanOrEqual(3);
    expect(anchors.every((anchor) => isPointInsideZoneOneTrigger(trigger, anchor.spawnPoint.x, anchor.spawnPoint.y))).toBe(true);
    expect(anchors.some((anchor) => anchor.enemyKinds.includes('violet-moss-blob'))).toBe(true);
  });

  it('prepares the deadwood floor before placing mushrooms and dens', () => {
    const deadwood = getZoneOneRegion('deadwood-mushrooms');
    const patches = getZoneOnePreparedGroundPatches().filter((patch) => patch.regionId === deadwood.id);
    const mushroom = getZoneOneHabitatAnchorsForTrigger('deadwood-skitter-trigger').find(
      (anchor) => anchor.id === 'deadwood-mushroom-habitat'
    );

    expect(patches.map((patch) => patch.material)).toEqual([
      'damp-deadwood-floor',
      'rotting-log-litter',
      'soft-shade-edge'
    ]);
    expect(mushroom).toBeDefined();
    expect(
      patches.some(
        (patch) =>
          mushroom &&
          Math.abs(mushroom.x - patch.center.x) <= patch.radius.x &&
          Math.abs(mushroom.y - patch.center.y) <= patch.radius.y
      )
    ).toBe(true);
  });

  it('spaces zone one POIs far enough to read as separate destinations', () => {
    const camp = getZoneOneRegion('camp-clearing-hub');
    const destinations = [
      getZoneOneRegion('herb-berry-patch'),
      getZoneOneRegion('stone-outcrop'),
      getZoneOneRegion('water-source'),
      getZoneOneRegion('deep-forest'),
      getZoneOneRegion('deadwood-mushrooms'),
      getZoneOneRegion('animal-trails'),
      getZoneOneRegion('future-danger-gate')
    ];

    expect(startingArea.width).toBe(startingAreaLayout.width);
    expect(startingArea.height).toBe(startingAreaLayout.height);
    expect(startingArea.width).toBeGreaterThanOrEqual(2600);
    expect(startingArea.height).toBeGreaterThanOrEqual(1500);
    for (const destination of destinations) {
      expect(distance(camp.center, destination.center)).toBeGreaterThan(430);
    }
  });
});

const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
