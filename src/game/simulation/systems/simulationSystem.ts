import type { ActionState } from '../../input/actions';
import { getCraftingRecipes } from '../../content/craftingRecipes';
import { createGameState, type GameState } from '../state';
import { updateEvolution } from '../rules/evolutionRules';
import { updateCombat } from './combatSystem';
import { updateEnemies } from './enemySystem';
import { selectOrUseHotbarSlot } from './hotbarSystem';
import { updateInventory } from './inventorySystem';
import { updatePlayer } from './playerSystem';
import { updateWorld } from './worldSystem';

export const updateSimulation = (state: GameState, actions: ActionState, deltaMs: number): void => {
  if (actions.restart && state.world.status !== 'playing') {
    resetGameState(state);
    return;
  }
  if (state.world.status !== 'playing') {
    return;
  }
  if (actions.pause) {
    state.world.paused = !state.world.paused;
  }
  if (actions.toggleInventory) {
    state.ui.inventoryOpen = !state.ui.inventoryOpen;
  }
  if (actions.toggleCrafting) {
    state.ui.craftingOpen = !state.ui.craftingOpen;
  }
  if (state.ui.craftingOpen && (actions.craftRecipeNext || actions.craftRecipePrevious)) {
    const recipeCount = getCraftingRecipes().length;
    const offset = actions.craftRecipeNext ? 1 : -1;
    state.ui.selectedCraftingRecipeIndex = (state.ui.selectedCraftingRecipeIndex + offset + recipeCount) % recipeCount;
  }
  if (actions.hotbarSlot !== undefined) {
    selectOrUseHotbarSlot(state, actions.hotbarSlot);
  }
  if (state.world.paused) {
    return;
  }

  const clampedDelta = Math.min(deltaMs, 50);
  updateWorld(state, clampedDelta);
  updateInventory(state, actions, clampedDelta);
  updatePlayer(state, actions, clampedDelta);
  updateCombat(state, actions, clampedDelta);
  updateEnemies(state, clampedDelta);
  updateEvolution(state);
};

const resetGameState = (state: GameState): void => {
  const fresh = createGameState({ ecosystemSeed: state.ecosystem.seed });
  Object.assign(state.player, fresh.player);
  Object.assign(state.combat, fresh.combat);
  Object.assign(state.world, fresh.world);
  Object.assign(state.inventory, fresh.inventory);
  Object.assign(state.evolution, fresh.evolution);
  Object.assign(state.ecosystem, fresh.ecosystem);
  Object.assign(state.ui, fresh.ui);
  Object.assign(state.behaviorMemory.body, fresh.behaviorMemory.body);
  Object.assign(state.behaviorMemory.combat, fresh.behaviorMemory.combat);
  Object.assign(state.behaviorMemory.tools.gathered, fresh.behaviorMemory.tools.gathered);
  Object.assign(state.behaviorMemory.tools.usedAsWeapon, fresh.behaviorMemory.tools.usedAsWeapon);
  Object.assign(state.behaviorMemory.tools.usedAsFuel, fresh.behaviorMemory.tools.usedAsFuel);
  Object.assign(state.behaviorMemory.fire, fresh.behaviorMemory.fire);
  Object.assign(state.behaviorMemory.creatures, fresh.behaviorMemory.creatures);
  Object.assign(state.respawnPoint, fresh.respawnPoint);
  state.campfires.splice(0, state.campfires.length, ...fresh.campfires);
  state.resources.splice(0, state.resources.length, ...fresh.resources);
  state.enemies.splice(0, state.enemies.length, ...fresh.enemies);
};
