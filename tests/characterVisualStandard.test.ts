import { describe, expect, it } from 'vitest';
import {
  getStarterChildCharacterStandard,
  type CharacterDirection,
  type CharacterEquipmentSocket
} from '../src/game/content/characterVisualStandard';
import { getEquipmentFitProfile, getStarterEquipmentSlots } from '../src/game/content/equipment';
import { getStarterChildPaperDollLayers } from '../src/game/content/paperDoll';
import { createStarterCharacterModelState, type CharacterModelState } from '../src/game/content/characterModel';
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
    expect(sockets.has('head')).toBe(true);
    expect(sockets.has('offHand')).toBe(true);
    expect(sockets.has('feet')).toBe(true);
  });

  it('matches the current equipment state foundation', () => {
    const state = createGameState();
    const sockets = new Set<CharacterEquipmentSocket>(getStarterChildCharacterStandard().equipmentSockets);

    expect(sockets.has('mainHand')).toBe(true);
    expect(sockets.has('tool')).toBe(true);
    expect(sockets.has('body')).toBe(true);
    expect(state.equipment).toEqual({
      head: 'none',
      body: 'worn-cloth',
      hands: 'bare-hands-wraps',
      back: 'none',
      mainHand: 'bare-hands',
      offHand: 'none',
      tool: 'none',
      feet: 'bare-feet'
    });
    expect(state.characterModel.bodyStage).toBe('starter-child');
    expect(state.characterModel.socketSet).toBe('starter-child-v1');
  });

  it('keeps paper doll slots data-driven for future gear visuals', () => {
    const slotDefinitions = getStarterEquipmentSlots();
    const state = createGameState();

    state.equipment.mainHand = 'branch-club';

    const layers = getStarterChildPaperDollLayers(state.equipment, {
      model: state.characterModel,
      facing: 'south',
      coldPressure: 0,
      action: 'idle'
    });
    const mainHand = layers.find((layer) => layer.slot === 'mainHand');

    expect(slotDefinitions.map((slot) => slot.slot)).toEqual([
      'feet',
      'body',
      'hands',
      'back',
      'mainHand',
      'offHand',
      'tool',
      'head'
    ]);
    expect(mainHand?.visible).toBe(true);
    expect(mainHand?.textureKey).toBe('character:held-branch-club');
    expect(mainHand?.fitStatus).toBe('ready');
  });

  it('blocks equipment visuals when the body stage has no generated fit', () => {
    const state = createGameState();
    const evolvedModel: CharacterModelState = {
      ...createStarterCharacterModelState('warm'),
      bodyStage: 'adolescent-survivor',
      scaleTier: 'adolescent-medium'
    };

    state.equipment.mainHand = 'branch-club';

    const layers = getStarterChildPaperDollLayers(state.equipment, {
      model: evolvedModel,
      facing: 'south',
      coldPressure: 0,
      action: 'idle'
    });
    const mainHand = layers.find((layer) => layer.slot === 'mainHand');

    expect(mainHand?.visible).toBe(false);
    expect(mainHand?.fitStatus).toBe('blocked-body-stage');
    expect(mainHand?.blockedReason).toContain('adolescent-survivor');
  });

  it('marks seed weapon combat frames as PixelLab generation requirements', () => {
    const branchClub = getEquipmentFitProfile('branch-club', 'mainHand');
    const stoneEdge = getEquipmentFitProfile('stone-edge', 'mainHand');

    expect(branchClub?.compatibleBodyStages).toEqual(['starter-child']);
    expect(stoneEdge?.compatibleBodyStages).toEqual(['starter-child']);
    expect(
      branchClub?.visualRequirements.some(
        (requirement) =>
          requirement.status === 'needs-pixellab-pass' && requirement.actions.includes('attack-main-hand')
      )
    ).toBe(true);
    expect(
      stoneEdge?.visualRequirements.some(
        (requirement) =>
          requirement.status === 'needs-pixellab-pass' && requirement.actions.includes('attack-main-hand')
      )
    ).toBe(true);
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
