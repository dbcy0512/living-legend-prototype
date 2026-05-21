import type { CraftingRecipeId } from '../../content/craftingRecipes';
import type { GameState, ItemKind } from '../state';

const defaultThoughtMs = 2600;

export const tickPlayerThought = (state: GameState, deltaMs: number): void => {
  if (state.ui.thoughtTimerMs <= 0) {
    state.ui.thoughtTimerMs = 0;
    state.ui.thoughtMessage = '';
    return;
  }

  state.ui.thoughtTimerMs = Math.max(0, state.ui.thoughtTimerMs - deltaMs);
  if (state.ui.thoughtTimerMs <= 0) {
    state.ui.thoughtMessage = '';
  }
};

export const setPlayerThought = (state: GameState, message: string, durationMs = defaultThoughtMs): void => {
  state.ui.thoughtMessage = message;
  state.ui.thoughtTimerMs = durationMs;
};

export const getGatherThought = (kind: ItemKind): string => {
  switch (kind) {
    case 'twigs':
      return 'Small, but useful.';
    case 'dryGrass':
      return 'It might catch.';
    case 'bark':
      return 'Dry enough to help.';
    case 'wood':
      return 'Warmth, if it burns.';
    case 'stone':
      return 'A hard little answer.';
    case 'herbs':
      return 'Bitter. Maybe helpful.';
    case 'food':
      return 'Something for later.';
  }
};

export const getCraftingSuccessThought = (recipeId: CraftingRecipeId): string => {
  switch (recipeId) {
    case 'feed-fire':
      return 'The flame takes it.';
    case 'simple-poultice':
      return 'This might close a wound.';
    case 'stone-edge':
      return 'A sharper thought.';
    case 'branch-club':
      return 'Heavier in the hand.';
  }
};

export const getCraftingFailureThought = (
  reason: 'ready' | 'missing-items' | 'needs-active-fire' | 'satchel-full' | 'unknown-recipe'
): string => {
  switch (reason) {
    case 'ready':
      return '';
    case 'missing-items':
      return 'Something is missing.';
    case 'needs-active-fire':
      return 'It needs a living flame.';
    case 'satchel-full':
      return 'No room in the satchel.';
    case 'unknown-recipe':
      return 'That thought has no shape yet.';
  }
};
