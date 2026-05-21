import type { ActionState } from '../../input/actions';
import { getCraftingRecipes } from '../../content/craftingRecipes';
import { getResourceProfile } from '../../content/resources';
import type { GameState, Inventory, PlayerState, ResourceNode } from '../state';
import {
  addSatchelItem,
  beginnerSatchelSlotCount,
  canAddSatchelItem,
  getSatchelSlots,
  getSatchelSummary,
  type SatchelItemKind,
  type SatchelSlot,
  type SatchelSummary
} from '../rules/satchel';
import { clamp, distance } from '../rules/math';
import { getGatherThought, setPlayerThought } from '../rules/thoughts';
import { craftRecipe } from './craftingSystem';
import { isResourceLockedByActiveWave, tryTriggerResourcePocketWave } from './encounterSystem';

const campfireWoodCost = 2;
const campfireStoneCost = 1;
const campfirePlacementDistance = 42;
const campfireMinimumSpacing = 96;
const campfireSafetyRadius = 150;
const campfireFuelMs = 90000;
const firstFireReach = 96;

export type CampfirePlacementPreview = {
  x: number;
  y: number;
  canPlace: boolean;
  reason: 'ready' | 'needs-resources' | 'too-close';
};

export type FirstFirePreview = {
  canRebuild: boolean;
  reason: 'ready' | 'needs-kindling' | 'too-far' | 'already-lit';
};

export type FirstFireRelightPreview = {
  canRelight: boolean;
  reason: 'ready' | 'needs-kindling' | 'too-far' | 'already-lit' | 'broken' | 'missing-fire';
};

export type BeginnerInventorySlot = SatchelSlot;
export type BeginnerInventorySummary = SatchelSummary;
export const beginnerInventorySlotCount = beginnerSatchelSlotCount;
export const getBeginnerInventorySlots = (state: GameState): BeginnerInventorySlot[] => getSatchelSlots(state.inventory);
export const getBeginnerInventorySummary = (state: GameState): BeginnerInventorySummary => getSatchelSummary(state.inventory);
export const canCarryInventoryKind = (state: GameState, kind: SatchelItemKind): boolean =>
  canAddSatchelItem(state.inventory, kind);

export const updateInventory = (state: GameState, actions: ActionState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }

  for (const campfire of state.campfires) {
    campfire.fuelMs = Math.max(0, campfire.fuelMs - deltaMs);
  }

  for (const node of state.resources) {
    if (node.amount <= 0) {
      if (node.source) {
        continue;
      }
      node.respawnMs = Math.max(0, node.respawnMs - deltaMs);
      if (node.respawnMs <= 0) {
        node.amount = getResourceProfile(node.kind).defaultAmount;
      }
    }
  }

  if (actions.gather) {
    const node = getNearestGatherableResource(state);
    if (node) {
      if (!addSatchelItem(state.inventory, node.kind, 1)) {
        state.ui.inventoryMessage = 'No room in the satchel.';
        setPlayerThought(state, 'No room in the satchel.');
        syncOpeningPrompt(state);
        return;
      }
      state.ui.inventoryMessage = '';
      setPlayerThought(state, getGatherThought(node.kind));
      state.behaviorMemory.tools.gathered[node.kind] += 1;
      node.amount -= 1;
      if (node.amount <= 0) {
        node.respawnMs =
          isOpeningKindling(node) || node.source
            ? Number.POSITIVE_INFINITY
            : getResourceProfile(node.kind).defaultRespawnMs;
      }
      tryTriggerResourcePocketWave(state, node);
    }
  }
  syncOpeningPrompt(state);

  if (actions.craft) {
    if (state.world.openingStage === 'cold') {
      rebuildFirstFire(state);
    } else {
      relightFirstFire(state);
    }
  }

  if (actions.craftRecipeConfirm && state.ui.craftingOpen) {
    const recipe = getCraftingRecipes()[state.ui.selectedCraftingRecipeIndex];
    if (recipe) {
      craftRecipe(state, recipe.id);
    }
  }

  if (actions.useFood) {
    useFood(state);
  }
};

