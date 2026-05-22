import type { ActionState } from '../../input/actions';
import { createGameState, type GameState } from '../state';
import { updateEvolution } from '../rules/evolutionRules';
import { tickPlayerThought } from '../rules/thoughts';
import { tryStartWeaponAbility, updateAbility } from './abilitySystem';
import { updateCombat } from './combatSystem';
import { updateEnemies } from './enemySystem';
import { updateEncounters } from './encounterSystem';
import { getExposedCraftingRecipes } from './craftingSystem';
import { selectOrUseHotbarSlot, updateHotbar } from './hotbarSystem';
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
    if (!state.ui.inventoryOpen) {
      state.ui.craftingOpen = false;
    }
  }
  if (actions.toggleCrafting && state.ui.inventoryOpen) {
    state.ui.craftingOpen = !state.ui.craftingOpen;
  }
  if (state.ui.craftingOpen && (actions.craftRecipeNext || actions.craftRecipePrevious)) {
    const recipeCount = getExposedCraftingRecipes(state).length;
    if (recipeCount > 0) {
      const offset = actions.craftRecipeNext ? 1 : -1;
      state.ui.selectedCraftingRecipeIndex = (state.ui.selectedCraftingRecipeIndex + offset + recipeCount) % recipeCount;
    }
  }
  if (actions.hotbarSlot !== undefined && !tryStartWeaponAbility(state, actions.hotbarSlot)) {
    selectOrUseHotbarSlot(state, actions.hotbarSlot);
  }
  if (state.world.paused) {
    return;
  }

  const clampedDelta = Math.min(deltaMs, 50);
  tickPlayerThought(state, clampedDelta);
  updateWorld(state, clampedDelta);
  updateInventory(state, actions, clampedDelta);
  updateHotbar(state, clampedDelta);
  updatePlayer(state, actions, clampedDelta);
  updateAbility(state, clampedDelta);
  updateCombat(state, actions, clampedDelta);
  updateEnemies(state, clampedDelta);
  updateEncounters(state);
  updateEvolution(state);
};

const resetGameState = (state: GameState): void => {
  const fresh = createGameState({ ecosystemSeed: state.ecosystem.seed });
  Object.assign(state.player, fresh.player);
  Object.assign(state.combat, fresh.combat);
  Object.assign(state.ability, fresh.ability);
  Object.assign(state.world, fresh.world);
  Object.assign(state.inventory, fresh.inventory);
  Object.assign(state.evolution, fresh.evolution);
  Object.assign(state.progression.stations, fresh.progression.stations);
  Object.assign(state.progression.exposedPathSteps, fresh.progression.exposedPathSteps);
  Object.assign(state.equipment, fresh.equipment);
  Object.assign(state.hotbar, fresh.hotbar);
  Object.assign(state.ecosystem, fresh.ecosystem);
  Object.assign(state.encounters, fresh.encounters);
  Object.assign(state.ui, fresh.ui);
  Object.assign(state.behaviorMemory.body, fresh.behaviorMemory.body);
  Object.assign(state.behaviorMemory.combat, fresh.behaviorMemory.combat);
  Object.assign(state.behaviorMemory.abilities.used, fresh.behaviorMemory.abilities.used);
  Object.assign(state.behaviorMemory.abilities.hits, fresh.behaviorMemory.abilities.hits);
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
