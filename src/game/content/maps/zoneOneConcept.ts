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
  role: 'hub' | 'resource-pocket' | 'path' | 'danger-gate';
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
  poiProfile: ZoneOnePoiProfile;
  designIntent: string;
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
  material: 'damp-deadwood-floor' | 'rotting-log-litter' | 'soft-shade-edge';
  center: {
    x: number;
    y: number;
  };
  radius: {
    x: number;
    y: number;
  };
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
    role: 'resource-pocket',
    dangerTier: 1,
    center: { x: 860, y: 1285 },
    radius: { x: 190, y: 120 },
    resourceKinds: ['stone'],
    ecologyTags: ['exposed-stone', 'damp-shade'],
    enemyHabitats: ['damp-shade'],
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
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 1400, y: 390 },
    radius: { x: 280, y: 180 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'dense-forest-edge'],
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
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 2180, y: 440 },
    radius: { x: 330, y: 190 },
    resourceKinds: ['wood', 'twigs', 'bark'],
    ecologyTags: ['tree-shed', 'edge-growth'],
    enemyHabitats: ['dense-forest-edge', 'deadwood'],
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
    role: 'resource-pocket',
    dangerTier: 2,
    center: { x: 2180, y: 850 },
    radius: { x: 270, y: 170 },
    resourceKinds: ['wood', 'herbs'],
    ecologyTags: ['tree-shed', 'damp-shade'],
    enemyHabitats: ['deadwood', 'damp-shade'],
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
    role: 'path',
    dangerTier: 2,
    center: { x: 2180, y: 1120 },
    radius: { x: 300, y: 160 },
    resourceKinds: ['twigs', 'food'],
    ecologyTags: ['edge-growth', 'tree-shed'],
    enemyHabitats: ['animal-trail'],
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
    id: 'deadwood-damp-floor',
    regionId: 'deadwood-mushrooms',
    material: 'damp-deadwood-floor',
    center: { x: 2180, y: 850 },
    radius: { x: 355, y: 182 },
    designIntent: 'Turns the deadwood pocket into a damp shaded floor before any object is placed.'
  },
  {
    id: 'deadwood-rot-core',
    regionId: 'deadwood-mushrooms',
    material: 'rotting-log-litter',
    center: { x: 2208, y: 868 },
    radius: { x: 245, y: 106 },
    designIntent: 'Groups the log, mushrooms, and root den into one readable decay cluster.'
  },
  {
    id: 'deadwood-shade-edge',
    regionId: 'deadwood-mushrooms',
    material: 'soft-shade-edge',
    center: { x: 2300, y: 790 },
    radius: { x: 210, y: 84 },
    designIntent: 'Softens the transition from grass into the den and canopy shade.'
  }
] as const satisfies readonly ZoneOnePreparedGroundPatch[];

export const getZoneOnePreparedGroundPatches = (): readonly ZoneOnePreparedGroundPatch[] => zoneOnePreparedGroundPatches;

export const isPointInsideZoneOneTrigger = (trigger: ZoneOneEnemyWaveTrigger, x: number, y: number): boolean =>
  x >= trigger.bounds.x &&
  x <= trigger.bounds.x + trigger.bounds.width &&
  y >= trigger.bounds.y &&
  y <= trigger.bounds.y + trigger.bounds.height;