export const craftCampfire = (inventory: Inventory): boolean => {
  if (!hasCampfireResources(inventory)) {
    return false;
  }
  inventory.wood -= campfireWoodCost;
  inventory.stone -= campfireStoneCost;
  inventory.campfires += 1;
  return true;
};

export const placeCampfire = (state: GameState): boolean => {
  const preview = getCampfirePlacementPreview(state);
  if (!preview.canPlace || !craftCampfire(state.inventory)) {
    return false;
  }

  state.campfires.push({
    id: `campfire-${state.campfires.length + 1}`,
    x: preview.x,
    y: preview.y,
    radius: campfireSafetyRadius,
    fuelMs: campfireFuelMs,
    integrity: 80,
    maxIntegrity: 80
  });
  return true;
};

export const useFood = (state: GameState): boolean => {
  if (state.inventory.food <= 0 || state.player.hunger >= state.player.maxHunger) {
    return false;
  }
  state.inventory.food -= 1;
  state.player.hunger = clamp(state.player.hunger + 32, 0, state.player.maxHunger);
  return true;
};

export const rebuildFirstFire = (state: GameState): boolean => {
  const preview = getFirstFirePreview(state);
  if (!preview.canRebuild) {
    if (state.world.openingStage === 'cold' && preview.reason === 'needs-kindling') {
      state.world.openingPrompt = 'missing-materials';
    }
    return false;
  }

  state.inventory.twigs -= 1;
  state.inventory.dryGrass -= 1;
  state.inventory.bark -= 1;
  state.inventory.stone -= 1;
  const firstFire = getFirstFire(state);
  if (!firstFire) {
    return false;
  }
  firstFire.fuelMs = 45000;
  firstFire.integrity = firstFire.maxIntegrity;
  state.inventory.campfires += 1;
  state.behaviorMemory.fire.firstFireRebuilt = true;
  state.world.openingStage = 'first-flame';
  state.world.openingPrompt = 'spark-caught';
  state.world.cold = Math.min(state.world.cold, 62);
  setPlayerThought(state, 'The cold lets go a little.');
  return true;
};

export const relightFirstFire = (state: GameState): boolean => {
  if (state.world.openingStage === 'cold') {
    return rebuildFirstFire(state);
  }

  const preview = getFirstFireRelightPreview(state);
  if (!preview.canRelight) {
    if (preview.reason === 'needs-kindling') {
      setPlayerThought(state, 'It needs something dry.');
    } else if (preview.reason === 'broken') {
      setPlayerThought(state, 'The fire has lost its shape.');
    }
    return false;
  }

  const firstFire = getFirstFire(state);
  if (!firstFire) {
    return false;
  }

  state.inventory.twigs -= 1;
  state.inventory.dryGrass -= 1;
  state.inventory.bark -= 1;
  state.behaviorMemory.tools.usedAsFuel.twigs += 1;
  state.behaviorMemory.tools.usedAsFuel.dryGrass += 1;
  state.behaviorMemory.tools.usedAsFuel.bark += 1;
  firstFire.fuelMs = 45000;
  setPlayerThought(state, 'The flame catches again.');
  return true;
};

export const getFirstFirePreview = (state: GameState): FirstFirePreview => {
  const firstFire = getFirstFire(state);
  if (!firstFire) {
    return { canRebuild: false, reason: 'already-lit' };
  }
  if (firstFire.fuelMs > 0 || state.world.openingStage !== 'cold') {
    return { canRebuild: false, reason: 'already-lit' };
  }
  if (distance(state.player.x, state.player.y, firstFire.x, firstFire.y) > firstFireReach) {
    return { canRebuild: false, reason: 'too-far' };
  }
  if (!hasFirstFireKindling(state.inventory)) {
    return { canRebuild: false, reason: 'needs-kindling' };
  }
  return { canRebuild: true, reason: 'ready' };
};

