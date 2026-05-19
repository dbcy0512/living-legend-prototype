import type { GameState } from '../game/simulation/state';
import { getCampfirePlacementPreview, getFirstFirePreview } from '../game/simulation/systems/inventorySystem';

export type HudApi = {
  render: (state: GameState) => void;
};

export const createHud = (root: Element | null): HudApi => {
  if (!root) {
    throw new Error('HUD root was not found.');
  }

  root.innerHTML = `
    <div class="hud">
      <div class="hud__cluster">
        <div class="hud__bar"><div class="hud__fill hud__fill--health" data-hud="health"></div></div>
        <div class="hud__bar"><div class="hud__fill hud__fill--stamina" data-hud="stamina"></div></div>
        <div class="hud__bar"><div class="hud__fill hud__fill--hunger" data-hud="hunger"></div></div>
      </div>
      <div class="hud__panel">
        <div class="hud__line"><span>Day</span><strong data-hud="day"></strong></div>
        <div class="hud__line"><span>World Mood</span><strong data-hud="mood"></strong></div>
        <div class="hud__line"><span>Status</span><strong data-hud="status"></strong></div>
        <div class="hud__line"><span>Inventory</span><strong data-hud="inventory"></strong></div>
        <div class="hud__line"><span>Combat</span><strong data-hud="combat"></strong></div>
      </div>
    </div>
    <div class="pause" data-hud="pause" aria-hidden="true">
      <div class="pause__panel">
        <div class="pause__title">Paused</div>
        <div class="pause__line">Press P to return</div>
      </div>
    </div>
    <div class="hud__hint" data-hud="hint">Move WASD/Arrows. Left mouse/J attacks, Shift dodge rolls, E gathers, C places a campfire, F eats food.</div>
  `;

  const lookup = (key: string): HTMLElement => {
    const element = root.querySelector(`[data-hud="${key}"]`);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`HUD element missing: ${key}`);
    }
    return element;
  };

  const health = lookup('health');
  const stamina = lookup('stamina');
  const hunger = lookup('hunger');
  const day = lookup('day');
  const mood = lookup('mood');
  const status = lookup('status');
  const inventory = lookup('inventory');
  const combat = lookup('combat');
  const hint = lookup('hint');
  const pause = lookup('pause');

  return {
    render: (state: GameState): void => {
      pause.classList.toggle('pause--active', state.world.paused);
      pause.setAttribute('aria-hidden', state.world.paused ? 'false' : 'true');
      health.style.setProperty('--value', `${(state.player.health / state.player.maxHealth) * 100}%`);
      stamina.style.setProperty('--value', `${(state.player.stamina / state.player.maxStamina) * 100}%`);
      hunger.style.setProperty('--value', `${(state.player.hunger / state.player.maxHunger) * 100}%`);
      day.textContent = `${state.world.day}`;
      mood.textContent = `${Math.round(state.world.mood * 100)}%`;
      status.textContent = getStatusText(state);
      inventory.textContent = getInventoryText(state);
      combat.textContent = state.combat.phase;
      if (state.world.paused) {
        hint.textContent = 'Paused. Press P to return.';
      } else if (state.world.status === 'playing') {
        hint.textContent = getHintText(state);
      } else {
        hint.textContent = `${state.world.status === 'won' ? 'Dawn held. You survived the night.' : 'You fell to the wild pressure.'} Press R to restart.`;
      }
    }
  };
};

const getStatusText = (state: GameState): string => {
  if (state.world.status !== 'playing') {
    return state.world.status;
  }
  if (state.world.openingStage === 'cold') {
    return `cold ${Math.round(state.world.cold)}%`;
  }
  if (state.world.openingStage === 'first-flame') {
    return `warming ${Math.round(state.world.cold)}%`;
  }
  return 'playing';
};

const getInventoryText = (state: GameState): string => {
  const survival = `W${state.inventory.wood} S${state.inventory.stone} H${state.inventory.herbs} F${state.inventory.food} C${state.inventory.campfires}`;
  if (state.world.openingStage === 'open') {
    return survival;
  }
  return `Tw${state.inventory.twigs} G${state.inventory.dryGrass} B${state.inventory.bark} S${state.inventory.stone}`;
};

const getHintText = (state: GameState): string => {
  if (state.world.openingStage === 'cold') {
    const preview = getFirstFirePreview(state);
    if (state.world.openingPrompt === 'fire-dead') {
      return 'The fire is dead. It could burn again.';
    }
    if (preview.reason === 'ready') {
      return 'The dead fire still has shape. Rebuild it.';
    }
    if (state.world.openingPrompt === 'missing-materials') {
      return `It needs ${getMissingFirstFireMaterials(state)}.`;
    }
    return 'The fire is dead. It could burn again.';
  }
  if (state.world.openingStage === 'first-flame') {
    return 'The spark catches. Stay close.';
  }

  const preview = getCampfirePlacementPreview(state);
  const campfireHint =
    preview.reason === 'ready'
      ? 'C places campfire.'
      : preview.reason === 'too-close'
        ? 'Campfire spot too close.'
        : 'Need 2 wood and 1 stone.';
  return `Move WASD/Arrows. Left mouse/J attacks, Shift dodge rolls, E gathers, F eats food. ${campfireHint}`;
};

const getMissingFirstFireMaterials = (state: GameState): string => {
  const missing: string[] = [];
  if (state.inventory.twigs < 1) {
    missing.push('twigs');
  }
  if (state.inventory.dryGrass < 1) {
    missing.push('dry grass');
  }
  if (state.inventory.bark < 1) {
    missing.push('bark');
  }
  if (state.inventory.stone < 1) {
    missing.push('a striking stone');
  }
  return missing.length > 0 ? missing.join(', ') : 'nothing more';
};
