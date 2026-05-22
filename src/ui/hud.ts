import type { GameState } from '../game/simulation/state';
import { getMeleeSeedProfile } from '../game/content/meleeSeeds';
import { getAvailableCraftingRecipes, getCraftingCostText } from '../game/simulation/systems/craftingSystem';
import {
  getHotbarMobilityFrame,
  getHotbarSlots,
  getHotbarWeaponFrame,
  type HotbarItemId
} from '../game/simulation/systems/hotbarSystem';
import {
  getBeginnerInventorySummary,
  getBeginnerInventorySlots,
  getFirstFirePreview
} from '../game/simulation/systems/inventorySystem';

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
    <div class="satchel" data-hud="inventoryPanel" aria-hidden="true">
      <div class="satchel__header">
        <div class="satchel__title">Satchel</div>
        <div class="satchel__status">
          <div class="satchel__mode" data-hud="inventoryMode"></div>
          <div class="satchel__capacity" data-hud="inventoryCapacity"></div>
        </div>
      </div>
      <div class="satchel__body">
        <div class="satchel__grid" data-hud="inventoryGrid"></div>
        <div class="crafting" data-hud="craftingPanel" aria-hidden="true">
          <div class="crafting__title">Making</div>
          <div class="crafting__list" data-hud="craftingList"></div>
          <div class="crafting__message" data-hud="craftingMessage"></div>
        </div>
        <div class="satchel__controls" data-hud="inventoryControls"></div>
      </div>
    </div>
    <div class="hotbar" data-hud="hotbar"></div>
    <div class="hud__hint" data-hud="hint">Move WASD/Arrows. Left mouse/J attacks, Shift mobility, E gathers, 1-4 abilities, 5 heal, 6 utility. Tab opens satchel.</div>
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
  const inventoryPanel = lookup('inventoryPanel');
  const inventoryMode = lookup('inventoryMode');
  const inventoryCapacity = lookup('inventoryCapacity');
  const inventoryGrid = lookup('inventoryGrid');
  const inventoryControls = lookup('inventoryControls');
  const craftingPanel = lookup('craftingPanel');
  const craftingList = lookup('craftingList');
  const craftingMessage = lookup('craftingMessage');
  const hotbar = lookup('hotbar');

  return {
    render: (state: GameState): void => {
      pause.classList.toggle('pause--active', state.world.paused);
      pause.setAttribute('aria-hidden', state.world.paused ? 'false' : 'true');
      const inventoryVisible = state.ui.inventoryOpen || state.ui.craftingOpen;
      inventoryPanel.classList.toggle('satchel--active', inventoryVisible);
      inventoryPanel.classList.toggle('satchel--making', state.ui.craftingOpen);
      inventoryPanel.setAttribute('aria-hidden', inventoryVisible ? 'false' : 'true');
      inventoryMode.textContent = state.ui.craftingOpen ? 'Making' : 'Inventory';
      inventoryCapacity.textContent = getInventoryCapacityText(state);
      inventoryControls.innerHTML = getInventoryControlsHtml(state);
      craftingPanel.classList.toggle('crafting--active', state.ui.craftingOpen);
      craftingPanel.setAttribute('aria-hidden', state.ui.craftingOpen ? 'false' : 'true');
      health.style.setProperty('--value', `${(state.player.health / state.player.maxHealth) * 100}%`);
      stamina.style.setProperty('--value', `${(state.player.stamina / state.player.maxStamina) * 100}%`);
      hunger.style.setProperty('--value', `${(state.player.hunger / state.player.maxHunger) * 100}%`);
      day.textContent = `${state.world.day}`;
      mood.textContent = `${Math.round(state.world.mood * 100)}%`;
      status.textContent = getStatusText(state);
      inventory.textContent = getInventoryText(state);
      combat.textContent = getCombatText(state);
      inventoryGrid.innerHTML = getInventoryPanelHtml(state);
      craftingList.innerHTML = getCraftingPanelHtml(state);
      craftingMessage.textContent = state.ui.craftMessage;
      hotbar.innerHTML = getHotbarHtml(state);
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
  const fire = state.campfires.find((campfire) => campfire.id === 'first-fire') ?? state.campfires[0];
  const fireText = fire ? ` / fire ${Math.round((fire.integrity / fire.maxIntegrity) * 100)}%` : '';
  return `${state.world.cyclePhase}${fireText}`;
};

const getInventoryText = (state: GameState): string => {
  return `Satchel ${getInventoryCapacityText(state)}`;
};

const getCombatText = (state: GameState): string => {
  const seed = getMeleeSeedProfile(state.equipment.mainHand);
  if (seed.id === 'bare-hands') {
    return state.combat.phase;
  }
  return `${state.combat.phase} / ${seed.name}`;
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

  const craftHint = state.ui.inventoryOpen
    ? state.ui.craftingOpen
      ? 'M hides making. [ ] choose. Enter makes.'
      : 'M opens making.'
    : 'Tab opens satchel.';
  return `Move WASD/Arrows. Left mouse/J attacks, Shift mobility, E gathers, 1-4 abilities, 5 heal, 6 utility. ${craftHint}`;
};

const getInventoryPanelHtml = (state: GameState): string => {
  const summary = getBeginnerInventorySummary(state);
  const slotsHtml = getBeginnerInventorySlots(state)
    .map((slot) => {
      const emptyClass = slot.empty ? 'satchel__slot--empty' : '';
      const count = slot.empty ? '' : `<strong>${slot.count}</strong>`;
      return `
        <div class="satchel__slot ${emptyClass}">
          <span>${slot.label}</span>
          ${count}
        </div>
      `;
    })
    .join('');
  const overflowHtml =
    summary.hiddenItemKinds > 0
      ? `<div class="satchel__notice">Packed: ${summary.hiddenItemKinds} more ${summary.hiddenItemKinds === 1 ? 'kind' : 'kinds'} tucked away.</div>`
      : '';
  return `${slotsHtml}${overflowHtml}`;
};

const getInventoryControlsHtml = (state: GameState): string => {
  const makingControls = state.ui.craftingOpen ? '<span>[ ] Select</span><span>Enter Make</span>' : '';
  return `<span>Tab Close</span><span>M ${state.ui.craftingOpen ? 'Inventory' : 'Making'}</span>${makingControls}`;
};

const getInventoryCapacityText = (state: GameState): string => {
  const summary = getBeginnerInventorySummary(state);
  return `${summary.occupiedSlots}/${summary.slotCount}${summary.hiddenItemKinds > 0 ? ' packed' : ''}`;
};

const getCraftingPanelHtml = (state: GameState): string =>
  getAvailableCraftingRecipes(state)
    .map(({ recipe, availability }, index) => {
      const stateClass = availability.canCraft ? 'crafting__recipe--ready' : 'crafting__recipe--blocked';
      const selectedClass = index === state.ui.selectedCraftingRecipeIndex ? 'crafting__recipe--selected' : '';
      const reason = availability.canCraft ? 'Ready' : getCraftingReasonText(availability.reason);
      return `
        <div class="crafting__recipe ${stateClass} ${selectedClass}">
          <div class="crafting__key">${index === state.ui.selectedCraftingRecipeIndex ? '>' : ''}</div>
          <div class="crafting__body">
            <div class="crafting__name">${recipe.name}</div>
            <div class="crafting__cost">${getCraftingCostText(recipe.cost)}</div>
            <div class="crafting__desc">${recipe.description}</div>
          </div>
          <div class="crafting__state">${reason}</div>
        </div>
      `;
    })
    .join('');

const getHotbarHtml = (state: GameState): string => {
  const weaponFrame = getHotbarWeaponFrame(state);
  const weaponIcon = weaponFrame.iconItemId ? getHotbarIcon(weaponFrame.iconItemId) : '';
  const weaponIconStyle = weaponIcon ? ` style="--icon: url('${weaponIcon}')"` : '';
  const weaponFrameHtml = `
    <div class="hotbar__weapon ${weaponFrame.equipped ? 'hotbar__weapon--equipped' : ''}">
      <span class="hotbar__weapon-flame"></span>
      <span class="hotbar__icon"${weaponIconStyle}></span>
      <span class="hotbar__role">WEAP</span>
    </div>
  `;
  const slotsHtml = getHotbarSlots(state)
    .map((slot) => {
      const selected = slot.index === state.ui.selectedHotbarSlot;
      const lockedClass = slot.locked ? 'hotbar__slot--locked' : '';
      const readyClass = slot.ready ? 'hotbar__slot--ready' : 'hotbar__slot--empty';
      const abilityClass = slot.abilityId ? 'hotbar__slot--ability' : '';
      const icon = slot.itemId ? getHotbarIcon(slot.itemId) : '';
      const count = slot.count > 0 ? `<span class="hotbar__count">${slot.count}</span>` : '';
      const iconStyle = icon ? ` style="--icon: url('${icon}')"` : '';
      const abilityIcon = slot.abilityId ? `<span class="hotbar__ability-icon">${slot.abilityLabel ?? ''}</span>` : '';
      const cooldown =
        slot.cooldownDurationMs > 0 && slot.cooldownMs > 0
          ? `<span class="hotbar__cooldown" style="--cooldown: ${(slot.cooldownMs / slot.cooldownDurationMs) * 100}%"></span>`
          : '';
      return `
        <div class="hotbar__slot ${lockedClass} ${readyClass} ${abilityClass}">
          <span class="hotbar__key">${slot.index + 1}</span>
          <span class="hotbar__icon"${iconStyle}></span>
          ${abilityIcon}
          <span class="hotbar__role">${slot.roleLabel}</span>
          ${cooldown}
          ${count}
          ${selected ? '<span class="hotbar__selected"></span>' : ''}
        </div>
      `;
    })
    .join('');
  const mobility = getHotbarMobilityFrame(state);
  const mobilityReadyClass = mobility.ready ? 'hotbar__mobility--ready' : 'hotbar__mobility--empty';
  const evolvedClass = mobility.evolved ? 'hotbar__mobility--evolved' : '';
  const mobilityCooldown =
    mobility.cooldownDurationMs > 0 && mobility.cooldownMs > 0
      ? `<span class="hotbar__cooldown" style="--cooldown: ${(mobility.cooldownMs / mobility.cooldownDurationMs) * 100}%"></span>`
      : '';

  const mobilityHtml = `
    <div class="hotbar__mobility ${mobilityReadyClass} ${evolvedClass}">
      <span class="hotbar__key">${mobility.keyLabel}</span>
      <span class="hotbar__mobility-icon"></span>
      <span class="hotbar__role">${mobility.roleLabel}</span>
      <span class="hotbar__mobility-cost">${mobility.staminaCost}</span>
      ${mobilityCooldown}
    </div>
  `;
  return `${weaponFrameHtml}${slotsHtml}${mobilityHtml}`;
};

const getHotbarIcon = (itemId: HotbarItemId): string => {
  switch (itemId) {
    case 'simple-poultice':
      return '/assets/crafting/simple-poultice-v1.png';
    case 'branch-club':
      return '/assets/crafting/branch-club-v1.png';
    case 'stone-edge':
      return '/assets/crafting/stone-edge-v1.png';
  }
};

const getCraftingReasonText = (reason: ReturnType<typeof getAvailableCraftingRecipes>[number]['availability']['reason']): string => {
  switch (reason) {
    case 'missing-items':
      return 'Missing';
    case 'needs-active-fire':
      return 'Needs Fire';
    case 'needs-workbench':
      return 'Needs Bench';
    case 'already-built':
      return 'Built';
    case 'satchel-full':
      return 'No Room';
    case 'unknown-recipe':
      return 'Unknown';
    case 'ready':
      return 'Ready';
  }
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
