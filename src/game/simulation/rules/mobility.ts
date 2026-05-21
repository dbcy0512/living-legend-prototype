import type { GameState } from '../state';

export const dodgeRollDurationMs = 280;
export const baseDodgeRollCost = 26;
export const cleanerDodgeRollCost = 22;
export const baseDodgeRollCooldownMs = 420;
export const cleanerDodgeRollCooldownMs = 360;

export type MobilityFrame = {
  keyLabel: 'Shift';
  label: 'Dodge Roll' | 'Cleaner Roll';
  roleLabel: 'MOB' | 'MOB+';
  staminaCost: number;
  ready: boolean;
  evolved: boolean;
  cooldownMs: number;
  cooldownDurationMs: number;
};

export const getDodgeRollCost = (state: GameState): number =>
  state.evolution.cleanerRoll ? cleanerDodgeRollCost : baseDodgeRollCost;

export const getDodgeRollCooldownMs = (state: GameState): number =>
  state.evolution.cleanerRoll ? cleanerDodgeRollCooldownMs : baseDodgeRollCooldownMs;

export const getMobilityFrame = (state: GameState): MobilityFrame => {
  const cooldownDurationMs = getDodgeRollCooldownMs(state);
  const staminaCost = getDodgeRollCost(state);
  return {
    keyLabel: 'Shift',
    label: state.evolution.cleanerRoll ? 'Cleaner Roll' : 'Dodge Roll',
    roleLabel: state.evolution.cleanerRoll ? 'MOB+' : 'MOB',
    staminaCost,
    ready: state.combat.rollCooldownMs <= 0 && state.player.stamina >= staminaCost && state.combat.phase === 'idle',
    evolved: state.evolution.cleanerRoll,
    cooldownMs: state.combat.rollCooldownMs,
    cooldownDurationMs
  };
};
