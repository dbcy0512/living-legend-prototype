import { describe, expect, it } from 'vitest';
import { idleActions } from '../src/game/input/actions';
import { startingArea } from '../src/game/content/maps/startingArea';
import {
  getCampfireCollisionObstacles,
  getPlayerCollisionRadius,
  resolveCircleObstacleCollision
} from '../src/game/simulation/rules/collision';
import { createGameState } from '../src/game/simulation/state';
import { updateSimulation } from '../src/game/simulation/systems/simulationSystem';
import { updatePlayer } from '../src/game/simulation/systems/playerSystem';

describe('player stamina and dodge', () => {
  it('spends stamina and grants brief invulnerability when dodge roll starts', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.dodge = true;

    updateSimulation(state, actions, 16);

    expect(state.combat.phase).toBe('rolling');
    expect(state.player.stamina).toBeLessThan(100);
    expect(state.player.invulnerableMs).toBeGreaterThan(0);
  });

  it('recovers stamina more slowly while dangerously cold', () => {
    const warm = createGameState();
    const cold = createGameState();
    warm.world.openingStage = 'open';
    warm.player.stamina = 20;
    cold.world.openingStage = 'cold';
    cold.world.cold = 100;
    cold.player.stamina = 20;

    updatePlayer(warm, idleActions(), 1000);
    updatePlayer(cold, idleActions(), 1000);

    expect(cold.player.stamina).toBeLessThan(warm.player.stamina);
  });

  it('blocks movement into authored tree collision', () => {
    const state = createGameState();
    const actions = idleActions();
    const obstacle = startingArea.collision.find((entry) => entry.id === 'tree-wild-1');
    if (!obstacle) {
      throw new Error('Expected tree-wild-1 collision fixture.');
    }
    actions.moveX = -1;
    state.player.x = obstacle.x + obstacle.radius + getPlayerCollisionRadius() + 2;
    state.player.y = obstacle.segmentEndY === undefined ? obstacle.y : (obstacle.y + obstacle.segmentEndY) / 2;

    updatePlayer(state, actions, 200);

    expect(state.player.x).toBeGreaterThanOrEqual(obstacle.x + obstacle.radius + getPlayerCollisionRadius());
  });

  it('slides along tree collision when moving diagonally', () => {
    const state = createGameState();
    const actions = idleActions();
    const obstacle = startingArea.collision.find((entry) => entry.id === 'tree-wild-1');
    if (!obstacle) {
      throw new Error('Expected tree-wild-1 collision fixture.');
    }
    actions.moveX = -1;
    actions.moveY = 1;
    state.player.x = obstacle.x + obstacle.radius + getPlayerCollisionRadius() + 2;
    state.player.y = obstacle.segmentEndY === undefined ? obstacle.y : (obstacle.y + obstacle.segmentEndY) / 2;

    updatePlayer(state, actions, 200);

    expect(state.player.x).toBeGreaterThan(obstacle.x + obstacle.radius + getPlayerCollisionRadius() - 10);
    expect(state.player.y).toBeGreaterThan(obstacle.segmentEndY === undefined ? obstacle.y : (obstacle.y + obstacle.segmentEndY) / 2);
  });

  it('does not let trunk collision extend downward by the trunk width', () => {
    const obstacle = startingArea.collision.find((entry) => entry.id === 'tree-zone1-shelter-1');
    if (!obstacle) {
      throw new Error('Expected tree-zone1-shelter-1 collision fixture.');
    }

    const playerRadius = getPlayerCollisionRadius();
    const tooLowForTrunk = obstacle.y + playerRadius + 2;
    const result = resolveCircleObstacleCollision(obstacle.x, tooLowForTrunk, obstacle);

    expect(result.blocked).toBe(false);
  });

  it('blocks movement into campfire collision from world state', () => {
    const state = createGameState();
    const actions = idleActions();
    actions.moveY = 1;
    const fire = state.campfires[0];
    const fireCollision = getCampfireCollisionObstacles(state.campfires)[0];
    state.player.x = fire.x;
    state.player.y = fireCollision.y - fireCollision.radius - getPlayerCollisionRadius() - 2;

    updatePlayer(state, actions, 200);

    expect(state.player.y).toBeLessThanOrEqual(fireCollision.y - fireCollision.radius - getPlayerCollisionRadius());
  });
});
