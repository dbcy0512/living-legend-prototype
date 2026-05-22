import { assetKeys } from '../../assets/manifest';
import type { EnemyHabitatTag, EnemyKind } from '../enemies';
import type { ResourceEcologyTag, ResourceKind } from '../resources';
import { startingAreaLayout } from './startingArea';

export type ZoneOneRegionId =
  | 'camp-clearing-hub'
  | 'herb-berry-patch'
  | 'stone-outcrop'
  | 'water-source'
  | 'clay-mud-bank'
  | 'deep-forest'
  | 'dense-forest-east'
  | 'deadwood-mushrooms'
  | 'animal-trails'
  | 'future-danger-gate';

export type ZoneOneRegion = {
  id: ZoneOneRegionId;
  label: string;
  role:
    | 'hub'
    | 'resource-pocket'
    | 'resource-habitat'
    | 'travel-corridor'
    | 'danger-gate'
    | 'mystery-poi'
    | 'crafting-support';
  dangerTier: 0 | 1 | 2 | 3;
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
  resourceKinds: readonly ResourceKind[];
  ecologyTags: readonly ResourceEcologyTag[];
  enemyHabitats: readonly EnemyHabitatTag[];
  resourceProfile: ZoneOneResourceProfile;
  enemyPressureProfile: ZoneOneEnemyPressureProfile;
  discoveryProfile: ZoneOneDiscoveryProfile;
  visibilityProfile: ZoneOneVisibilityProfile;
  ambientProfile: ZoneOneAmbientProfile;
  accessState: ZoneOneAccessState;
  requiredUnlocks: readonly string[];
  poiProfile: ZoneOnePoiProfile;
  designIntent: string;
};

export type ZoneOneAccessState = 'open' | 'soft-warning' | 'blocked' | 'requires-tool' | 'requires-story';

export type ZoneOneResourceProfile = {
  density: 'none' | 'sparse' | 'common' | 'rich';
  renews: boolean;
  renewalRule: 'daily' | 'after-rain' | 'seasonal' | 'manual-reset' | 'none';
  overharvestEffect?: 'none' | 'reduced-yield' | 'enemy-trigger' | 'resource-damage' | 'ecology-shift';
};

export type ZoneOneEnemyPressureProfile = {
  daytimeTier: 0 | 1 | 2 | 3;
  nighttimeTier: 0 | 1 | 2 | 3;
  patrolAllowed: boolean;
  ambushAllowed: boolean;
  triggerIds: readonly ZoneOneTriggerId[];
};

export type ZoneOneDiscoveryProfile = {
  firstVisitMessage: string;
  inspectables: readonly string[];
  unlockHints: readonly string[];
  returnReasons: readonly string[];
};

export type ZoneOneVisibilityProfile = {
  canopyDensity: 0 | 1 | 2 | 3;
  sightPenalty: 0 | 1 | 2 | 3;
  minimapReveal: 'immediate' | 'partial' | 'requires-scouting';
};

export type ZoneOneAmbientProfile = {
  soundscape: readonly string[];
  musicMood: 'safe' | 'curious' | 'tense' | 'danger' | 'mystery';
  nighttimeShift?: string;
};

export type ZoneOnePoiProfile = {
  emotionalRole: string;
  worldLogic: string;
  resourceLogic: string;
  threatLogic: string;
  progressionUse: string;
  placementRules: readonly string[];
};

export type ZoneOneTriggerId = 'deadwood-skitter-trigger' | 'animal-trail-pressure-trigger' | 'future-gate-warning-trigger';

export type ZoneOneEnemyWaveTrigger = {
  id: ZoneOneTriggerId;
  label: string;
  regionId: ZoneOneRegionId;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  enemyKinds: readonly EnemyKind[];
  maxActive: number;
  triggerWhen: 'gather-resource' | 'enter-region' | 'linger-in-region' | 'return-at-night';
  designIntent: string;
};

export type ZoneOneSanctuary = {
  id: 'camp-sanctuary';
  label: string;
  center: {
    x: number;
    y: number;
  };
  radius: number;
  suppressEnemySpawns: boolean;
  suppressHostileProjectiles: boolean;
  allowThreatAtNightEdge: boolean;
  designIntent: string;
};

export type ZoneOneHabitatAnchor = {
  id: string;
  triggerId: ZoneOneTriggerId;
  label: string;
  textureKey: string;
  x: number;
  y: number;
  scale: number;
  enemyKinds: readonly EnemyKind[];
  spawnPoint: {
    x: number;
    y: number;
  };
  designIntent: string;
};

export type ZoneOnePreparedGroundPatch = {
  id: string;
  regionId: ZoneOneRegionId;
  material:
    | 'damp-deadwood-floor'
    | 'rotting-log-litter'
    | 'soft-shade-edge'
    | 'water-body'
    | 'reed-bank'
    | 'muddy-bank'
    | 'trampled-animal-trail'
    | 'leaf-litter'
    | 'dry-clearing-edge'
    | 'stone-rubble'
    | 'flower-meadow'
    | 'camp-worn-earth';
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
  opacity: number;
  scatterDensity: 0 | 1 | 2 | 3;
  designIntent: string;
};

