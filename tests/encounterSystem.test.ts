import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { startingAreaLayout } from '../src/game/content/maps/startingArea';
import { createGameState, type ResourceNode } from '../src/game/simulation/state';
import {
  getEncounterPocket,
  isPlayerInsideCampSanctuary,
  isResourceLockedByActiveWave,
  updateEncounters
} from '../src/game/simulation/systems/encounterSystem';
import { updateEnemies } from '../src/game/simulation/systems/enemySystem';
import { getNearestGatherableResource, updateInventory } from '../src/game/simulation/systems/inventorySystem';

describe('encounter pockets', () => {
  it('starts the deadwood action pocket ready with no spawned enemies', () => {
    const state = createGameState();
    const pocket = getEncounterPocket(state, 'deadwood-skitter-trigger');

    expect(pocket?.status).toBe('ready');
    expect(pocket?.spawnedEnemyIds).toEqual([]);
    expect(state.enemies).toEqual([]);
  });

  it('wakes the deadwood pocket when a player gathers a resource inside it', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    const triggerResource = resourceFixture('deadwood-loose-branch', 2098, 868);
    const lockedResource = resourceFixture('deadwood-second-branch', 2200, 900);
    state.resources.splice(0, state.resources.length, triggerResource, lockedResource);
    state.player.x = triggerResource.x;
    state.player.y = triggerResource.y;
    const actions = idleActions();
    actions.gather = true;

    updateInventory(state, actions, 16);

    const pocket = getEncounterPocket(state, 'deadwood-skitter-trigger');
    expect(triggerResource.amount).toBe(0);
    expect(pocket?.status).toBe('active');
    expect(pocket?.spawnedEnemyIds).toHaveLength(2);
    expect(state.enemies.map((enemy) => enemy.kind)).toEqual(['mire-spider', 'violet-moss-blob']);
    expect(isResourceLockedByActiveWave(state, lockedResource)).toBe(true);
    expect(state.ui.thoughtMessage).toBe('Something moved under the deadwood.');
  });

  it('keeps active pocket resources unavailable until all spawned enemies are dead', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    const triggerResource = resourceFixture('deadwood-loose-branch', 2098, 868);
    const lockedResource = resourceFixture('deadwood-second-branch', 2200, 900);
    state.resources.splice(0, state.resources.length, triggerResource, lockedResource);
    state.player.x = triggerResource.x;
    state.player.y = triggerResource.y;
    const actions = idleActions();
    actions.gather = true;
    updateInventory(state, actions, 16);

    state.player.x = lockedResource.x;
    state.player.y = lockedResource.y;
    expect(getNearestGatherableResource(state)).toBeUndefined();

    for (const enemy of state.enemies) {
      enemy.health = 0;
    }
    updateEncounters(state);

    expect(getEncounterPocket(state, 'deadwood-skitter-trigger')?.status).toBe('cleared');
    expect(getNearestGatherableResource(state)?.id).toBe(lockedResource.id);
  });

  it('lets the camp sanctuary break small encounter pursuit without clearing the pocket', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    const triggerResource = resourceFixture('deadwood-loose-branch', 2098, 868);
    state.resources.splice(0, state.resources.length, triggerResource);
    state.player.x = triggerResource.x;
    state.player.y = triggerResource.y;
    const actions = idleActions();
    actions.gather = true;
    updateInventory(state, actions, 16);
    const enemy = state.enemies[0];
    enemy.x = state.player.x + 24;
    enemy.y = state.player.y;
    enemy.aggression = 72;

    state.player.x = startingAreaLayout.campCenter.x;
    state.player.y = startingAreaLayout.campCenter.y;
    updateEnemies(state, 500);

    expect(isPlayerInsideCampSanctuary(state)).toBe(true);
    expect(enemy.mode).toBe('watching');
    expect(enemy.aggression).toBeLessThan(72);
    expect(getEncounterPocket(state, 'deadwood-skitter-trigger')?.status).toBe('active');
  });
});

const resourceFixture = (id: string, x: number, y: number): ResourceNode => ({
  id,
  kind: 'wood',
  x,
  y,
  amount: 1,
  respawnMs: 0
});
