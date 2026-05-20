import type { Inventory } from '../simulation/state';

export type CraftingRecipeId = 'feed-fire' | 'simple-poultice' | 'stone-edge' | 'branch-club';

export type CraftingInputKind = 'twigs' | 'dryGrass' | 'bark' | 'wood' | 'stone' | 'herbs';

export type CraftingRecipe = {
  id: CraftingRecipeId;
  name: string;
  description: string;
  cost: Partial<Record<CraftingInputKind, number>>;
  context: 'anywhere' | 'near-active-fire';
  effect:
    | {
        type: 'fuel-fire';
        fuelMs: number;
      }
    | {
        type: 'heal-player';
        health: number;
      }
    | {
        type: 'create-item';
        item: keyof Pick<Inventory, 'poultices' | 'stoneEdges' | 'branchClubs'>;
        amount: number;
      };
};

export const craftingRecipes = [
  {
    id: 'feed-fire',
    name: 'Feed Fire',
    description: 'Give nearby flame a little more life.',
    cost: { wood: 1 },
    context: 'near-active-fire',
    effect: { type: 'fuel-fire', fuelMs: 18000 }
  },
  {
    id: 'simple-poultice',
    name: 'Simple Poultice',
    description: 'Bind bitter leaves against broken skin.',
    cost: { herbs: 1, bark: 1 },
    context: 'anywhere',
    effect: { type: 'create-item', item: 'poultices', amount: 1 }
  },
  {
    id: 'stone-edge',
    name: 'Stone Edge',
    description: 'Make a crude cutting edge from stone and bark.',
    cost: { stone: 1, bark: 1, twigs: 1 },
    context: 'anywhere',
    effect: { type: 'create-item', item: 'stoneEdges', amount: 1 }
  },
  {
    id: 'branch-club',
    name: 'Branch Club',
    description: 'Wrap a heavy branch into something held with intent.',
    cost: { wood: 1, bark: 1 },
    context: 'anywhere',
    effect: { type: 'create-item', item: 'branchClubs', amount: 1 }
  }
] as const satisfies readonly CraftingRecipe[];

export const getCraftingRecipes = (): readonly CraftingRecipe[] => craftingRecipes;

export const getCraftingRecipe = (id: CraftingRecipeId): CraftingRecipe | undefined =>
  craftingRecipes.find((recipe) => recipe.id === id);