export type ZoneOneLivingCue = {
  id: string;
  regionId: ZoneOneRegionId;
  kind: 'water-ripple' | 'reed-sway' | 'grass-sway' | 'insect-mote' | 'spore-mote' | 'leaf-drift' | 'trail-dust';
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
  intensity: 1 | 2 | 3;
  activeWhen: 'always' | 'day' | 'night' | 'dawn-dusk';
  designIntent: string;
};

const zoneOneRegions = [
  {
    id: 'camp-clearing-hub',
    label: 'Camp Clearing / Hub',
    role: 'hub',
    dangerTier: 0,
    center: startingAreaLayout.campCenter,
    radius: { x: 260, y: 150 },
    resourceKinds: ['twigs', 'dryGrass', 'bark', 'stone'],
    ecologyTags: ['dead-fire-debris', 'dry-clearing-edge', 'exposed-stone'],
    enemyHabitats: [],
    resourceProfile: {
      density: 'sparse',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'none'
    },
    enemyPressureProfile: {
      daytimeTier: 0,
      nighttimeTier: 0,
      patrolAllowed: false,
      ambushAllowed: false,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'The fire is dead. It could burn again.',
      inspectables: ['dead-fire-pit', 'leaf-bed', 'old-cloth-scraps', 'ash-ring'],
      unlockHints: ['Warmth can make the clearing answer back.', 'A simple work place could make loose things useful.'],
      returnReasons: ['rebuild fire', 'rest', 'craft crude tools', 'organize supplies']
    },
    visibilityProfile: {
      canopyDensity: 0,
      sightPenalty: 0,
      minimapReveal: 'immediate'
    },
    ambientProfile: {
      soundscape: ['thin wind', 'distant birds', 'small fire crackle after lighting'],
      musicMood: 'safe',
      nighttimeShift: 'The clearing stays quieter than the forest edge, but distant movement becomes easier to hear.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Home before comfort. The child has one fragile place that can answer cold.',
      worldLogic: 'A failed overnight camp left a dead fire shape, scattered survival debris, and a small clearing made by prior struggle.',
      resourceLogic: 'Only primitive first-fire materials belong here: twigs, dry grass, bark, and a striking stone close enough for first recovery.',
      threatLogic: 'The sanctuary is safe by default. Early enemies should not randomly pressure this circle unless a later event deliberately violates home.',
      progressionUse: 'Introduces warmth, crafting proximity, resting, learning, and the idea that the world becomes useful through attention.',
      placementRules: [
        'Keep the fire and sleep spot readable from the first camera view.',
        'Starter resources should read as failed-camp debris, not loot drops.',
        'Do not place active enemy habitat inside the sanctuary radius.'
      ]
    },
    designIntent: 'The first breath area. Resources here should look like survival debris around a failed camp, not rewards.'
  },
  {
    id: 'herb-berry-patch',
    label: 'Herb & Berry Patch',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 590, y: 450 },
    radius: { x: 220, y: 150 },
    resourceKinds: ['herbs', 'food'],
    ecologyTags: ['damp-shade', 'edge-growth'],
    enemyHabitats: ['damp-shade'],
    resourceProfile: {
      density: 'common',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'reduced-yield'
    },
    enemyPressureProfile: {
      daytimeTier: 0,
      nighttimeTier: 1,
      patrolAllowed: false,
      ambushAllowed: true,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'Soft leaves grow where the light reaches the ground.',
      inspectables: ['berry-bush', 'bitter-herb', 'flower-stem', 'thorn-stem'],
      unlockHints: ['Some plants answer hunger. Some answer pain.', 'Taking too much from one patch may change what grows back.'],
      returnReasons: ['gather food', 'craft poultices', 'collect plant fiber', 'watch regrowth']
    },
    visibilityProfile: {
      canopyDensity: 1,
      sightPenalty: 0,
      minimapReveal: 'immediate'
    },
    ambientProfile: {
      soundscape: ['leaf rustle', 'small insects', 'lighter bird calls'],
      musicMood: 'curious',
      nighttimeShift: 'Insects become louder and bushes feel less certain after dark.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'First proof that living plants can help, but the woods are still indifferent.',
      worldLogic: 'Light breaks along the forest edge, letting berries, low herbs, and soft ground growth cluster together.',
      resourceLogic: 'Food and medicine should come from bushes, leafy edges, shaded flowers, and visible plant density.',
      threatLogic: 'Threat should be light or defensive here: skittish small life, disturbed nests, or future poison/irritation pressure.',
      progressionUse: 'Teaches healing ingredients, food gathering, and plant recognition before combat pressure dominates.',
      placementRules: [
        'Prepare bushes or dense edge growth before placing berries.',
        'Herbs should sit in shade or moisture pockets, never isolated in open grass.',
        'Keep first visits lower danger than deadwood or animal trails.'
      ]
    },
    designIntent: 'A softer pocket that teaches living plants have use, with light creature risk later.'
  },
  {
    id: 'stone-outcrop',
    label: 'Stone Outcrop',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 470, y: 790 },
    radius: { x: 210, y: 135 },
    resourceKinds: ['stone'],
    ecologyTags: ['exposed-stone'],
    enemyHabitats: [],
    resourceProfile: {
      density: 'common',
      renews: true,
      renewalRule: 'manual-reset',
      overharvestEffect: 'reduced-yield'
    },
    enemyPressureProfile: {
      daytimeTier: 0,
      nighttimeTier: 1,
      patrolAllowed: false,
      ambushAllowed: false,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'Hard shapes push through the dirt here.',
      inspectables: ['loose-stone', 'flint-crack', 'flat-work-stone', 'gravel-edge'],
      unlockHints: ['A sharp edge can change what a branch means.', 'The flat stone could support crude tool work later.'],
      returnReasons: ['craft stone edge', 'collect tool stone', 'prepare axe path', 'test thrown rocks']
    },
    visibilityProfile: {
      canopyDensity: 0,
      sightPenalty: 0,
      minimapReveal: 'immediate'
    },
    ambientProfile: {
      soundscape: ['gravel underfoot', 'open wind', 'distant forest'],
      musicMood: 'curious',
      nighttimeShift: 'Open ground feels exposed when the forest quiets down.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Useful exposure. The player leaves shelter to get something hard and practical.',
      worldLogic: 'Erosion and exposed ground push usable stone to the surface where roots and dirt thin out.',
      resourceLogic: 'Stone and future flint require visible rock clusters, gravel, cracked dirt, or outcrop silhouettes.',
      threatLogic: 'Threat comes from exposure and low cover first, with later ambushes from nearby grass or cracks.',
      progressionUse: 'Seeds stone edge crafting, tool identity, and later axe-path material logic.',
      placementRules: [
        'No stone without exposed ground, rock clusters, or erosion marks.',
        'Keep sightlines more open than forest pockets.',
        'Use fewer plants so the material contrast reads immediately.'
      ]
    },
    designIntent: 'Exposed rock and erosion should visually explain stone and future flint.'
  },
  {
    id: 'water-source',
    label: 'Water Source',
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 450, y: 1240 },
    radius: { x: 260, y: 180 },
    resourceKinds: ['herbs', 'food'],
    ecologyTags: ['damp-shade', 'edge-growth'],
    enemyHabitats: ['damp-shade'],
    resourceProfile: {
      density: 'common',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'reduced-yield'
    },
    enemyPressureProfile: {
      daytimeTier: 1,
      nighttimeTier: 2,
      patrolAllowed: true,
      ambushAllowed: true,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'The water looks helpful, but the bank does not feel still.',
      inspectables: ['reed-bend', 'wet-stone', 'mud-edge', 'waterline'],
      unlockHints: ['Reeds can bind. Water can cook. The bank can slow a body down.', 'A container would make this place more useful.'],
      returnReasons: ['collect reeds', 'fill water later', 'fish later', 'follow wet clay traces']
    },
    visibilityProfile: {
      canopyDensity: 1,
      sightPenalty: 0,
      minimapReveal: 'immediate'
    },
    ambientProfile: {
      soundscape: ['lapping water', 'reed movement', 'damp insects'],
      musicMood: 'curious',
      nighttimeShift: 'Water sounds carry farther after dark and can hide smaller movement.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Beautiful uncertainty. Water looks like life but should not feel fully mastered.',
      worldLogic: 'A low basin gathers runoff, reeds, mud edges, small edible life, and damp vegetation.',
      resourceLogic: 'Future water, reeds, fish, mud herbs, and wet fibers must hug the shoreline or marsh edge.',
      threatLogic: 'Early threat is environmental unease; later water-edge creatures, slippery mud, and sound attraction can live here.',
      progressionUse: 'Anchors future thirst, fishing, reeds, washing/status recovery, and water-crossing ideas.',
      placementRules: [
        'Water resources must touch shoreline, reeds, or mud.',
        'Do not place dry materials inside the wet pocket.',
        'Use reflection, reeds, and bank shapes before adding harvestables.'
      ]
    },
    designIntent: 'Future water/reed/fish logic. For now it anchors damp resources and mud-side life.'
  },
  {
    id: 'clay-mud-bank',
    label: 'Clay & Mud',
    role: 'crafting-support',
    dangerTier: 1,
    center: { x: 860, y: 1285 },
    radius: { x: 190, y: 120 },
    resourceKinds: ['stone'],
    ecologyTags: ['exposed-stone', 'damp-shade'],
    enemyHabitats: ['damp-shade'],
    resourceProfile: {
      density: 'sparse',
      renews: true,
      renewalRule: 'after-rain',
      overharvestEffect: 'resource-damage'
    },
    enemyPressureProfile: {
      daytimeTier: 1,
      nighttimeTier: 2,
      patrolAllowed: false,
      ambushAllowed: true,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'The ground gives underfoot, but it holds shape in the hand.',
      inspectables: ['muddy-bank', 'clay-shelf', 'flat-stone', 'wet-reed'],
      unlockHints: ['Soft earth can become a vessel.', 'Standing too long in wet ground should matter later.'],
      returnReasons: ['shape clay', 'prepare containers', 'collect bait later', 'test mud slow']
    },
    visibilityProfile: {
      canopyDensity: 1,
      sightPenalty: 0,
      minimapReveal: 'immediate'
    },
    ambientProfile: {
      soundscape: ['wet footstep', 'low insects', 'soft water trickle'],
      musicMood: 'curious',
      nighttimeShift: 'The bank becomes harder to read and easier to stumble through after dark.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Primitive practicality. Survival becomes messy and hands-on.',
      worldLogic: 'Where water drains and soil settles, clay and mud gather below roots and stone edges.',
      resourceLogic: 'Clay, mud, damp stone, and future container materials belong on wet banks and darker exposed soil.',
      threatLogic: 'Low immediate danger; later slow movement, insects, or crafting risk can make this area matter.',
      progressionUse: 'Prepares future containers, crude kiln, station crafting, and building material progression.',
      placementRules: [
        'Use darker wet ground before clay or mud resources appear.',
        'Keep this near water logic, not random forest floor.',
        'Favor utility over combat pressure in first implementation.'
      ]
    },
    designIntent: 'Future crafting material pocket that connects water, mud, and survival building.'
  },
  {
    id: 'deep-forest',
    label: 'Deep Forest',
    role: 'resource-habitat',
    dangerTier: 3,
    center: { x: 1400, y: 390 },
    radius: { x: 280, y: 180 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'dense-forest-edge'],
    resourceProfile: {
      density: 'rich',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'ecology-shift'
    },
    enemyPressureProfile: {
      daytimeTier: 2,
      nighttimeTier: 3,
      patrolAllowed: true,
      ambushAllowed: true,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'The trees close around the path.',
      inspectables: ['thick-branch', 'bark-sheet', 'old-root', 'strange-tree-mark'],
      unlockHints: ['Better wood lives where the forest is older.', 'Some trees here should feel like they are watching.'],
      returnReasons: ['collect stronger wood', 'find resin later', 'scout strange tree', 'test stealth and sight']
    },
    visibilityProfile: {
      canopyDensity: 3,
      sightPenalty: 2,
      minimapReveal: 'requires-scouting'
    },
    ambientProfile: {
      soundscape: ['heavy canopy', 'distant branch creak', 'hidden movement'],
      musicMood: 'tense',
      nighttimeShift: 'At night the deep forest becomes a danger band, not a normal gathering route.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'The first place where the woods feel bigger than the player.',
      worldLogic: 'Dense canopy, fallen limbs, bark shed, and shaded rot create a stronger forest-material pocket.',
      resourceLogic: 'Wood, twigs, and bark must attach to trees, roots, deadfall, or shaded windfall zones.',
      threatLogic: 'Pressure should come from limited visibility and territory feeling, not instant swarm combat.',
      progressionUse: 'Introduces better wood, shelter parts, stealth/visibility experiments, and deeper forest identity.',
      placementRules: [
        'Branches should spawn under trees or deadfall bands.',
        'Canopy and trunks should create partial occlusion or narrow sightlines.',
        'Do not use bright open-field ground as the dominant material.'
      ]
    },
    designIntent: 'A denser wood pocket. Better tree materials come from stronger forest identity.'
  },
  {
    id: 'dense-forest-east',
    label: 'Dense Forest',
    role: 'resource-habitat',
    dangerTier: 2,
    center: { x: 2180, y: 440 },
    radius: { x: 330, y: 190 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'edge-growth'],
    enemyHabitats: ['dense-forest-edge', 'deadwood'],
    resourceProfile: {
      density: 'common',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'reduced-yield'
    },
    enemyPressureProfile: {
      daytimeTier: 1,
      nighttimeTier: 2,
      patrolAllowed: true,
      ambushAllowed: false,
      triggerIds: []
    },
    discoveryProfile: {
      firstVisitMessage: 'The forest gives more here, but it also hides more.',
      inspectables: ['windfall-branch', 'bark-shed', 'softwood-limb', 'vine-edge'],
      unlockHints: ['Wood should come from trees, roots, and fallen limbs.', 'Night changes routine work into risk.'],
      returnReasons: ['gather basic wood', 'collect bark', 'find vines later', 'practice return routes']
    },
    visibilityProfile: {
      canopyDensity: 2,
      sightPenalty: 1,
      minimapReveal: 'partial'
    },
    ambientProfile: {
      soundscape: ['leaf pressure', 'wood creak', 'small animals'],
      musicMood: 'tense',
      nighttimeShift: 'The same useful route gains patrol pressure after dark.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Tempting abundance just past comfort.',
      worldLogic: 'The eastern forest edge has heavier tree growth, richer windfall, and less visibility from camp.',
      resourceLogic: 'Better wood materials should cluster around tree parents, forest edge piles, and broken limb context.',
      threatLogic: 'Future threat can escalate here through patrols, den proximity, or nighttime pathing.',
      progressionUse: 'Supports higher-quality early crafting once the player earns confidence and mobility.',
      placementRules: [
        'Place forest resources in groups around tree logic, not even scatter.',
        'Use density and shadow to make the pocket feel less comfortable than camp.',
        'Leave approach space for combat and retreat decisions.'
      ]
    },
    designIntent: 'A thicker forest edge that should feel useful but less comfortable than the hub.'
  },
  {
    id: 'deadwood-mushrooms',
    label: 'Deadwood & Mushrooms',
    role: 'resource-habitat',
    dangerTier: 2,
    center: { x: 2180, y: 850 },
    radius: { x: 270, y: 170 },
    resourceKinds: ['wood', 'herbs'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'damp-shade'],
    resourceProfile: {
      density: 'common',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'enemy-trigger'
    },
    enemyPressureProfile: {
      daytimeTier: 2,
      nighttimeTier: 3,
      patrolAllowed: false,
      ambushAllowed: true,
      triggerIds: ['deadwood-skitter-trigger']
    },
    discoveryProfile: {
      firstVisitMessage: 'Rot is alive here.',
      inspectables: ['fallen-log', 'mushroom-cluster', 'root-hole-den', 'spore-dust'],
      unlockHints: ['Breaking deadwood can wake what lives under it.', 'Clearing disturbed creatures should make the pocket usable again.'],
      returnReasons: ['gather mushrooms', 'collect rotten wood', 'test action waves', 'learn poison and medicine later']
    },
    visibilityProfile: {
      canopyDensity: 2,
      sightPenalty: 1,
      minimapReveal: 'partial'
    },
    ambientProfile: {
      soundscape: ['damp rot creak', 'soft insect clicks', 'muffled ground movement'],
      musicMood: 'tense',
      nighttimeShift: 'Fungus and root holes should feel more active after sunset.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'Decay that is useful, alive, and risky.',
      worldLogic: 'Rotting wood, damp shade, fungus, and root hollows make a small living system under dead material.',
      resourceLogic: 'Wood, mushrooms, and damp herbs require prepared rot floor, logs, root holes, moss, and shade.',
      threatLogic: 'First action-triggered danger pocket. Gathering from the pocket can wake creatures tied to visible habitat anchors.',
      progressionUse: 'Teaches that resource choices can disturb the world and that clearing danger can reopen materials.',
      placementRules: [
        'Prepare damp/rotting ground before mushrooms or dens are placed.',
        'Every spawned creature needs a visible habitat anchor nearby.',
        'Resources can lock during the wave and unlock only after spawned enemies are dead.'
      ]
    },
    designIntent: 'The best first place for spiders/blobs because it visually supports small damp/deadwood life.'
  },
  {
    id: 'animal-trails',
    label: 'Animal Trails',
    role: 'travel-corridor',
    dangerTier: 2,
    center: { x: 2180, y: 1120 },
    radius: { x: 300, y: 160 },
    resourceKinds: ['twigs', 'food'],
    ecologyTags: ['edge-growth', 'tree-shed'],
    enemyHabitats: ['animal-trail'],
    resourceProfile: {
      density: 'sparse',
      renews: true,
      renewalRule: 'daily',
      overharvestEffect: 'none'
    },
    enemyPressureProfile: {
      daytimeTier: 2,
      nighttimeTier: 3,
      patrolAllowed: true,
      ambushAllowed: true,
      triggerIds: ['animal-trail-pressure-trigger']
    },
    discoveryProfile: {
      firstVisitMessage: 'The grass is bent by feet that are not yours.',
      inspectables: ['fresh-tracks', 'old-tracks', 'fur-tuft', 'broken-branch'],
      unlockHints: ['Tracks are information before they are resources.', 'Lingering on a trail can make the trail notice you.'],
      returnReasons: ['read tracks', 'place snares later', 'test aggro drop distance', 'study patrol movement']
    },
    visibilityProfile: {
      canopyDensity: 1,
      sightPenalty: 1,
      minimapReveal: 'partial'
    },
    ambientProfile: {
      soundscape: ['bent grass', 'distant footfall', 'quick wingbeats'],
      musicMood: 'tense',
      nighttimeShift: 'The trail becomes an enemy movement corridor at night.'
    },
    accessState: 'open',
    requiredUnlocks: [],
    poiProfile: {
      emotionalRole: 'A path that belongs to something else.',
      worldLogic: 'Repeated animal movement bends grass, leaves tracks, scatters sticks, and exposes small food traces.',
      resourceLogic: 'Tracks, small food, bones, droppings, and sticks belong along trail lines and crossings.',
      threatLogic: 'Best home for trigger zones, patrol routes, aggro drop tests, and tracking behavior.',
      progressionUse: 'Introduces reading movement, following signs, avoiding ambush, and later hunting/tracking identity.',
      placementRules: [
        'Trail resources must align to visible path direction.',
        'Use footprints, bent grass, and broken twigs before adding combat triggers.',
        'Keep enough open lane space for dodge, retreat, and enemy approach tests.'
      ]
    },
    designIntent: 'A movement corridor for first trigger zones and small enemy waves.'
  },
  {
    id: 'future-danger-gate',
    label: 'Future Danger / Exploration',
    role: 'danger-gate',
    dangerTier: 3,
    center: { x: 1400, y: 1450 },
    radius: { x: 230, y: 140 },
    resourceKinds: [],
    ecologyTags: ['damp-shade'],
    enemyHabitats: ['dense-forest-edge'],
    resourceProfile: {
      density: 'none',
      renews: false,
      renewalRule: 'none',
      overharvestEffect: 'none'
    },
    enemyPressureProfile: {
      daytimeTier: 1,
      nighttimeTier: 3,
      patrolAllowed: false,
      ambushAllowed: false,
      triggerIds: ['future-gate-warning-trigger']
    },
    discoveryProfile: {
      firstVisitMessage: 'The air feels colder near the old stones.',
      inspectables: ['cold-stone-marker', 'collapsed-entry', 'scratched-rune', 'cold-ash'],
      unlockHints: ['A stronger light may reveal the path.', 'The stones react after sunset.'],
      returnReasons: ['crafted torch', 'first night survived', 'first magic discovery', 'map transition test']
    },
    visibilityProfile: {
      canopyDensity: 2,
      sightPenalty: 2,
      minimapReveal: 'requires-scouting'
    },
    ambientProfile: {
      soundscape: ['low stone hum', 'distant hollow wind', 'absence of birds'],
      musicMood: 'mystery',
      nighttimeShift: 'Symbols and warning pressure become stronger after dark.'
    },
    accessState: 'soft-warning',
    requiredUnlocks: ['crafted-torch', 'campfire-stable', 'first-night-survived'],
    poiProfile: {
      emotionalRole: 'The world continues, but the child is not ready yet.',
      worldLogic: 'A ruin, blocked path, or darker threshold marks a boundary between Zone 1 survival and later exploration.',
      resourceLogic: 'No early resources. The value is promise, warning, and later transition control.',
      threatLogic: 'Signal danger without requiring completion now; later it can host warning enemies or a transition event.',
      progressionUse: 'Acts as future map transition foundation and emotional proof that exploration will open outward.',
      placementRules: [
        'Do not reward early players with resources here yet.',
        'Make the boundary visually readable before adding mechanical locks.',
        'Use this as a promise of future exploration, not a first-session objective.'
      ]
    },
    designIntent: 'A locked emotional promise: the world continues, but Zone 1 should not push the child here immediately.'
  }
] as const satisfies readonly ZoneOneRegion[];

