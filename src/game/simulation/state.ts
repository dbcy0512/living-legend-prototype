import type { Direction } from '../input/actions';
import { startingArea } from '../content/maps/startingArea';
import {
  defaultEcosystemSeed,
} from '../content/ecosystem';
import { getEnemyDefinition, type EnemyKind } from '../content/enemies';
import { createStarterEquipmentState, type EquipmentState } from '../content/equipment';
import { createStarterCharacterModelState, type CharacterModelState } from '../content/characterModel';
import { getZoneOneEnemyWaveTriggers, type ZoneOneTriggerId } from '../content/maps/zoneOneConcept';
import type { MeleeSeed } from '../content/meleeSeeds';
import { createStartingResourceSeeds, type ResourceKind, type ResourceSource } from '../content/resources';
import type { WeaponAbilityId, WeaponAbilityStatusTag } from '../content/weaponAbilities';
import type { WorldCyclePhase } from './rules/dayNight';
import { createDefaultWorldLighting, type WorldLightingProfile } from './rules/lighting';

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
  lighting: WorldLightingProfile;
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
  kind: EnemyKind;
  id: string;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
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
  encounterId?: ZoneOneTriggerId;
};

export type EncounterPocketStatus = 'ready' | 'active' | 'cleared';

export type EncounterPocketState = {
  triggerId: ZoneOneTriggerId;
  status: EncounterPocketStatus;
  spawnedEnemyIds: string[];
  lockedResourceIds: string[];
};

export type EncounterState = {
  pockets: EncounterPocketState[];
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

export type ProgressionState = {
  stations: {
    basicWorkbenchBuilt: boolean;
  };
  exposedPathSteps: {
    medicine: 0 | 1;
    blade: 0 | 1;
    axe: 0 | 1;
  };
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
  characterModel: CharacterModelState;
  combat: CombatState;
  ability: AbilityState;
  world: WorldState;
  inventory: Inventory;
  behaviorMemory: BehaviorMemory;
  evolution: EvolutionState;
  progression: ProgressionState;
  equipment: EquipmentState;
  hotbar: HotbarState;
  ecosystem: EcosystemState;
  encounters: EncounterState;
  ui: UiState;
  respawnPoint: RespawnPointState;
  campfires: CampfireState[];
  resources: ResourceNode[];
  enemies: EnemyState[];
};

export type GameStateOptions = {
  ecosystemSeed?: string;
  includePrototypeEnemies?: boolean;
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
    characterModel: createStarterCharacterModelState(),
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
      lighting: createDefaultWorldLighting(),
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
    progression: createProgressionState(),
    equipment: createStarterEquipmentState(),
    hotbar: {
      utilityCooldownMs: 0
    },
    ecosystem: {
      seed: ecosystemSeed,
      lastRegenerationDay: 1,
      windfallPressure: 0,
      lastRegenerationPressure: 0
    },
    encounters: createEncounterState(),
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
    enemies: options.includePrototypeEnemies ? [createEnemyState('mire-spider')] : []
  };
};

export const createEnemyState = (
  kind: EnemyKind,
  overrides: Partial<Omit<EnemyState, 'kind'>> = {}
): EnemyState => {
  const definition = getEnemyDefinition(kind);
  const x = overrides.x ?? definition.home.x;
  const y = overrides.y ?? definition.home.y;

  return {
    kind,
    id: overrides.id ?? `${kind}-1`,
    x,
    y,
    homeX: overrides.homeX ?? definition.home.x,
    homeY: overrides.homeY ?? definition.home.y,
    health: overrides.health ?? definition.maxHealth,
    maxHealth: overrides.maxHealth ?? definition.maxHealth,
    mode: overrides.mode ?? 'watching',
    hunger: overrides.hunger ?? 34,
    fear: overrides.fear ?? 18,
    territoryPressure: overrides.territoryPressure ?? 0,
    boldness: overrides.boldness ?? 0,
    aggression: overrides.aggression ?? 0,
    attackTimerMs: overrides.attackTimerMs ?? 0,
    telegraphMs: overrides.telegraphMs ?? 0,
    phaseTimerMs: overrides.phaseTimerMs ?? 0,
    lungeX: overrides.lungeX ?? 0,
    lungeY: overrides.lungeY ?? 0,
    hasDamagedThisLunge: overrides.hasDamagedThisLunge ?? false,
    encounterId: overrides.encounterId
  };
};

const createEncounterState = (): EncounterState => ({
  pockets: getZoneOneEnemyWaveTriggers().map((trigger) => ({
    triggerId: trigger.id,
    status: 'ready',
    spawnedEnemyIds: [],
    lockedResourceIds: []
  }))
});

const createProgressionState = (): ProgressionState => ({
  stations: {
    basicWorkbenchBuilt: false
  },
  exposedPathSteps: {
    medicine: 0,
    blade: 0,
    axe: 0
  }
});

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
