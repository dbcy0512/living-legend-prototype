import { getCraftingRecipe, getCraftingRecipes, type CraftingInputKind, type CraftingRecipeId } from '../../content/craftingRecipes';
import type { CampfireState, GameState } from '../state';
import { canAddSatchelItem } from '../rules/satchel';
import { clamp, distance } from '../rules/math';
import { getCraftingFailureThought, getCraftingSuccessThought, setPlayerThought } from '../rules/thoughts';

const activeFireCraftingReach = 118;

export type CraftingAvailability = {
  canCraft: boolean;
  reason: 'ready' | 'missing-items' | 'needs-active-fire' | 'satchel-full' | 'unknown-recipe';
};

export const getAvailableCraftingRecipes = (state: GameState) =>
  getCraftingRecipes().map((recipe) => ({
    recipe,
    availability: getCraftingAvailability(state, recipe.id)
  }));

export const getCraftingAvailability = (state: GameState, recipeId: CraftingRecipeId): CraftingAvailability => {
  const recipe = getCraftingRecipe(recipeId);
  if (!recipe) {
    return { canCraft: false, reason: 'unknown-recipe' };
  }
  if (!hasCraftingCost(state, recipe.cost)) {
    return { canCraft: false, reason: 'missing-items' };
  }
  if (recipe.context === 'near-active-fire' && !getNearbyActiveFire(state)) {
    return { canCraft: false, reason: 'needs-active-fire' };
  }
  if (
    recipe.effect.type === 'create-item' &&
    state.inventory[recipe.effect.item] <= 0 &&
    !willCraftingCostFreeSlot(state, recipe.cost) &&
    !canAddSatchelItem(state.inventory, recipe.effect.item)
  ) {
    return { canCraft: false, reason: 'satchel-full' };
  }
  return { canCraft: true, reason: 'ready' };
};

export const craftRecipe = (state: GameState, recipeId: CraftingRecipeId): boolean => {
  const recipe = getCraftingRecipe(recipeId);
  if (!recipe) {
    state.ui.craftMessage = 'That thought has no shape yet.';
    setPlayerThought(state, getCraftingFailureThought('unknown-recipe'));
    return false;
  }

  const availability = getCraftingAvailability(state, recipeId);
  if (!availability.canCraft) {
    state.ui.craftMessage = getCraftingFailureMessage(recipe.name, availability.reason);
    setPlayerThought(state, getCraftingFailureThought(availability.reason));
    return false;
  }

  for (const [kind, amount] of Object.entries(recipe.cost) as [CraftingInputKind, number][]) {
    state.inventory[kind] -= amount;
    if (recipe.effect.type === 'fuel-fire') {
      state.behaviorMemory.tools.usedAsFuel[kind] += amount;
    }
  }

  if (recipe.effect.type === 'fuel-fire') {
    const fire = getNearbyActiveFire(state);
    if (!fire) {
      state.ui.craftMessage = 'The flame is too far away.';
      setPlayerThought(state, 'Too far from the flame.');
      return false;
    }
    fire.fuelMs += recipe.effect.fuelMs;
  } else if (recipe.effect.type === 'heal-player') {
    state.player.health = clamp(state.player.health + recipe.effect.health, 0, state.player.maxHealth);
  } else {
    state.inventory[recipe.effect.item] += recipe.effect.amount;
    state.ui.inventoryMessage = '';
    if (recipe.effect.item === 'poultices') {
      state.ui.hotbarMessage = 'Poultice ready.';
    } else if (recipe.effect.item === 'branchClubs') {
      state.equipment.mainHand = 'branch-club';
      state.ui.selectedHotbarSlot = 0;
    } else if (recipe.effect.item === 'stoneEdges') {
      state.equipment.mainHand = 'stone-edge';
      state.ui.selectedHotbarSlot = 1;
    }
  }

  state.ui.lastCraftedRecipeId = recipe.id;
  state.ui.craftMessage = `${recipe.name} made.`;
  setPlayerThought(state, getCraftingSuccessThought(recipe.id));
  return true;
};

export const getCraftingCostText = (cost: Partial<Record<CraftingInputKind, number>>): string =>
  Object.entries(cost)
    .map(([kind, amount]) => `${getCraftingItemLabel(kind as CraftingInputKind)} ${amount}`)
    .join(', ');

export const getCraftingItemLabel = (kind: CraftingInputKind): string => {
  switch (kind) {
    case 'twigs':
      return 'Twig';
    case 'dryGrass':
      return 'Dry Grass';
    case 'bark':
      return 'Bark';
    case 'wood':
      return 'Wood';
    case 'stone':
      return 'Stone';
    case 'herbs':
      return 'Herb';
  }
};

const hasCraftingCost = (state: GameState, cost: Partial<Record<CraftingInputKind, number>>): boolean =>
  (Object.entries(cost) as [CraftingInputKind, number][]).every(([kind, amount]) => state.inventory[kind] >= amount);

const willCraftingCostFreeSlot = (state: GameState, cost: Partial<Record<CraftingInputKind, number>>): boolean =>
  (Object.entries(cost) as [CraftingInputKind, number][]).some(
    ([kind, amount]) => state.inventory[kind] > 0 && state.inventory[kind] <= amount
  );

const getNearbyActiveFire = (state: GameState): CampfireState | undefined =>
  state.campfires.find(
    (campfire) =>
      campfire.fuelMs > 0 &&
      distance(campfire.x, campfire.y, state.player.x, state.player.y) <= activeFireCraftingReach
  );

const getCraftingFailureMessage = (recipeName: string, reason: CraftingAvailability['reason']): string => {
  switch (reason) {
    case 'missing-items':
      return `${recipeName} needs more pieces.`;
    case 'needs-active-fire':
      return `${recipeName} needs a living flame.`;
    case 'satchel-full':
      return `${recipeName} needs room in the satchel.`;
    case 'unknown-recipe':
      return 'That thought has no shape yet.';
    case 'ready':
      return '';
  }
};