export const getFirstFireRelightPreview = (state: GameState): FirstFireRelightPreview => {
  const firstFire = getFirstFire(state);
  if (!firstFire) {
    return { canRelight: false, reason: 'missing-fire' };
  }
  if (firstFire.fuelMs > 0) {
    return { canRelight: false, reason: 'already-lit' };
  }
  if (distance(state.player.x, state.player.y, firstFire.x, firstFire.y) > firstFireReach) {
    return { canRelight: false, reason: 'too-far' };
  }
  if (firstFire.integrity <= 0) {
    return { canRelight: false, reason: 'broken' };
  }
  if (!hasFirstFireRelightKindling(state.inventory)) {
    return { canRelight: false, reason: 'needs-kindling' };
  }
  return { canRelight: true, reason: 'ready' };
};

export const getNearestGatherableResource = (state: GameState): ResourceNode | undefined => {
  let nearest: ResourceNode | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of state.resources) {
    if (candidate.amount <= 0) {
      continue;
    }
    if (isResourceLockedByActiveWave(state, candidate)) {
      continue;
    }

    const profile = getResourceProfile(candidate.kind);
    const facingPoint = getFacingPoint(state.player, profile.facingReach);
    const directDistance = distance(candidate.x, candidate.y, state.player.x, state.player.y);
    const facingDistance = distance(candidate.x, candidate.y, facingPoint.x, facingPoint.y);
    const interactionDistance = Math.min(directDistance, facingDistance);
    if (interactionDistance <= profile.interactionRadius && interactionDistance < nearestDistance) {
      nearest = candidate;
      nearestDistance = interactionDistance;
    }
  }

  return nearest;
};

export const getCampfirePlacementPreview = (state: GameState): CampfirePlacementPreview => {
  const point = getPlacementPoint(state.player);
  if (!hasCampfireResources(state.inventory)) {
    return { ...point, canPlace: false, reason: 'needs-resources' };
  }

  const tooClose = state.campfires.some(
    (campfire) =>
      campfire.fuelMs > 0 &&
      campfire.integrity > 0 &&
      distance(point.x, point.y, campfire.x, campfire.y) < campfireMinimumSpacing
  );
  if (tooClose) {
    return { ...point, canPlace: false, reason: 'too-close' };
  }

  return { ...point, canPlace: true, reason: 'ready' };
};

const getFirstFire = (state: GameState) => state.campfires.find((campfire) => campfire.id === 'first-fire');

const hasCampfireResources = (inventory: Inventory): boolean =>
  inventory.wood >= campfireWoodCost && inventory.stone >= campfireStoneCost;

const isOpeningKindling = (node: ResourceNode): boolean =>
  getResourceProfile(node.kind).openingMaterial && node.source?.type === 'opening';

const syncOpeningPrompt = (state: GameState): void => {
  if (state.world.openingStage !== 'cold') {
    return;
  }
  if (hasFirstFireKindling(state.inventory)) {
    state.world.openingPrompt = 'ready';
  }
};

const hasFirstFireKindling = (inventory: Inventory): boolean =>
  inventory.twigs >= 1 && inventory.dryGrass >= 1 && inventory.bark >= 1 && inventory.stone >= 1;

const hasFirstFireRelightKindling = (inventory: Inventory): boolean =>
  inventory.twigs >= 1 && inventory.dryGrass >= 1 && inventory.bark >= 1;

const getPlacementPoint = (player: PlayerState): { x: number; y: number } => {
  switch (player.facing) {
    case 'north':
      return { x: player.x, y: player.y - campfirePlacementDistance };
    case 'south':
      return { x: player.x, y: player.y + campfirePlacementDistance };
    case 'west':
      return { x: player.x - campfirePlacementDistance, y: player.y + 8 };
    case 'east':
      return { x: player.x + campfirePlacementDistance, y: player.y + 8 };
  }
};

const getFacingPoint = (player: PlayerState, reach: number): { x: number; y: number } => {
  switch (player.facing) {
    case 'north':
      return { x: player.x, y: player.y - reach };
    case 'south':
      return { x: player.x, y: player.y + reach };
    case 'west':
      return { x: player.x - reach, y: player.y };
    case 'east':
      return { x: player.x + reach, y: player.y };
  }
};
