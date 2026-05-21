import { describe, expect, it } from 'vitest';
import {
  getZoneOneEnemyWaveTriggers,
  getZoneOneRegion,
  getZoneOneRegions
} from '../src/game/content/maps/zoneOneConcept';

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
    expect(triggers[1].triggerWhen).toBe('linger-in-region');
  });
});

