import { clamp } from './math';

export type LightingLayer = {
  color: number;
  alpha: number;
};

export type CampfireLightingProfile = LightingLayer & {
  radius: number;
  coreRadius: number;
  emberAlpha: number;
};

export type WorldLightingProfile = {
  ambient: LightingLayer;
  dawnDusk: LightingLayer;
  cold: LightingLayer;
  shadow: LightingLayer;
  campfire: CampfireLightingProfile;
};

export type WorldLightingInput = {
  rawNightPressure: number;
  localNightPressure: number;
  dawnDuskGlow: number;
  mood: number;
  coldRatio: number;
  fireStrength: number;
  lifePulse: number;
};

export type CampfireLightingInput = {
  fireStrength: number;
  lifePulse: number;
  firstFlamePulse?: boolean;
};

export const resolveWorldLighting = (input: WorldLightingInput): WorldLightingProfile => {
  const rawNightPressure = clamp(input.rawNightPressure, 0, 1);
  const localNightPressure = clamp(input.localNightPressure, 0, 1);
  const dawnDuskGlow = clamp(input.dawnDuskGlow, 0, 1);
  const mood = clamp(input.mood, 0, 1);
  const coldRatio = clamp(input.coldRatio, 0, 1);
  const safetyRelief = clamp(rawNightPressure - localNightPressure, 0, 1);

  return {
    ambient: {
      color: 0x111827,
      alpha: clamp(0.06 + mood * 0.32 - safetyRelief * 0.16, 0.04, 0.62)
    },
    dawnDusk: {
      color: 0xf7b267,
      alpha: clamp(dawnDuskGlow * 0.16, 0, 0.22)
    },
    cold: {
      color: 0x8fd3ff,
      alpha: clamp(coldRatio * 0.18, 0, 0.24)
    },
    shadow: {
      color: 0x06111f,
      alpha: clamp(localNightPressure * 0.18 + rawNightPressure * 0.06, 0, 0.3)
    },
    campfire: resolveCampfireLighting({
      fireStrength: input.fireStrength,
      lifePulse: input.lifePulse
    })
  };
};

export const resolveCampfireLighting = (input: CampfireLightingInput): CampfireLightingProfile => {
  const fireStrength = clamp(input.fireStrength, 0, 1);
  const lifePulse = clamp(input.lifePulse, 0, 1);
  const firstFlameBoost = input.firstFlamePulse ? 1.22 : 1;
  const livingPulse = 0.88 + lifePulse * 0.22;

  return {
    color: 0xffb84d,
    alpha: clamp(fireStrength * livingPulse * firstFlameBoost * 0.34, 0, 0.48),
    radius: clamp((76 + fireStrength * 84) * livingPulse * firstFlameBoost, 0, 190),
    coreRadius: clamp((26 + fireStrength * 34) * firstFlameBoost, 0, 82),
    emberAlpha: clamp(0.18 + fireStrength * (0.22 + lifePulse * 0.2), 0, 0.64)
  };
};

export const getCampfireLightStrength = (input: {
  fuelMs: number;
  integrity: number;
  maxIntegrity: number;
}): number => {
  if (input.fuelMs <= 0 || input.integrity <= 0 || input.maxIntegrity <= 0) {
    return 0;
  }

  const integrityRatio = clamp(input.integrity / input.maxIntegrity, 0, 1);
  const fuelStability = clamp(input.fuelMs / 18000, 0.34, 1);
  return clamp(integrityRatio * fuelStability, 0, 1);
};

export const createDefaultWorldLighting = (): WorldLightingProfile =>
  resolveWorldLighting({
    rawNightPressure: 0,
    localNightPressure: 0,
    dawnDuskGlow: 0,
    mood: 0.45,
    coldRatio: 1,
    fireStrength: 0,
    lifePulse: 0
  });
