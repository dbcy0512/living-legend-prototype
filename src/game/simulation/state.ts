import type { Direction } from '../input/actions';
import { startingArea } from '../content/maps/startingArea';
import {
  defaultEcosystemSeed,
} from '../content/ecosystem';
import type { MeleeSeed } from '../content/meleeSeeds';
import { createStartingResourceSeeds, type ResourceKind, type ResourceSource } from '../content/resources';
import type { WeaponAbilityId, WeaponAbilityStatusTag } from '../content/weaponAbilities';
import type { WorldCyclePhase } from './rules/dayNight';

export type Inventory = {
  twigs: number;
  dryGrass: number;
  bark: number;
  wood: number;
  stone: number;
  herbs: number;
  food: number;
  campfires: number;
  poultices: number;
  stoneEdges: number;
  branchClubs: number;
};

export type ItemKind = ResourceKind;

export type PlayerState = {
  x: number;
  y: number;
  facing: Direction;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  hunger: number;
  maxHunger: number;
  speed: number;
  invulnerableMs: number;
};

export type CombatState = {
  phase: 'idle' | 'windup' | 'active' | 'recovery' | 'rolling';
  timerMs: number;
  cooldownMs: number;
  rollCooldownMs: number;
  hitStopMs: number;
  lastHitFlashMs: number;
};

export type AbilityState = {
  activeId?: WeaponAbilityId;
  linkedWeapon?: MeleeSeed;
  animationKey: string;
  statusTags: WeaponAbilityStatusTag[];
  damage: number;
  staminaCost: number;
  reach: number;
  width: number;
  cooldownMs: number;
  cooldownDurationMs: number;
  timerMs: number;
  hasAppliedHit: boolean;
  lastUsedId?: WeaponAbilityId;
};

export type WorldState = {
  timeOfDay: number;
  cyclePhase: WorldCyclePhase;
  day: number;
  mood: number;
  windPhase: number;
  lifePulse: number;
  rawNightPressure: number;
  localNightPressure: number;
  dawnDuskGlow: number;
  cold: number;
  maxCold: number;
  openingStage: 'cold' | 'first-flame' | 'open';
  openingPrompt: 'fire-dead' | 'missing-materials' | 'ready' | 'spark-caught';
  respawns: number;
  status: 'playing' | 'won' | 'lost';
  paused: boolean;
};

export type ResourceNode = {
  id: string;
  kind: ItemKind;
  x: number;
  y: number;
  amount: number;
  respawnMs: number;
  source?: ResourceSource;
};

export type EnemyState = {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  mode: 'watching' | 'stalking' | 'telegraphing' | 'lunging' | 'recovering' | 'attacking-fire';
  hunger: number;
  fear: number;
  territoryPressure: number;
  boldness: number;
  aggression: number;
  attackTimerMs: number;
  telegraphMs: number;
  phaseTimerMs: number;
  lungeX: number;
  lungeY: number;
  hasDamagedThisLunge: boolean;
};

export type CampfireState = {
  id: string;
  x: number;
  y: number;
  radius: number;
  fuelMs: number;
  integrity: number;
  maxIntegrity: number;
};

export type RespawnPointState = {
  x: number;
  y: number;
};

export type ItemMemory = Record<ItemKind, number>;

export type BehaviorMemory = {
  body: {
    coldMs: number;
    exhaustedMs: number;
    damageTaken: number;
    collapses: number;
  };
  combat: {
    attacksStarted: number;
    hitsLanded: number;
    dodgesUsed: number;
    wolfLungesDodged: number;
    hitsTaken: number;
    branchClubAttacks: number;
    stoneEdgeAttacks: number;
  };
  abilities: {
    used: Record<WeaponAbilityId, number>;
    hits: Record<WeaponAbilityId, number>;
  };
  tools: {
    gathered: ItemMemory;
    usedAsWeapon: ItemMemory;
    usedAsFuel: ItemMemory;
  };
  fire: {
    firstFireRebuilt: boolean;
    timeNearActiveFireMs: number;
    returnedToFireUnderThreat: number;
    foughtNearFireMs: number;
  };
  creatures: {
    wolfHits: number;
    wolfScared: number;
    wolfLungesFaced: number;
    wolfLungesAvoided: number;
  };
};

export type EvolutionState = {
  cleanerRoll: boolean;
  bladeSeedAffinity: number;
  axeSeedAffinity: number;
};

export type EquipmentState = {
  mainHand: MeleeSeed;
  tool: 'none';
  body: 'worn-cloth';
};

export type HotbarState = {
  utilityCooldownMs: number;
};

export type EcosystemState = {
  seed: string;
  lastRegenerationDay: number;
  windfallPressure: number;
  lastRegenerationPressure: number;
};

export type UiState = {
  inventoryOpen: boolean;
  craftingOpen: boolean;
  selectedCraftingRecipeIndex: number;
  selectedHotbarSlot: number;
  hotbarMessage: string;
  inventoryMessage: string;
  thoughtMessage: string;
  thoughtTimerMs: number;
  lastCraftedRecipeId?: string;
  craftMessage: string;
};

