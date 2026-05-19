import type { Direction } from '../input/actions';
import { startingArea } from '../content/maps/startingArea';
import {
  createEcosystemResourceSeeds,
  defaultEcosystemSeed,
  type EcosystemResourceSource
} from '../content/ecosystem';
import type { MeleeSeed } from '../content/meleeSeeds';

export type Inventory = {
  twigs: number;
  dryGrass: number;
  bark: number;
  wood: number;
  stone: number;
  herbs: number;
  food: number;
  campfires: number;
  stoneEdges: number;
  branchClubs: number;
};

export type ItemKind = keyof Pick<Inventory, 'twigs' | 'dryGrass' | 'bark' | 'wood' | 'stone' | 'herbs' | 'food'>;

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

export type WorldState = {
  timeOfDay: number;
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
  source?: EcosystemResourceSource;
};

export type EnemyState = {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  mode: 'watching' | 'stalking' | 'telegraphing' | 'lunging' | 'recovering';
  hunger: number;
  fear: number;
  territoryPressure: number;
  boldness: number;
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
  equippedMeleeSeed: MeleeSeed;
  bladeSeedAffinity: number;
  axeSeedAffinity: number;
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
  lastCraftedRecipeId?: string;
  craftMessage: string;
};

export type GameState = {
  player: PlayerState;
  combat: CombatState;
  world: WorldState;
  inventory: Inventory;
  behaviorMemory: BehaviorMemory;
  evolution: EvolutionState;
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
    world: {
      timeOfDay: 0.32,
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
      stoneEdges: 0,
      branchClubs: 0
    },
    behaviorMemory: createBehaviorMemory(),
    evolution: {
      cleanerRoll: false,
      equippedMeleeSeed: 'bare-hands',
      bladeSeedAffinity: 0,
      axeSeedAffinity: 0
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
        fuelMs: 0
      }
    ],
    resources: [
      { id: 'first-twig', kind: 'twigs', x: 620, y: 524, amount: 1, respawnMs: 0 },
      { id: 'dry-grass-handful', kind: 'dryGrass', x: 815, y: 506, amount: 1, respawnMs: 0 },
      { id: 'curl-of-bark', kind: 'bark', x: 642, y: 608, amount: 1, respawnMs: 0 },
      { id: 'striking-stone', kind: 'stone', x: 832, y: 598, amount: 1, respawnMs: 0 },
      { id: 'elder-branch', kind: 'wood', x: 405, y: 520, amount: 3, respawnMs: 0 },
      { id: 'moon-stone', kind: 'stone', x: 1045, y: 332, amount: 2, respawnMs: 0 },
      { id: 'sun-herb', kind: 'herbs', x: 520, y: 720, amount: 2, respawnMs: 0 },
      { id: 'wild-fruit', kind: 'food', x: 1116, y: 674, amount: 2, respawnMs: 0 },
      { id: 'silver-herb', kind: 'herbs', x: 268, y: 684, amount: 2, respawnMs: 0 },
      ...createEcosystemResourceSeeds(ecosystemSeed)
    ],
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
