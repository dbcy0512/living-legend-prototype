import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import {
  craftRecipe,
  getAvailableCraftingRecipes,
  getCraftingAvailability
} from '../src/game/simulation/systems/craftingSystem';

describe('crafting registry', () => {
  it('exposes the first beginner recipes in slot order', () => {
    const state = createGameState();
    const recipes = getAvailableCraftingRecipes(state);

    expect(recipes.map(({ recipe }) => recipe.id)).toEqual([
      'feed-fire',
      'simple-poultice',
      'stone-edge',
      'branch-club'
    ]);
  });

  it('feeds a nearby active fire instead of creating another campfire', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    state.player.x = state.campfires[0].x;
    state.player.y = state.campfires[0].y;
    state.campfires[0].fuelMs = 1000;
    state.inventory.wood = 1;

    expect(craftRecipe(state, 'feed-fire')).toBe(true);
    expect(state.inventory.wood).toBe(0);
    expect(state.inventory.campfires).toBe(0);
    expect(state.campfires[0].fuelMs).toBeGreaterThan(1000);
    expect(state.behaviorMemory.tools.usedAsFuel.wood).toBe(1);
  });

  it('requires a living flame before fire can be fed', () => {
    const state = createGameState();
    state.inventory.wood = 1;

    expect(getCraftingAvailability(state, 'feed-fire')).toEqual({
      canCraft: false,
      reason: 'needs-active-fire'
    });
  });

  it('makes a simple poultice from herbs and bark', () => {
    const state = createGameState();
    state.player.health = 50;
    state.inventory.herbs = 1;
    state.inventory.bark = 1;

    expect(craftRecipe(state, 'simple-poultice')).toBe(true);
    expect(state.inventory.herbs).toBe(0);
    expect(state.inventory.bark).toBe(0);
    expect(state.player.health).toBe(74);
  });

  it('creates crude tool items from early materials', () => {
    const state = createGameState();
    state.inventory.stone = 1;
    state.inventory.bark = 2;
    state.inventory.twigs = 1;
    state.inventory.wood = 1;

    expect(craftRecipe(state, 'stone-edge')).toBe(true);
    expect(state.evolution.equippedMeleeSeed).toBe('stone-edge');
    expect(craftRecipe(state, 'branch-club')).toBe(true);
    expect(state.evolution.equippedMeleeSeed).toBe('branch-club');
    expect(state.inventory.stoneEdges).toBe(1);
    expect(state.inventory.branchClubs).toBe(1);
    expect(state.inventory.bark).toBe(0);
  });
});
