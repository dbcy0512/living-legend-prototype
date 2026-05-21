export type WorldCyclePhase = 'day' | 'dusk' | 'night' | 'dawn';

export const getWorldCyclePhase = (timeOfDay: number): WorldCyclePhase => {
  if (timeOfDay >= 0.32 && timeOfDay < 0.64) {
    return 'day';
  }
  if (timeOfDay >= 0.64 && timeOfDay < 0.76) {
    return 'dusk';
  }
  if (timeOfDay >= 0.76 || timeOfDay < 0.2) {
    return 'night';
  }
  return 'dawn';
};

export const isNightAssaultPhase = (phase: WorldCyclePhase): boolean => phase === 'dusk' || phase === 'night';
