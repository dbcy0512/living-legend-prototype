import { describe, expect, it } from 'vitest';
import {
  getZoneOneCampSanctuary,
  getZoneOneEnemyWaveTriggers,
  getZoneOneHabitatAnchorsForTrigger,
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
