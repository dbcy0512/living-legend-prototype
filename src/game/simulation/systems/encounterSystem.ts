import {
  getZoneOneCampSanctuary,
  getZoneOneEnemyWaveTrigger,
  getZoneOneEnemyWaveTriggers,
  getZoneOneHabitatAnchorsForTrigger,
  isPointInsideZoneOneTrigger,
  type ZoneOneTriggerId
} from '../../content/maps/zoneOneConcept';
import { setPlayerThought } from '../rules/thoughts';
import { createEnemyState, type EncounterPocketState, type GameState, type ResourceNode } from '../state';

const playerPocketAggroRadius = 285;

export const updateEncounters = (state: GameState): void => {
  for (const pocket of state.encounters.pockets) {
    if (pocket.status !== 'active') {
      continue;
    }

    const activeEnemies = pocket.spawnedEnemyIds
      .map((enemyId) => state.enemies.find((enemy) => enemy.id === enemyId))
      .filter((enemy) => enemy && enemy.health > 0);

    if (activeEnemies.length > 0) {
      continue;
    }

    pocket.status = 'cleared';
    pocket.lockedResourceIds = [];
    setPlayerThought(state, 'The deadwood is still again.');
  }
};

export const tryTriggerResourcePocketWave = (state: GameState, node: ResourceNode): boolean => {
  if (state.world.openingStage !== 'open') {
    return false;
  }

  const trigger = getZoneOneEnemyWaveTriggers().find(
    (candidate) =>
      candidate.triggerWhen === 'gather-resource' &&
      isPointInsideZoneOneTrigger(candidate, node.x, node.y)
  );
  if (!trigger) {
    return false;
  }

  const pocket = getEncounterPocket(state, trigger.id);
  if (!pocket || pocket.status !== 'ready') {
    return false;
  }

  pocket.status = 'active';
  pocket.lockedResourceIds = state.resources
    .filter((resource) => resource.amount > 0 && isPointInsideZoneOneTrigger(trigger, resource.x, resource.y))
    .map((resource) => resource.id);

  const anchors = getZoneOneHabitatAnchorsForTrigger(trigger.id);
  const spawnedEnemyIds: string[] = [];
  for (let index = 0; index < trigger.maxActive; index += 1) {
    const kind = trigger.enemyKinds[index % trigger.enemyKinds.length];
    const anchor =
      anchors.find((candidate) => candidate.enemyKinds.includes(kind)) ??
      anchors[index % Math.max(anchors.length, 1)];
    const spawnPoint = anchor?.spawnPoint ?? {
      x: trigger.bounds.x + trigger.bounds.width * 0.5,
      y: trigger.bounds.y + trigger.bounds.height * 0.5
    };
    const id = `${trigger.id}-${kind}-${index + 1}`;
    if (state.enemies.some((enemy) => enemy.id === id)) {
      spawnedEnemyIds.push(id);
      continue;
    }
    const enemy = createEnemyState(kind, {
      id,
      encounterId: trigger.id,
      x: spawnPoint.x,
      y: spawnPoint.y,
      homeX: spawnPoint.x,
      homeY: spawnPoint.y,
      hunger: 52,
      fear: 12,
      aggression: 22,
      territoryPressure: 18
    });
    state.enemies.push(enemy);
    spawnedEnemyIds.push(id);
  }

  pocket.spawnedEnemyIds = spawnedEnemyIds;
  setPlayerThought(state, 'Something moved under the deadwood.');
  return true;
};

export const isResourceLockedByActiveWave = (state: GameState, node: ResourceNode): boolean =>
  state.encounters.pockets.some((pocket) => pocket.status === 'active' && pocket.lockedResourceIds.includes(node.id));

export const getEncounterPocket = (
  state: GameState,
  triggerId: ZoneOneTriggerId
): EncounterPocketState | undefined => state.encounters.pockets.find((pocket) => pocket.triggerId === triggerId);

export const getActiveEncounterForEnemy = (state: GameState, triggerId?: ZoneOneTriggerId): EncounterPocketState | undefined => {
  if (!triggerId) {
    return undefined;
  }
  const pocket = getEncounterPocket(state, triggerId);
  return pocket?.status === 'active' ? pocket : undefined;
};

export const isPlayerInsideEncounterAggro = (state: GameState, triggerId?: ZoneOneTriggerId): boolean => {
  if (!triggerId) {
    return true;
  }
  const trigger = getZoneOneEnemyWaveTrigger(triggerId);
  if (isPointInsideZoneOneTrigger(trigger, state.player.x, state.player.y)) {
    return true;
  }
  const centerX = trigger.bounds.x + trigger.bounds.width * 0.5;
  const centerY = trigger.bounds.y + trigger.bounds.height * 0.5;
  const dx = state.player.x - centerX;
  const dy = state.player.y - centerY;
  return Math.sqrt(dx * dx + dy * dy) <= playerPocketAggroRadius;
};

export const isPlayerInsideCampSanctuary = (state: GameState): boolean => {
  const sanctuary = getZoneOneCampSanctuary();
  const dx = state.player.x - sanctuary.center.x;
  const dy = state.player.y - sanctuary.center.y;
  return Math.sqrt(dx * dx + dy * dy) <= sanctuary.radius;
};
