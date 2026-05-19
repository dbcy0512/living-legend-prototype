import { describe, expect, it } from 'vitest';
import { getDamageResponse } from '../src/game/simulation/rules/creatureResponses';

describe('creature damage responses', () => {
  it('treats small damage as minor fear and short recovery', () => {
    const response = getDamageResponse(8, 27, 35);

    expect(response.fearGain).toBeGreaterThan(0);
    expect(response.fearGain).toBeLessThan(20);
    expect(response.recoveryMs).toBeLessThan(900);
  });

  it('treats heavy damage as a significant fear response', () => {
    const small = getDamageResponse(8, 27, 35);
    const heavy = getDamageResponse(24, 11, 35);

    expect(heavy.fearGain).toBeGreaterThan(small.fearGain);
    expect(heavy.recoveryMs).toBeGreaterThan(small.recoveryMs);
  });

  it('spikes fear when a creature is badly injured but still alive', () => {
    const response = getDamageResponse(16, 8, 35);

    expect(response.fearGain).toBeGreaterThan(45);
    expect(response.recoveryMs).toBeGreaterThanOrEqual(1200);
  });
});
