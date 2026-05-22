import { describe, expect, it } from 'vitest';
import {
  getZoneOneCampSanctuary,
  getZoneOneEnemyWaveTriggers,
  getZoneOneHabitatAnchorsForTrigger,
  getZoneOneLivingCues,
  getZoneOnePoiAnchors,
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

  it('separates resource, enemy, discovery, visibility, and ambient profiles for every region', () => {
    for (const region of getZoneOneRegions()) {
      expect(region.resourceProfile.density).toMatch(/none|sparse|common|rich/);
      expect(region.resourceProfile.renewalRule).toMatch(/daily|after-rain|seasonal|manual-reset|none/);
      expect(region.enemyPressureProfile.nighttimeTier).toBeGreaterThanOrEqual(region.enemyPressureProfile.daytimeTier);
      expect(region.discoveryProfile.firstVisitMessage.length).toBeGreaterThan(12);
      expect(region.discoveryProfile.inspectables.length).toBeGreaterThan(0);
      expect(region.discoveryProfile.returnReasons.length).toBeGreaterThan(0);
      expect(region.visibilityProfile.canopyDensity).toBeGreaterThanOrEqual(0);
      expect(region.visibilityProfile.sightPenalty).toBeGreaterThanOrEqual(0);
      expect(region.ambientProfile.soundscape.length).toBeGreaterThan(0);
      expect(region.requiredUnlocks).toBeDefined();
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
    expect(deadwood.resourceProfile.overharvestEffect).toBe('enemy-trigger');
    expect(deadwood.enemyPressureProfile.triggerIds).toContain('deadwood-skitter-trigger');
  });

  it('distinguishes routine dense forest from true deep forest danger', () => {
    const dense = getZoneOneRegion('dense-forest-east');
    const deep = getZoneOneRegion('deep-forest');

    expect(dense.role).toBe('resource-habitat');
    expect(deep.role).toBe('resource-habitat');
    expect(deep.dangerTier).toBeGreaterThan(dense.dangerTier);
    expect(deep.resourceProfile.density).toBe('rich');
    expect(deep.enemyPressureProfile.nighttimeTier).toBeGreaterThan(dense.enemyPressureProfile.nighttimeTier);
    expect(deep.visibilityProfile.sightPenalty).toBeGreaterThan(dense.visibilityProfile.sightPenalty);
    expect(deep.visibilityProfile.minimapReveal).toBe('requires-scouting');
  });

  it('treats animal trails as information and pressure corridors instead of normal loot pockets', () => {
    const trails = getZoneOneRegion('animal-trails');

    expect(trails.role).toBe('travel-corridor');
    expect(trails.resourceProfile.density).toBe('sparse');
    expect(trails.enemyPressureProfile.triggerIds).toContain('animal-trail-pressure-trigger');
    expect(trails.discoveryProfile.inspectables).toContain('fresh-tracks');
    expect(trails.discoveryProfile.unlockHints.join(' ')).toContain('information');
  });

  it('keeps the future danger gate as a soft-gated mystery instead of a resource farm', () => {
    const gate = getZoneOneRegion('future-danger-gate');

    expect(gate.role).toBe('danger-gate');
    expect(gate.resourceProfile.density).toBe('none');
    expect(gate.accessState).toBe('soft-warning');
    expect(gate.requiredUnlocks).toContain('crafted-torch');
    expect(gate.ambientProfile.musicMood).toBe('mystery');
    expect(gate.discoveryProfile.inspectables).toContain('cold-stone-marker');
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
    expect(sanctuary.suppressEnemySpawns).toBe(true);
    expect(sanctuary.suppressHostileProjectiles).toBe(true);
    expect(sanctuary.allowThreatAtNightEdge).toBe(true);
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
    expect(patches.every((patch) => patch.opacity > 0 && patch.opacity <= 1)).toBe(true);
    expect(patches.every((patch) => patch.scatterDensity >= 1)).toBe(true);
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

  it('prepares readable ground areas for the first resource POIs', () => {
    const patches = getZoneOnePreparedGroundPatches();
    const campDryGrass = patches.find((patch) => patch.id === 'camp-dry-grass-edge');
    const herbBerry = patches.find((patch) => patch.id === 'herb-berry-flower-meadow');
    const stoneOutcrop = patches.find((patch) => patch.id === 'stone-outcrop-rubble-field');
    const waterPool = patches.find((patch) => patch.id === 'water-source-pool');
    const reedBend = patches.find((patch) => patch.id === 'water-source-reed-bend');
    const wetBank = patches.find((patch) => patch.id === 'water-source-wet-bank');

    expect(campDryGrass?.regionId).toBe('camp-clearing-hub');
    expect(campDryGrass?.material).toBe('dry-clearing-edge');
    expect(campDryGrass?.scatterDensity).toBe(3);
    expect(herbBerry?.regionId).toBe('herb-berry-patch');
    expect(herbBerry?.material).toBe('flower-meadow');
    expect(stoneOutcrop?.regionId).toBe('stone-outcrop');
    expect(stoneOutcrop?.material).toBe('stone-rubble');
    expect(waterPool?.regionId).toBe('water-source');
    expect(waterPool?.material).toBe('water-body');
    expect(reedBend?.regionId).toBe('water-source');
    expect(reedBend?.material).toBe('reed-bank');
    expect(wetBank?.regionId).toBe('water-source');
    expect(wetBank?.material).toBe('muddy-bank');
  });

  it('places generated POI anchors inside the regions they explain', () => {
    const anchors = getZoneOnePoiAnchors();

    expect(anchors.map((anchor) => anchor.id)).toEqual([
      'poi-herb-berry-living-patch',
      'poi-stone-outcrop-landmark',
      'poi-water-source-pond',
      'poi-clay-mud-bank',
      'poi-deep-forest-deadfall',
      'poi-dense-forest-windfall',
      'poi-animal-trail-crossing',
      'poi-future-danger-gate',
      'camp-basic-workbench-station'
    ]);
    for (const anchor of anchors) {
      const region = getZoneOneRegion(anchor.regionId);

      expect(Math.abs(anchor.x - region.center.x)).toBeLessThanOrEqual(region.radius.x + 130);
      expect(Math.abs(anchor.y - region.center.y)).toBeLessThanOrEqual(region.radius.y + 130);
      expect(anchor.scale).toBeGreaterThan(0);
      for (const kind of anchor.resourceKinds) {
        expect(region.resourceKinds).toContain(kind);
      }
      expect(anchor.designIntent.length).toBeGreaterThan(28);
    }
  });

  it('keeps the workbench anchor tied to progression instead of starting visible as scenery', () => {
    const workbench = getZoneOnePoiAnchors().find((anchor) => anchor.id === 'camp-basic-workbench-station');

    expect(workbench?.regionId).toBe('camp-clearing-hub');
    expect(workbench?.visibleWhen).toBe('basic-workbench-built');
    expect(workbench?.resourceKinds).toEqual([]);
    expect(workbench?.designIntent).toContain('earns and builds');
  });

  it('authors living map cues for POIs that should not feel static', () => {
    const cues = getZoneOneLivingCues();
    const regionIds = new Set(getZoneOneRegions().map((region) => region.id));

    expect(cues.length).toBeGreaterThanOrEqual(7);
    expect(cues.every((cue) => regionIds.has(cue.regionId))).toBe(true);
    expect(cues.map((cue) => cue.kind)).toContain('water-ripple');
    expect(cues.map((cue) => cue.kind)).toContain('reed-sway');
    expect(cues.map((cue) => cue.kind)).toContain('grass-sway');
    expect(cues.map((cue) => cue.kind)).toContain('insect-mote');
    expect(cues.map((cue) => cue.kind)).toContain('spore-mote');
    expect(cues.map((cue) => cue.kind)).toContain('leaf-drift');
    expect(cues.map((cue) => cue.kind)).toContain('trail-dust');
    expect(cues.every((cue) => cue.intensity >= 1 && cue.intensity <= 3)).toBe(true);
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
