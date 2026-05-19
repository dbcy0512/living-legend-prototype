import type { ActionState } from '../../input/actions';
import type { EnemyState, GameState } from '../state';
import { distance } from '../rules/math';
import { applyEnemyDamageResponse } from './enemySystem';

const attackCost = 18;
const windupMs = 105;
const activeMs = 135;
const recoveryMs = 210;
const hitFlashMs = 150;
const hitStopMs = 55;

export const updateCombat = (state: GameState, actions: ActionState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }

  const combat = state.combat;
  const player = state.player;
  combat.hitStopMs = Math.max(0, combat.hitStopMs - deltaMs);
  combat.lastHitFlashMs = Math.max(0, combat.lastHitFlashMs - deltaMs);

  if (actions.attack && combat.phase === 'idle' && combat.cooldownMs <= 0 && player.stamina >= attackCost) {
    player.stamina -= attackCost;
    combat.phase = 'windup';
    combat.timerMs = windupMs;
    combat.cooldownMs = windupMs + activeMs + recoveryMs;
    state.behaviorMemory.combat.attacksStarted += 1;
  }

  if (combat.phase === 'idle') {
    return;
  }

  combat.timerMs -= deltaMs;
  if (combat.phase === 'windup' && combat.timerMs <= 0) {
    combat.phase = 'active';
    combat.timerMs = activeMs;
    const hits = applyAttackHit(state.enemies, state.player.x, state.player.y);
    if (hits > 0) {
      state.behaviorMemory.combat.hitsLanded += hits;
      state.behaviorMemory.creatures.wolfHits += hits;
      combat.hitStopMs = hitStopMs;
      combat.lastHitFlashMs = hitFlashMs;
    }
  } else if (combat.phase === 'active' && combat.timerMs <= 0) {
    combat.phase = 'recovery';
    combat.timerMs = recoveryMs;
  } else if ((combat.phase === 'recovery' || combat.phase === 'rolling') && combat.timerMs <= 0) {
    combat.phase = 'idle';
    combat.timerMs = 0;
  }
};

const applyAttackHit = (enemies: EnemyState[], playerX: number, playerY: number): number => {
  let hits = 0;
  for (const enemy of enemies) {
    if (enemy.health > 0 && distance(playerX, playerY, enemy.x, enemy.y) < 72) {
      enemy.health -= 16;
      applyEnemyDamageResponse(enemy, 16);
      hits += 1;
    }
  }
  return hits;
};
