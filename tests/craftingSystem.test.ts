import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import {
  craftRecipe,
  getAvailableCraftingRecipes,
  getCraftingAvailability
} from '../src/game/simulation/systems/craftingSystem';

describe('crafting registry', () => {
  it('exposes survival upkeep and the first station before progression paths', () => {
    const state = createGameState();
    const recipes = getAvailableCraftingRecipes(state);

    expect(recipes.map(({ recipe }) => recipe.id)).toEqual(['feed-fire', 'basic-workbench']);
  });

  it('builds the basic workbench as the first material-gated progression station', () => {
    const state = createGameState();
    state.inventory.wood = 2;
    state.inventory.bark = 1;
    state.inventory.stone = 1;

    expect(craftRecipe(state, 'basic-workbench')).toBe(true);
    expect(state.progression.stations.basicWorkbenchBuilt).toBe(true);
    expect(state.progression.exposedPathSteps).toEqual({
      medicine: 1,
      blade: 1,
      axe: 1
    });
    expect(state.inventory.wood).toBe(0);
    expect(state.inventory.bark).toBe(0);
    expect(state.inventory.stone).toBe(0);
    expect(getAvailableCraftingRecipes(state).map(({ recipe }) => recipe.id)).toEqual([
      'feed-fire',
      'simple-poultice',
      'stone-edge',
      'branch-club'
    ]);
  });

  it('blocks progression crafting until the workbench exists', () => {
    const state = createGameState();
    state.inventory.stone = 1;
    state.inventory.bark = 1;
    state.inventory.twigs = 1;

    expect(getCraftingAvailability(state, 'stone-edge')).toEqual({
      canCraft: false,
      reason: 'needs-workbench'
    });
    expect(craftRecipe(state, 'stone-edge')).toBe(false);
    expect(state.inventory.stoneEdges).toBe(0);
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
    unlockWorkbench(state);
    state.player.health = 50;
    state.inventory.herbs = 1;
    state.inventory.bark = 1;

    expect(craftRecipe(state, 'simple-poultice')).toBe(true);
    expect(state.inventory.herbs).toBe(0);
    expect(state.inventory.bark).toBe(0);
    expect(state.inventory.poultices).toBe(1);
    expect(state.player.health).toBe(50);
  });

  it('creates crude tool items from early materials', () => {
    const state = createGameState();
    unlockWorkbench(state);
    state.inventory.stone = 1;
    state.inventory.bark = 2;
    state.inventory.twigs = 1;
    state.inventory.wood = 1;

    expect(craftRecipe(state, 'stone-edge')).toBe(true);
    expect(state.equipment.mainHand).toBe('stone-edge');
    expect(craftRecipe(state, 'branch-club')).toBe(true);
    expect(state.equipment.mainHand).toBe('branch-club');
    expect(state.inventory.stoneEdges).toBe(1);
    expect(state.inventory.branchClubs).toBe(1);
    expect(state.inventory.bark).toBe(0);
  });

  it('allows crafting output when consumed ingredients free satchel space', () => {
    const state = createGameState();
    unlockWorkbench(state);
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    state.inventory.wood = 1;
    state.inventory.herbs = 1;

    expect(craftRecipe(state, 'simple-poultice')).toBe(true);
    expect(state.inventory.poultices).toBe(1);
    expect(state.inventory.herbs).toBe(0);
    expect(state.inventory.bark).toBe(0);
  });

  it('rejects crafting output when the beginner satchel has no free slot', () => {
    const state = createGameState();
    unlockWorkbench(state);
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 2;
    state.inventory.stone = 1;
    state.inventory.wood = 2;
    state.inventory.herbs = 1;

    expect(getCraftingAvailability(state, 'branch-club')).toEqual({
      canCraft: false,
      reason: 'satchel-full'
    });
    expect(craftRecipe(state, 'branch-club')).toBe(false);
    expect(state.inventory.branchClubs).toBe(0);
    expect(state.inventory.bark).toBe(2);
    expect(state.inventory.wood).toBe(2);
  });
});

const unlockWorkbench = (state: ReturnType<typeof createGameState>): void => {
  state.progression.stations.basicWorkbenchBuilt = true;
  state.progression.exposedPathSteps.medicine = 1;
  state.progression.exposedPathSteps.blade = 1;
  state.progression.exposedPathSteps.axe = 1;
};