export const getZoneOneRegions = (): readonly ZoneOneRegion[] => zoneOneRegions;

export const getZoneOneRegion = (id: ZoneOneRegionId): ZoneOneRegion =>
  zoneOneRegions.find((region) => region.id === id) ?? zoneOneRegions[0];

const zoneOneEnemyWaveTriggers = [
  {
    id: 'deadwood-skitter-trigger',
    label: 'Deadwood Skitter',
    regionId: 'deadwood-mushrooms',
    bounds: { x: 1955, y: 715, width: 470, height: 300 },
    enemyKinds: ['mire-spider', 'violet-moss-blob'],
    maxActive: 2,
    triggerWhen: 'gather-resource',
    designIntent: 'First real danger pocket. Small creatures should feel like they belong to damp deadwood, not as random attackers.'
  },
  {
    id: 'animal-trail-pressure-trigger',
    label: 'Animal Trail Pressure',
    regionId: 'animal-trails',
    bounds: { x: 1960, y: 1030, width: 470, height: 240 },
    enemyKinds: ['thorn-shell-mite', 'mire-spider'],
    maxActive: 2,
    triggerWhen: 'linger-in-region',
    designIntent: 'A path-pressure trigger for testing waves without spawning enemies in the safe hub.'
  },
  {
    id: 'future-gate-warning-trigger',
    label: 'Future Gate Warning',
    regionId: 'future-danger-gate',
    bounds: { x: 1250, y: 1360, width: 320, height: 220 },
    enemyKinds: ['violet-moss-blob', 'thorn-shell-mite'],
    maxActive: 3,
    triggerWhen: 'return-at-night',
    designIntent: 'A later escalation trigger that keeps early exploration open but makes deeper movement feel consequential.'
  }
] as const satisfies readonly ZoneOneEnemyWaveTrigger[];

