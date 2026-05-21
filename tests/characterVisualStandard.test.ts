import { describe, expect, it } from 'vitest';
import {
  getStarterChildCharacterStandard,
  type CharacterDirection,
  type CharacterEquipmentSocket
} from '../src/game/content/characterVisualStandard';
import { createGameState } from '../src/game/simulation/state';

describe('starter child character visual standard', () => {
  it('keeps the player frame small enough for the current top-down world scale', () => {
    const standard = getStarterChildCharacterStandard();

    expect(standard.frame.width).toBe(64);
    expect(standard.frame.height).toBe(64);
    expect(standard.frame.visualHeightPx.min).toBeGreaterThanOrEqual(36);
    expect(standard.frame.visualHeightPx.max).toBeLessThanOrEqual(44);
    expect(standard.frame.footAnchor).toEqual({ x: 0.5, y: 0.78 });
  });

  it('requires equipment sockets before future gear or tools are generated', () => {
    const standard = getStarterChildCharacterStandard();
    const sockets = new Set<CharacterEquipmentSocket>(standard.equipmentSockets);

    expect(sockets.has('mainHand')).toBe(true);
    expect(sockets.has('tool')).toBe(true);
    expect(sockets.has('body')).toBe(true);
    expect(sockets.has('back')).toBe(true);
    expect(sockets.has('hands')).toBe(true);
  });

  it('matches the current equipment state foundation', () => {
    const state = createGameState();
    const sockets = new Set<CharacterEquipmentSocket>(getStarterChildCharacterStandard().equipmentSockets);

    expect(sockets.has('mainHand')).toBe(true);
    expect(sockets.has('tool')).toBe(true);
    expect(sockets.has('body')).toBe(true);
    expect(state.equipment).toEqual({
      mainHand: 'bare-hands',
      tool: 'none',
      body: 'worn-cloth'
    });
  });

  it('requires condition states that come from an alive world instead of class selection', () => {
    const conditionStates = getStarterChildCharacterStandard().conditionStates;

    expect(conditionStates).toContain('cold');
    expect(conditionStates).toContain('warming');
    expect(conditionStates).toContain('exhausted');
    expect(conditionStates).toContain('hurt');
    expect(conditionStates).toContain('under-threat');
  });

  it('requires every core animation group to support four directional play', () => {
    const standard = getStarterChildCharacterStandard();
    const directions = ['north', 'south', 'east', 'west'] as const satisfies readonly CharacterDirection[];

    for (const groupDirections of Object.values(standard.animationGroups)) {
      expect(groupDirections).toEqual(directions);
    }
  });

  it('rejects generation traits that would flatten the world into baked art', () => {
    const forbidden = getStarterChildCharacterStandard().artDirection.forbidden;

    expect(forbidden).toContain('baked-ground');
    expect(forbidden).toContain('scenery');
    expect(forbidden).toContain('labels');
    expect(forbidden).toContain('ui-elements');
    expect(forbidden).toContain('heroic-ready-stance');
  });
});
