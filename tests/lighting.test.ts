import { describe, expect, it } from 'vitest';
import {
  getCampfireLightStrength,
  resolveCampfireLighting,
  resolveWorldLighting
} from '../src/game/simulation/rules/lighting';

describe('world lighting resolver', () => {
  it('makes night visibly darker than clear daylight', () => {
    const day = resolveWorldLighting({
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 0,
      mood: 0.25,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });
    const night = resolveWorldLighting({
      rawNightPressure: 1,
      localNightPressure: 1,
      dawnDuskGlow: 0,
      mood: 0.9,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });

    expect(night.ambient.alpha).toBeGreaterThan(day.ambient.alpha);
    expect(night.shadow.alpha).toBeGreaterThan(day.shadow.alpha);
  });

  it('lets an active nearby fire relieve the global night overlay', () => {
    const exposed = resolveWorldLighting({
      rawNightPressure: 1,
      localNightPressure: 1,
      dawnDuskGlow: 0,
      mood: 0.85,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });
    const sheltered = resolveWorldLighting({
      rawNightPressure: 1,
      localNightPressure: 0.32,
      dawnDuskGlow: 0,
      mood: 0.85,
      coldRatio: 0,
      fireStrength: 1,
      lifePulse: 0
    });

    expect(sheltered.ambient.alpha).toBeLessThan(exposed.ambient.alpha);
    expect(sheltered.campfire.alpha).toBeGreaterThan(0);
  });

  it('routes dawn and dusk glow into a warm overlay layer', () => {
    const quiet = resolveWorldLighting({
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 0,
      mood: 0.3,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });
    const glowing = resolveWorldLighting({
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 1,
      mood: 0.3,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });

    expect(glowing.dawnDusk.alpha).toBeGreaterThan(quiet.dawnDusk.alpha);
  });

  it('keeps cold as a separate readable layer', () => {
    const warmBody = resolveWorldLighting({
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 0,
      mood: 0.3,
      coldRatio: 0,
      fireStrength: 0,
      lifePulse: 0
    });
    const coldBody = resolveWorldLighting({
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 0,
      mood: 0.3,
      coldRatio: 1,
      fireStrength: 0,
      lifePulse: 0
    });

    expect(coldBody.cold.alpha).toBeGreaterThan(warmBody.cold.alpha);
  });

  it('scales campfire radius and ember strength from fuel and integrity', () => {
    const weakStrength = getCampfireLightStrength({
      fuelMs: 2500,
      integrity: 35,
      maxIntegrity: 100
    });
    const strongStrength = getCampfireLightStrength({
      fuelMs: 18000,
      integrity: 100,
      maxIntegrity: 100
    });
    const weakLight = resolveCampfireLighting({
      fireStrength: weakStrength,
      lifePulse: 0
    });
    const strongLight = resolveCampfireLighting({
      fireStrength: strongStrength,
      lifePulse: 1
    });

    expect(strongStrength).toBeGreaterThan(weakStrength);
    expect(strongLight.radius).toBeGreaterThan(weakLight.radius);
    expect(strongLight.emberAlpha).toBeGreaterThan(weakLight.emberAlpha);
  });
});