export const getZoneOneEnemyWaveTriggers = (): readonly ZoneOneEnemyWaveTrigger[] => zoneOneEnemyWaveTriggers;

export const getZoneOneEnemyWaveTrigger = (id: ZoneOneTriggerId): ZoneOneEnemyWaveTrigger =>
  zoneOneEnemyWaveTriggers.find((trigger) => trigger.id === id) ?? zoneOneEnemyWaveTriggers[0];

const zoneOneCampSanctuary = {
  id: 'camp-sanctuary',
  label: 'Camp Sanctuary',
  center: startingAreaLayout.campCenter,
  radius: 155,
  suppressEnemySpawns: true,
  suppressHostileProjectiles: true,
  allowThreatAtNightEdge: true,
  designIntent: 'The tight home circle: safety, resting, crafting, upgrading, and learning live here before deeper exploration opens.'
} as const satisfies ZoneOneSanctuary;

export const getZoneOneCampSanctuary = (): ZoneOneSanctuary => zoneOneCampSanctuary;

const zoneOneHabitatAnchors = [
  {
    id: 'deadwood-fallen-log-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Deadwood Fallen Log',
    textureKey: assetKeys.deadwoodLogHabitat,
    x: 2135,
    y: 836,
    scale: 0.98,
    enemyKinds: ['mire-spider', 'violet-moss-blob'],
    spawnPoint: { x: 2098, y: 868 },
    designIntent: 'A readable source for damp deadwood enemies and nearby wood resources.'
  },
  {
    id: 'deadwood-mushroom-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Mushroom Moss Cluster',
    textureKey: assetKeys.mushroomHabitat,
    x: 2218,
    y: 888,
    scale: 0.66,
    enemyKinds: ['violet-moss-blob'],
    spawnPoint: { x: 2248, y: 922 },
    designIntent: 'A damp pocket source for blobs and herbs, tying danger to living ground conditions.'
  },
  {
    id: 'deadwood-root-hole-habitat',
    triggerId: 'deadwood-skitter-trigger',
    label: 'Root Hole Den',
    textureKey: assetKeys.rootHoleHabitat,
    x: 2362,
    y: 798,
    scale: 0.82,
    enemyKinds: ['mire-spider', 'thorn-shell-mite'],
    spawnPoint: { x: 2330, y: 826 },
    designIntent: 'A visible den mouth so enemies feel like they emerge from the world.'
  }
] as const satisfies readonly ZoneOneHabitatAnchor[];