export type GameState = {
  player: PlayerState;
  combat: CombatState;
  ability: AbilityState;
  world: WorldState;
  inventory: Inventory;
  behaviorMemory: BehaviorMemory;
  evolution: EvolutionState;
  equipment: EquipmentState;
  hotbar: HotbarState;
  ecosystem: EcosystemState;
  ui: UiState;
  respawnPoint: RespawnPointState;
  campfires: CampfireState[];
  resources: ResourceNode[];
  enemies: EnemyState[];
};

export type GameStateOptions = {
  ecosystemSeed?: string;
};

export const createGameState = (options: GameStateOptions = {}): GameState => {
  const ecosystemSeed = options.ecosystemSeed ?? defaultEcosystemSeed;

  return {
    player: {
      x: startingArea.playerStart.x,
      y: startingArea.playerStart.y,
      facing: 'south',
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      hunger: 100,
      maxHunger: 100,
      speed: 132,
      invulnerableMs: 0
    },
    combat: {
      phase: 'idle',
      timerMs: 0,
      cooldownMs: 0,
      rollCooldownMs: 0,
      hitStopMs: 0,
      lastHitFlashMs: 0
    },
    ability: {
      animationKey: '',
      statusTags: [],
      damage: 0,
      staminaCost: 0,
      reach: 0,
      width: 0,
      cooldownMs: 0,
      cooldownDurationMs: 0,
      timerMs: 0,
      hasAppliedHit: false
    },
    world: {
      timeOfDay: 0.42,
      cyclePhase: 'day',
      day: 1,
      mood: 0.45,
      windPhase: 0,
      lifePulse: 0,
      rawNightPressure: 0,
      localNightPressure: 0,
      dawnDuskGlow: 0,
      cold: 100,
      maxCold: 100,
      openingStage: 'cold',
      openingPrompt: 'fire-dead',
      respawns: 0,
      status: 'playing',
      paused: false
    },
    inventory: {
      twigs: 0,
      dryGrass: 0,
      bark: 0,
      wood: 0,
      stone: 0,
      herbs: 0,
      food: 0,
      campfires: 0,
      poultices: 0,
      stoneEdges: 0,
      branchClubs: 0
    },
    behaviorMemory: createBehaviorMemory(),
    evolution: {
      cleanerRoll: false,
      bladeSeedAffinity: 0,
      axeSeedAffinity: 0
    },
    equipment: {
      mainHand: 'bare-hands',
      tool: 'none',
      body: 'worn-cloth'
    },
    hotbar: {
      utilityCooldownMs: 0
    },
    ecosystem: {
      seed: ecosystemSeed,
      lastRegenerationDay: 1,
      windfallPressure: 0,
      lastRegenerationPressure: 0
    },
    ui: {
      inventoryOpen: false,
      craftingOpen: false,
      selectedCraftingRecipeIndex: 0,
      selectedHotbarSlot: 0,
      hotbarMessage: '',
      inventoryMessage: '',
      thoughtMessage: '',
      thoughtTimerMs: 0,
      craftMessage: ''
    },
    respawnPoint: {
      x: startingArea.playerStart.x - 108,
      y: startingArea.playerStart.y + 20
    },
    campfires: [
      {
        id: 'first-fire',
        x: startingArea.playerStart.x,
        y: startingArea.playerStart.y + 42,
        radius: 150,
        fuelMs: 0,
        integrity: 100,
        maxIntegrity: 100
      }
    ],
    resources: createStartingResourceSeeds(ecosystemSeed),
    enemies: [
      {
        id: 'hollow-wolf',
        x: 1188,
        y: 214,
        health: 35,
        maxHealth: 35,
        mode: 'watching',
        hunger: 34,
        fear: 18,
        territoryPressure: 0,
        boldness: 0,
        aggression: 0,
        attackTimerMs: 0,
        telegraphMs: 0,
        phaseTimerMs: 0,
        lungeX: 0,
        lungeY: 0,
        hasDamagedThisLunge: false
      }
    ]
  };
};

const createItemMemory = (): ItemMemory => ({
  twigs: 0,
  dryGrass: 0,
  bark: 0,
  wood: 0,
  stone: 0,
  herbs: 0,
  food: 0
});

const createBehaviorMemory = (): BehaviorMemory => ({
  body: {
    coldMs: 0,
    exhaustedMs: 0,
    damageTaken: 0,
    collapses: 0
  },
  combat: {
    attacksStarted: 0,
    hitsLanded: 0,
    dodgesUsed: 0,
    wolfLungesDodged: 0,
    hitsTaken: 0,
    branchClubAttacks: 0,
    stoneEdgeAttacks: 0
  },
  abilities: {
    used: createAbilityMemory(),
    hits: createAbilityMemory()
  },
  tools: {
    gathered: createItemMemory(),
    usedAsWeapon: createItemMemory(),
    usedAsFuel: createItemMemory()
  },
  fire: {
    firstFireRebuilt: false,
    timeNearActiveFireMs: 0,
    returnedToFireUnderThreat: 0,
    foughtNearFireMs: 0
  },
  creatures: {
    wolfHits: 0,
    wolfScared: 0,
    wolfLungesFaced: 0,
    wolfLungesAvoided: 0
  }
});

const createAbilityMemory = (): Record<WeaponAbilityId, number> => ({
  'unarmed-survival-swipe': 0,
  'branch-club-heavy-swing': 0,
  'stone-edge-cleaving-cut': 0
});
