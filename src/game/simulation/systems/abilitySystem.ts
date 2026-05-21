import { getMeleeForwardAxis } from '../../content/meleeSeeds';
import { getPrimaryWeaponAbility, type WeaponAbilityDefinition } from '../../content/weaponAbilities';
import type { EnemyState, GameState, PlayerState } from '../state';
import { distance } from '../rules/math';
import { applyEnemyDamageResponse } from './enemySystem';

const abilityHitFlashMs = 180;

export const tryStartWeaponAbility = (state: GameState, slotIndex: number): boolean => {
  if (slotIndex !== 0) {
    return false;
  }

  const ability = getPrimaryWeaponAbility(state.equipment.mainHand);
  state.ui.selectedHotbarSlot = 0;
  state.ui.inventoryMessage = '';

  if (state.ability.cooldownMs > 0 || state.combat.phase !== 'idle') {
    state.ui.hotbarMessage = `${ability.name} is not ready.`;
    return true;
  }
  if (state.player.stamina < ability.staminaCost) {
    state.ui.hotbarMessage = 'Not enough breath.';
    return true;
  }

  state.player.stamina -= ability.staminaCost;
  state.combat.phase = 'windup';
  state.combat.timerMs = ability.windupMs;
  state.combat.cooldownMs = ability.cooldownMs;
  state.ability.activeId = ability.id;
  state.ability.linkedWeapon = ability.weapon;
  state.ability.animationKey = ability.animationKey;
  state.ability.statusTags = [...ability.statusTags];
  state.ability.damage = ability.damage;
  state.ability.staminaCost = ability.staminaCost;
  state.ability.reach = ability.reach;
  state.ability.width = ability.width;
  state.ability.cooldownMs = ability.cooldownMs;
  state.ability.cooldownDurationMs = ability.cooldownMs;
  state.ability.timerMs = ability.windupMs;
  state.ability.hasAppliedHit = false;
  state.ability.lastUsedId = ability.id;
  state.behaviorMemory.abilities.used[ability.id] += 1;
  recordAbilityEvolutionUse(state, ability);
  state.ui.hotbarMessage = `${ability.name}.`;
  return true;
};

export const updateAbility = (state: GameState, deltaMs: number): void => {
  state.ability.cooldownMs = Math.max(0, state.ability.cooldownMs - deltaMs);
  if (!state.ability.activeId) {
    return;
  }

  const ability = getPrimaryWeaponAbility(state.ability.linkedWeapon ?? state.equipment.mainHand);
  state.combat.cooldownMs = Math.max(0, state.combat.cooldownMs - deltaMs);
  state.combat.hitStopMs = Math.max(0, state.combat.hitStopMs - deltaMs);
  state.combat.lastHitFlashMs = Math.max(0, state.combat.lastHitFlashMs - deltaMs);
  state.ability.timerMs = Math.max(0, state.ability.timerMs - deltaMs);
  state.combat.timerMs = state.ability.timerMs;

  if (state.combat.phase === 'windup' && state.ability.timerMs <= 0) {
    state.combat.phase = 'active';
    state.ability.timerMs = ability.activeMs;
    state.combat.timerMs = ability.activeMs;
    applyWeaponAbilityHit(state, ability);
    return;
  }

  if (state.combat.phase === 'active' && state.ability.timerMs <= 0) {
    state.combat.phase = 'recovery';
    state.ability.timerMs = ability.recoveryMs;
    state.combat.timerMs = ability.recoveryMs;
    return;
  }

  if (state.combat.phase === 'recovery' && state.ability.timerMs <= 0) {
    clearActiveAbility(state);
  }
};

export const isWeaponAbilityActive = (state: GameState): boolean => state.ability.activeId !== undefined;

const applyWeaponAbilityHit = (state: GameState, ability: WeaponAbilityDefinition): void => {
  if (state.ability.hasAppliedHit) {
    return;
  }

  let hits = 0;
  for (const enemy of state.enemies) {
    if (enemy.health > 0 && isInsideAbilityHitShape(state.player, enemy, ability)) {
      enemy.health -= ability.damage;
      applyEnemyDamageResponse(enemy, ability.damage);
      hits += 1;
    }
  }

  state.ability.hasAppliedHit = true;
  if (hits <= 0) {
    return;
  }

  state.behaviorMemory.combat.hitsLanded += hits;
  state.behaviorMemory.creatures.wolfHits += hits;
  state.behaviorMemory.abilities.hits[ability.id] += hits;
  state.combat.hitStopMs = ability.hitStopMs;
  state.combat.lastHitFlashMs = abilityHitFlashMs;
};

const isInsideAbilityHitShape = (player: PlayerState, enemy: EnemyState, ability: WeaponAbilityDefinition): boolean => {
  const dist = distance(player.x, player.y, enemy.x, enemy.y);
  if (ability.weapon === 'bare-hands') {
    return dist < ability.reach;
  }

  const forward = getMeleeForwardAxis(player.facing);
  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  const forwardDistance = dx * forward.x + dy * forward.y;
  const sideDistance = Math.abs(dx * -forward.y + dy * forward.x);

  return forwardDistance >= -16 && forwardDistance <= ability.reach && sideDistance <= ability.width / 2;
};

const recordAbilityEvolutionUse = (state: GameState, ability: WeaponAbilityDefinition): void => {
  if (ability.evolutionTrack === 'blade') {
    state.evolution.bladeSeedAffinity += 1;
  } else if (ability.evolutionTrack === 'axe') {
    state.evolution.axeSeedAffinity += 1;
  }
};

const clearActiveAbility = (state: GameState): void => {
  state.combat.phase = 'idle';
  state.combat.timerMs = 0;
  state.ability.activeId = undefined;
  state.ability.linkedWeapon = undefined;
  state.ability.animationKey = '';
  state.ability.statusTags = [];
  state.ability.damage = 0;
  state.ability.staminaCost = 0;
  state.ability.reach = 0;
  state.ability.width = 0;
  state.ability.timerMs = 0;
  state.ability.hasAppliedHit = false;
};