export const getZoneOneHabitatAnchors = (): readonly ZoneOneHabitatAnchor[] => zoneOneHabitatAnchors;

export const getZoneOneHabitatAnchorsForTrigger = (triggerId: ZoneOneTriggerId): readonly ZoneOneHabitatAnchor[] =>
  zoneOneHabitatAnchors.filter((anchor) => anchor.triggerId === triggerId);

const zoneOnePreparedGroundPatches = [
  {
    id: 'camp-worn-fire-clearing',
    regionId: 'camp-clearing-hub',
    material: 'camp-worn-earth',
    center: { x: 1400, y: 850 },
    radius: { x: 275, y: 132 },
    opacity: 0.2,
    scatterDensity: 1,
    designIntent: 'Makes the camp read as a used survival pocket instead of normal grass.'
  },
  {
    id: 'camp-dry-grass-edge',
    regionId: 'camp-clearing-hub',
    material: 'dry-clearing-edge',
    center: { x: 1540, y: 840 },
    radius: { x: 165, y: 82 },
    opacity: 0.34,
    scatterDensity: 3,
    designIntent: 'Creates a visible sun-dried tinder edge so dry grass has an obvious home near the first fire.'
  },
  {
    id: 'herb-berry-flower-meadow',
    regionId: 'herb-berry-patch',
    material: 'flower-meadow',
    center: { x: 590, y: 450 },
    radius: { x: 245, y: 160 },
    opacity: 0.26,
    scatterDensity: 3,
    designIntent: 'Shows the herb and berry patch as low living plant density before individual resource sprites appear.'
  },
  {
    id: 'stone-outcrop-rubble-field',
    regionId: 'stone-outcrop',
    material: 'stone-rubble',
    center: { x: 470, y: 790 },
    radius: { x: 230, y: 145 },
    opacity: 0.32,
    scatterDensity: 3,
    designIntent: 'Makes the stone outcrop read as exposed rubble and hard ground instead of stones dropped on grass.'
  },
  {
    id: 'water-source-pool',
    regionId: 'water-source',
    material: 'water-body',
    center: { x: 430, y: 1240 },
    radius: { x: 285, y: 162 },
    opacity: 0.82,
    scatterDensity: 2,
    designIntent: 'Makes the water source a real visible pond instead of a dark ground patch.'
  },
  {
    id: 'water-source-reed-bend',
    regionId: 'water-source',
    material: 'reed-bank',
    center: { x: 585, y: 1168 },
    radius: { x: 132, y: 74 },
    opacity: 0.48,
    scatterDensity: 3,
    designIntent: 'Creates a readable reed bend where future reeds, fish, and water gathering can anchor.'
  },
  {
    id: 'water-source-wet-bank',
    regionId: 'water-source',
    material: 'muddy-bank',
    center: { x: 565, y: 1318 },
    radius: { x: 210, y: 84 },
    opacity: 0.34,
    scatterDensity: 2,
    designIntent: 'Shows the damp shoreline transition between usable water and clay/mud logic.'
  },
  {
    id: 'animal-trail-trampled-path',
    regionId: 'animal-trails',
    material: 'trampled-animal-trail',
    center: { x: 2180, y: 1120 },
    radius: { x: 330, y: 112 },
    opacity: 0.24,
    scatterDensity: 2,
    designIntent: 'Makes animal trails read as repeated movement through grass before enemies use the corridor.'
  },
  {
    id: 'deep-forest-leaf-floor',
    regionId: 'deep-forest',
    material: 'leaf-litter',
    center: { x: 1400, y: 390 },
    radius: { x: 310, y: 170 },
    opacity: 0.26,
    scatterDensity: 3,
    designIntent: 'Gives the deep forest a heavier old-leaf floor that can carry future stealth and tracking meaning.'
  },
  {
    id: 'clay-mud-wet-bank',
    regionId: 'clay-mud-bank',
    material: 'muddy-bank',
    center: { x: 860, y: 1285 },
    radius: { x: 205, y: 108 },
    opacity: 0.38,
    scatterDensity: 2,
    designIntent: 'Makes the clay and mud pocket visibly wet and connected to the nearby water source.'
  },
  {
    id: 'deadwood-damp-floor',
    regionId: 'deadwood-mushrooms',
    material: 'damp-deadwood-floor',
    center: { x: 2180, y: 850 },
    radius: { x: 355, y: 182 },
    opacity: 0.44,
    scatterDensity: 2,
    designIntent: 'Turns the deadwood pocket into a damp shaded floor before any object is placed.'
  },
  {
    id: 'deadwood-rot-core',
    regionId: 'deadwood-mushrooms',
    material: 'rotting-log-litter',
    center: { x: 2208, y: 868 },
    radius: { x: 245, y: 106 },
    opacity: 0.34,
    scatterDensity: 3,
    designIntent: 'Groups the log, mushrooms, and root den into one readable decay cluster.'
  },
  {
    id: 'deadwood-shade-edge',
    regionId: 'deadwood-mushrooms',
    material: 'soft-shade-edge',
    center: { x: 2300, y: 790 },
    radius: { x: 210, y: 84 },
    opacity: 0.3,
    scatterDensity: 1,
    designIntent: 'Softens the transition from grass into the den and canopy shade.'
  }
] as const satisfies readonly ZoneOnePreparedGroundPatch[];

