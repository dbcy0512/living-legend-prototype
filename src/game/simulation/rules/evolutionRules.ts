import type { GameState } from '../state';

export const updateEvolution = (state: GameState): void => {
  const memory = state.behaviorMemory;
  if (
    !state.evolution.cleanerRoll &&
    memory.combat.wolfLungesDodged >= 3 &&
    memory.combat.dodgesUsed >= 3 &&
    memory.combat.hitsTaken <= 2
  ) {
    state.evolution.cleanerRoll = true;
  }
};
