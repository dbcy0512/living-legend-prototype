import type { ActionState } from '../../input/actions';
import { getMeleeForwardAxis, getMeleeSeedProfile, type MeleeSeedProfile } from '../../content/meleeSeeds';
import type { EnemyState, GameState, PlayerState } from '../state';
import { distance } from '../rules/math';
import { applyEnemyDamageResponse } from './enemySystem';

const hitFlashMs = 150;

export const updateCombat = (state: GameState, actions: ActionState, deltaMs: number): void => {
  if (state.world.status !== 'playing') {
    return;
  }

  const combat = state.combat;
  const player = state.player;
  const profile = getMeleeSeedProfile(state.equipment.mainHand);
  combat.hitStopMs = Math.max(0, combat.hitStopMs - deltaMs);
  combat.lastHitFlashMs = Math.max(0, combat.lastHitFlashMs - deltaMs);

  if (actions.attack && combat.phase === 'idle' && combat.cooldownMs <= 0 && player.stamina >= profile.staminaCost) {
    player.stamina -= profile.staminaCost;
    combat.phase = 'windup';
    combat.timerMs = profile.windupMs;
    combat.cooldownMs = profile.windupMs + profile.activeMs + profile.recoveryMs;
    state.behaviorMemory.combat.attacksStarted += 1;
    recordMeleeSeedAttack(state, profile);
  }

  if (combat.phase === 'idle') {
    return;
  }

  combat.timerMs -= deltaMs;
  if (combat.phase === 'windup' && combat.timerMs <= 0) {
    combat.phase = 'active';
    combat.timerMs = profile.activeMs;
    const hits = applyAttackHit(state.enemies, state.player, profile);
    if (hits > 0) {
      state.behaviorMemory.combat.hitsLanded += hits;
      state.behaviorMemory.creatures.wolfHits += hits;
      combat.hitStopMs = profile.hitStopMs;
      combat.lastHitFlashMs = hitFlashMs;
    }
  } else if (combat.phase === 'active' && combat.timerMs <= 0) {
    combat.phase = 'recovery';
    combat.timerMs = profile.recoveryMs;
  } else if ((combat.phase === 'recovery' || combat.phase === 'rolling') && combat.timerMs <= 0) {
    combat.phase = 'idle';
    combat.timerMs = 0;
  }
};

const applyAttackHit = (enemies: EnemyState[], player: PlayerState, profile: MeleeSeedProfile): number => {
  let hits = 0;
  for (const enemy of enemies) {
    if (enemy.health > 0 && isInsideMeleeSeedHitShape(player, enemy, profile)) {
      enemy.health -= profile.damage;
      applyEnemyDamageResponse(enemy, profile.damage);
      hits += 1;
    }
  }
  return hits;
};

const isInsideMeleeSeedHitShape = (player: PlayerState, enemy: EnemyState, profile: MeleeSeedProfile): boolean => {
  const dist = distance(player.x, player.y, enemy.x, enemy.y);
  if (profile.id === 'bare-hands') {
    return dist < profile.reach;
  }

  const forward = getMeleeForwardAxis(player.facing);
  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  const forwardDistance = dx * forward.x + dy * forward.y;
  const sideDistance = Math.abs(dx * -forward.y + dy * forward.x);

  return forwardDistance >= -14 && forwardDistance <= profile.reach && sideDistance <= profile.width / 2;
};

const recordMeleeSeedAttack = (state: GameState, profile: MeleeSeedProfile): void => {
  if (profile.id === 'branch-club') {
    state.behaviorMemory.combat.branchClubAttacks += 1;
    state.evolution.bladeSeedAffinity += profile.affinityGain;
  } else if (profile.id === 'stone-edge') {
    state.behaviorMemory.combat.stoneEdgeAttacks += 1;
    state.evolution.axeSeedAffinity += profile.affinityGain;
  }
};
