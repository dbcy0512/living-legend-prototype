import type { EnemyState } from '../state';
import { clamp } from './math';

export type DamageResponse = {
  fearGain: number;
  recoveryMs: number;
};

const heavyDamageRatio = 0.55;
const criticalHealthRatio = 0.25;

export const getDamageResponse = (damage: number, healthAfterDamage: number, maxHealth: number): DamageResponse => {
  const damageRatio = maxHealth > 0 ? damage / maxHealth : 0;
  const healthRatio = maxHealth > 0 ? healthAfterDamage / maxHealth : 0;
  let fearGain = 8 + damageRatio * 16;
  let recoveryMs = 520;

  if (damageRatio >= heavyDamageRatio) {
    fearGain += 22;
    recoveryMs = 900;
  }

  if (healthAfterDamage > 0 && healthRatio <= criticalHealthRatio) {
    fearGain += 35;
    recoveryMs = Math.max(recoveryMs, 1200);
  }

  return {
    fearGain: Math.round(fearGain),
    recoveryMs
  };
};

export const applyCreatureDamageResponse = (creature: EnemyState, damage: number): DamageResponse => {
  const response = getDamageResponse(damage, creature.health, creature.maxHealth);
  creature.fear = clamp(creature.fear + response.fearGain, 0, 100);
  return response;
};