export const getZoneOnePreparedGroundPatches = (): readonly ZoneOnePreparedGroundPatch[] => zoneOnePreparedGroundPatches;

const zoneOneLivingCues = [
  {
    id: 'water-pool-surface-ripples',
    regionId: 'water-source',
    kind: 'water-ripple',
    center: { x: 430, y: 1240 },
    radius: { x: 245, y: 118 },
    intensity: 3,
    activeWhen: 'always',
    designIntent: 'The pond surface should move subtly so the water source feels useful and alive.'
  },
  {
    id: 'water-reed-wind-sway',
    regionId: 'water-source',
    kind: 'reed-sway',
    center: { x: 585, y: 1168 },
    radius: { x: 120, y: 62 },
    intensity: 2,
    activeWhen: 'always',
    designIntent: 'Reeds should react to wind and imply future reed harvesting.'
  },
  {
    id: 'camp-dry-grass-wind',
    regionId: 'camp-clearing-hub',
    kind: 'grass-sway',
    center: { x: 1540, y: 840 },
    radius: { x: 148, y: 68 },
    intensity: 2,
    activeWhen: 'always',
    designIntent: 'The tinder patch should move lightly so dry grass is easier to notice.'
  },
  {
    id: 'herb-berry-insect-life',
    regionId: 'herb-berry-patch',
    kind: 'insect-mote',
    center: { x: 590, y: 450 },
    radius: { x: 210, y: 124 },
    intensity: 2,
    activeWhen: 'day',
    designIntent: 'The food and herb pocket should feel like a living plant patch, not only pickups.'
  },
  {
    id: 'deadwood-spore-breath',
    regionId: 'deadwood-mushrooms',
    kind: 'spore-mote',
    center: { x: 2208, y: 868 },
    radius: { x: 210, y: 86 },
    intensity: 2,
    activeWhen: 'always',
    designIntent: 'Deadwood should breathe with rot and spores before enemies are triggered.'
  },
  {
    id: 'deep-forest-leaf-drift',
    regionId: 'deep-forest',
    kind: 'leaf-drift',
    center: { x: 1400, y: 390 },
    radius: { x: 260, y: 138 },
    intensity: 2,
    activeWhen: 'always',
    designIntent: 'The deeper forest should feel older and less still than camp.'
  },
  {
    id: 'animal-trail-dust-movement',
    regionId: 'animal-trails',
    kind: 'trail-dust',
    center: { x: 2180, y: 1120 },
    radius: { x: 285, y: 92 },
    intensity: 1,
    activeWhen: 'dawn-dusk',
    designIntent: 'Animal trails should imply repeated movement even before the player sees an animal.'
  }
] as const satisfies readonly ZoneOneLivingCue[];

export const getZoneOneLivingCues = (): readonly ZoneOneLivingCue[] => zoneOneLivingCues;

export const isPointInsideZoneOneTrigger = (trigger: ZoneOneEnemyWaveTrigger, x: number, y: number): boolean =>
  x >= trigger.bounds.x &&
  x <= trigger.bounds.x + trigger.bounds.width &&
  y >= trigger.bounds.y &&
  y <= trigger.bounds.y + trigger.bounds.height;
