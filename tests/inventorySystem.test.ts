import { describe, expect, it } from 'vitest';
import { createGameState } from '../src/game/simulation/state';
import {
  beginnerInventorySlotCount,
  canCarryInventoryKind,
  craftCampfire,
  getBeginnerInventorySummary,
  getBeginnerInventorySlots,
  getCampfirePlacementPreview,
  getFirstFirePreview,
  getFirstFireRelightPreview,
  getNearestGatherableResource,
  placeCampfire,
  rebuildFirstFire,
  relightFirstFire,
  updateInventory,
  useFood
} from '../src/game/simulation/systems/inventorySystem';
import { idleActions } from '../src/game/input/actions';

describe('inventory crafting', () => {
  it('starts with six visible beginner inventory slots', () => {
    const state = createGameState();
    const slots = getBeginnerInventorySlots(state);

    expect(slots).toHaveLength(beginnerInventorySlotCount);
    expect(slots.every((slot) => slot.empty)).toBe(true);
  });

  it('shows carried items first instead of every possible material', () => {
    const state = createGameState();
    state.inventory.twigs = 2;
    state.inventory.bark = 1;
    state.inventory.stone = 4;
    state.inventory.wood = 1;
    state.inventory.herbs = 3;
    state.inventory.food = 1;
    state.inventory.poultices = 2;

    const slots = getBeginnerInventorySlots(state);

    expect(slots).toHaveLength(6);
    expect(slots.map((slot) => slot.kind)).toEqual(['twigs', 'bark', 'stone', 'wood', 'herbs', 'food']);
    expect(slots.some((slot) => slot.kind === 'poultices')).toBe(false);
  });

  it('summarizes hidden carried kinds when the beginner satchel overflows', () => {
    const state = createGameState();
    state.inventory.twigs = 2;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 4;
    state.inventory.wood = 1;
    state.inventory.herbs = 3;
    state.inventory.food = 1;

    expect(getBeginnerInventorySummary(state)).toEqual({
      occupiedSlots: 6,
      slotCount: 6,
      hiddenItemKinds: 1,
      full: true
    });
  });

  it('allows stacking an already-carried kind when the satchel is full', () => {
    const state = createGameState();
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    state.inventory.wood = 1;
    state.inventory.herbs = 1;

    expect(canCarryInventoryKind(state, 'wood')).toBe(true);
  });

  it('refuses a new carried kind when all six beginner satchel slots are filled', () => {
    const state = createGameState();
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    state.inventory.wood = 1;
    state.inventory.herbs = 1;

    expect(canCarryInventoryKind(state, 'food')).toBe(false);
  });

  it('crafts campfire only when resource costs are available', () => {
    const inventory = {
      twigs: 0,
      dryGrass: 0,
      bark: 0,
      wood: 2,
      stone: 1,
      herbs: 0,
      food: 0,
      campfires: 0,
      poultices: 0,
      stoneEdges: 0,
      branchClubs: 0
    };

    expect(craftCampfire(inventory)).toBe(true);
    expect(inventory).toEqual({
      twigs: 0,
      dryGrass: 0,
      bark: 0,
      wood: 0,
      stone: 0,
      herbs: 0,
      food: 0,
      campfires: 1,
      poultices: 0,
      stoneEdges: 0,
      branchClubs: 0
    });
    expect(craftCampfire(inventory)).toBe(false);
    expect(inventory.campfires).toBe(1);
  });

  it('places a campfire into world state after paying the recipe cost', () => {
    const state = createGameState();
    state.inventory.wood = 2;
    state.inventory.stone = 1;

    expect(placeCampfire(state)).toBe(true);
    expect(state.inventory.wood).toBe(0);
    expect(state.inventory.stone).toBe(0);
    expect(state.campfires).toHaveLength(2);
    expect(state.campfires[1].radius).toBeGreaterThan(0);
    expect(state.campfires[1].y).toBeGreaterThan(state.player.y);
  });

  it('rejects campfire placement when another active campfire is too close', () => {
    const state = createGameState();
    state.inventory.wood = 4;
    state.inventory.stone = 2;

    expect(placeCampfire(state)).toBe(true);
    expect(placeCampfire(state)).toBe(false);
    expect(state.campfires).toHaveLength(2);
    expect(state.inventory.wood).toBe(2);
    expect(state.inventory.stone).toBe(1);
  });

  it('rebuilds the first dead fire from primitive opening materials', () => {
    const state = createGameState();
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;

    expect(getFirstFirePreview(state).reason).toBe('ready');
    expect(rebuildFirstFire(state)).toBe(true);
    expect(state.inventory.twigs).toBe(0);
    expect(state.inventory.dryGrass).toBe(0);
    expect(state.inventory.bark).toBe(0);
    expect(state.inventory.stone).toBe(0);
    expect(state.campfires[0].fuelMs).toBeGreaterThan(0);
    expect(state.world.openingStage).toBe('first-flame');
    expect(state.world.openingPrompt).toBe('spark-caught');
    expect(state.world.cold).toBeLessThan(100);
  });

  it('explains when the first fire cannot be rebuilt yet', () => {
    const state = createGameState();

    expect(getFirstFirePreview(state).reason).toBe('needs-kindling');
    state.player.x += 300;
    expect(getFirstFirePreview(state).reason).toBe('too-far');
  });

  it('reveals missing first-fire materials only after a failed rebuild attempt', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.craft = true;

    expect(state.world.openingPrompt).toBe('fire-dead');
    updateInventory(state, actions, 16);

    expect(state.world.openingPrompt).toBe('missing-materials');
  });

  it('marks the first fire ready once all opening materials are held', () => {
    const state = createGameState();
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;

    updateInventory(state, idleActions(), 16);

    expect(state.world.openingPrompt).toBe('ready');
  });

  it('does not place extra campfires from the fire action after the first fire is lit', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.craft = true;
    state.world.openingStage = 'open';
    state.campfires[0].fuelMs = 10000;
    state.inventory.wood = 2;
    state.inventory.stone = 1;

    updateInventory(state, actions, 16);

    expect(state.campfires).toHaveLength(1);
    expect(state.inventory.wood).toBe(2);
    expect(state.inventory.stone).toBe(1);
  });

  it('relights the first fire after opening without creating a new campfire', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    state.campfires[0].fuelMs = 0;
    state.campfires[0].integrity = 64;
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;

    expect(getFirstFireRelightPreview(state).reason).toBe('ready');
    expect(relightFirstFire(state)).toBe(true);

    expect(state.campfires).toHaveLength(1);
    expect(state.campfires[0].fuelMs).toBeGreaterThan(0);
    expect(state.campfires[0].integrity).toBe(64);
    expect(state.inventory.twigs).toBe(0);
    expect(state.inventory.dryGrass).toBe(0);
    expect(state.inventory.bark).toBe(0);
    expect(state.inventory.campfires).toBe(0);
  });

  it('does not relight a fire whose structure has been destroyed', () => {
    const state = createGameState();
    state.world.openingStage = 'open';
    state.campfires[0].fuelMs = 0;
    state.campfires[0].integrity = 0;
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;

    expect(getFirstFireRelightPreview(state).reason).toBe('broken');
    expect(relightFirstFire(state)).toBe(false);
    expect(state.campfires[0].fuelMs).toBe(0);
  });

  it('reports why a campfire preview is invalid', () => {
    const state = createGameState();

    expect(getCampfirePlacementPreview(state).reason).toBe('needs-resources');
  });

  it('uses food to restore hunger without exceeding the max', () => {
    const state = createGameState();
    state.inventory.food = 1;
    state.player.hunger = 82;

    expect(useFood(state)).toBe(true);
    expect(state.inventory.food).toBe(0);
    expect(state.player.hunger).toBe(100);
  });

  it('gathers the nearest active resource within interaction range', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources[0];
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x + 62;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.inventory[resource.kind]).toBe(1);
    expect(resource.amount).toBe(0);
  });

  it('does not destroy a resource when the satchel has no room for its kind', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources.find((node) => node.kind === 'food');
    if (!resource) {
      throw new Error('food resource fixture missing');
    }
    state.inventory.twigs = 1;
    state.inventory.dryGrass = 1;
    state.inventory.bark = 1;
    state.inventory.stone = 1;
    state.inventory.wood = 1;
    state.inventory.herbs = 1;
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.inventory.food).toBe(0);
    expect(resource.amount).toBeGreaterThan(0);
    expect(state.ui.inventoryMessage).toBe('No room in the satchel.');
  });

  it('gathers dry grass as a first-fire material', () => {
    const state = createGameState();
    const actions = idleActions();
    const resource = state.resources.find((node) => node.id === 'dry-grass-handful');
    if (!resource) {
      throw new Error('dry grass fixture missing');
    }
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y;
    actions.gather = true;

    updateInventory(state, actions, 16);

    expect(state.inventory.dryGrass).toBe(1);
    expect(resource.amount).toBe(0);
  });

  it('leaves depleted ecosystem resources for ecosystem regeneration', () => {
    const state = createGameState();
    const resource = state.resources.find((node) => node.source?.type === 'tree-dependent');
    if (!resource) {
      throw new Error('ecosystem resource fixture missing');
    }
    resource.amount = 0;
    resource.respawnMs = 12000;

    updateInventory(state, idleActions(), 12000);

    expect(resource.amount).toBe(0);
    expect(resource.respawnMs).toBe(12000);
  });

  it('finds a resource just ahead of the player facing direction', () => {
    const state = createGameState();
    const resource = state.resources[0];
    state.resources.splice(0, state.resources.length, resource);
    state.player.x = resource.x;
    state.player.y = resource.y + 98;
    state.player.facing = 'north';

    expect(getNearestGatherableResource(state)?.id).toBe(resource.id);
  });

  it('uses resource profile interaction tuning for small readable pickups', () => {
    const state = createGameState();
    const dryGrass = state.resources.find((node) => node.kind === 'dryGrass');
    if (!dryGrass) {
      throw new Error('dry grass fixture missing');
    }
    state.resources.splice(0, state.resources.length, dryGrass);
    state.player.x = dryGrass.x + 90;
    state.player.y = dryGrass.y;

    expect(getNearestGatherableResource(state)?.id).toBe(dryGrass.id);
  });
});
