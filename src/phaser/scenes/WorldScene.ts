import Phaser from 'phaser';
import { idleActions, type ActionState } from '../../game/input/actions';
import { animationKeys, assetKeys } from '../../game/assets/manifest';
import { startingArea, viewportSize } from '../../game/content/maps/startingArea';
import { getEnvironmentAsset } from '../../game/content/environmentCatalog';
import type { CampfireState, GameState, ResourceNode } from '../../game/simulation/state';
import { isPlayerUnderThreat } from '../../game/simulation/systems/enemySystem';
import { getNearestGatherableResource } from '../../game/simulation/systems/inventorySystem';
import { updateSimulation } from '../../game/simulation/systems/simulationSystem';
import type { HudApi } from '../../ui/hud';

const groundPropDepth = 8;
const actorDepthBase = 40;
const combatFxDepth = 62;
const treeDepthBaseOffset = 12;
const playerBodyScale = 0.94;

type TreeView = {
  id: string;
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
  canopyX: number;
  canopyY: number;
  canopyRadiusX: number;
  canopyRadiusY: number;
};

type Keys = Record<
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'w'
  | 'a'
  | 's'
  | 'd'
  | 'attack'
  | 'dodge'
  | 'gather'
  | 'craft'
  | 'useFood'
  | 'restart'
  | 'pause'
  | 'inventory'
  | 'crafting'
  | 'craftNext'
  | 'craftPrevious'
  | 'craftConfirm'
  | 'hotbar1'
  | 'hotbar2'
  | 'hotbar3'
  | 'hotbar4'
  | 'hotbar5'
  | 'hotbar6'
  | 'debugCollision',
  Phaser.Input.Keyboard.Key
>;

export class WorldScene extends Phaser.Scene {
  private state!: GameState;
  private hud!: HudApi;
  private keys!: Keys;
  private player!: Phaser.GameObjects.Container;
  private sleepingSpot!: Phaser.GameObjects.Image;
  private treeViews: TreeView[] = [];
  private enemySprites = new Map<string, Phaser.GameObjects.Container>();
  private resourceSprites = new Map<string, Phaser.GameObjects.Image>();
  private resourceAmounts = new Map<string, number>();
  private campfireSprites = new Map<string, Phaser.GameObjects.Container>();
  private terrainBase!: Phaser.GameObjects.TileSprite;
  private clearingBase!: Phaser.GameObjects.TileSprite;
  private ground!: Phaser.GameObjects.Graphics;
  private skyTint!: Phaser.GameObjects.Rectangle;
  private campfireGlow!: Phaser.GameObjects.Graphics;
  private gatherPreview!: Phaser.GameObjects.Graphics;
  private dawnDuskTint!: Phaser.GameObjects.Rectangle;
  private coldTint!: Phaser.GameObjects.Rectangle;
  private threatTint!: Phaser.GameObjects.Rectangle;
  private campfireFlameFx = new Map<string, Phaser.GameObjects.Graphics>();
  private ambientFx!: Phaser.GameObjects.Graphics;
  private coldFx!: Phaser.GameObjects.Graphics;
  private threatFx!: Phaser.GameObjects.Graphics;
  private combatFx!: Phaser.GameObjects.Graphics;
  private occlusionRevealFx!: Phaser.GameObjects.Graphics;
  private collisionDebug!: Phaser.GameObjects.Graphics;
  private thoughtBubble!: Phaser.GameObjects.Container;
  private thoughtBubbleBg!: Phaser.GameObjects.Graphics;
  private thoughtBubbleText!: Phaser.GameObjects.Text;
  private lastThoughtMessage = '';
  private ecosystemDebugText!: Phaser.GameObjects.Text;
  private collisionDebugVisible = false;
  private wasPrimaryPointerDown = false;
  private pausedViewActive = false;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.state = this.registry.get('simulation') as GameState;
    this.hud = this.registry.get('hud') as HudApi;
    this.keys = this.createKeys();
    this.createWorld();
    this.createActors();
    this.cameras.main.setBounds(0, 0, startingArea.width, startingArea.height);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(180, 116);
  }

  update(_: number, delta: number): void {
    const actions = this.readActions();
    updateSimulation(this.state, actions, delta);
    this.syncPauseView();
    this.syncView();
    this.hud.render(this.state);
  }

  private syncPauseView(): void {
    if (this.state.world.paused === this.pausedViewActive) {
      return;
    }

    this.pausedViewActive = this.state.world.paused;
    if (this.pausedViewActive) {
      this.anims.pauseAll();
      this.tweens.pauseAll();
    } else {
      this.anims.resumeAll();
      this.tweens.resumeAll();
    }
  }

  private createKeys(): Keys {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is required for this prototype.');
    }
    keyboard.addCapture([Phaser.Input.Keyboard.KeyCodes.TAB]);
    return {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      attack: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      dodge: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      gather: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      craft: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      useFood: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      restart: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      pause: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
      inventory: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB),
      crafting: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
      craftNext: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET),
      craftPrevious: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET),
      craftConfirm: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      hotbar1: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      hotbar2: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      hotbar3: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      hotbar4: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
      hotbar5: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
      hotbar6: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
      debugCollision: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    };
  }

  private readActions(): ActionState {
    const actions = idleActions();
    const primaryPointerDown = this.input.activePointer.leftButtonDown();
    actions.moveX = Number(this.keys.right.isDown || this.keys.d.isDown) - Number(this.keys.left.isDown || this.keys.a.isDown);
    actions.moveY = Number(this.keys.down.isDown || this.keys.s.isDown) - Number(this.keys.up.isDown || this.keys.w.isDown);
    actions.attack = Phaser.Input.Keyboard.JustDown(this.keys.attack) || (primaryPointerDown && !this.wasPrimaryPointerDown);
    actions.dodge = Phaser.Input.Keyboard.JustDown(this.keys.dodge);
    actions.gather = Phaser.Input.Keyboard.JustDown(this.keys.gather);
    actions.craft = Phaser.Input.Keyboard.JustDown(this.keys.craft);
    actions.useFood = Phaser.Input.Keyboard.JustDown(this.keys.useFood);
    actions.restart = Phaser.Input.Keyboard.JustDown(this.keys.restart);
    actions.pause = Phaser.Input.Keyboard.JustDown(this.keys.pause);
    actions.toggleInventory = Phaser.Input.Keyboard.JustDown(this.keys.inventory);
    actions.toggleCrafting = Phaser.Input.Keyboard.JustDown(this.keys.crafting);
    actions.craftRecipeNext = Phaser.Input.Keyboard.JustDown(this.keys.craftNext);
    actions.craftRecipePrevious = Phaser.Input.Keyboard.JustDown(this.keys.craftPrevious);
    actions.craftRecipeConfirm = Phaser.Input.Keyboard.JustDown(this.keys.craftConfirm);
    actions.hotbarSlot = this.readHotbarSlotAction();
    if (Phaser.Input.Keyboard.JustDown(this.keys.debugCollision)) {
      this.collisionDebugVisible = !this.collisionDebugVisible;
    }
    this.wasPrimaryPointerDown = primaryPointerDown;
    return actions;
  }

  private readHotbarSlotAction(): ActionState['hotbarSlot'] {
    const slot =
      Phaser.Input.Keyboard.JustDown(this.keys.hotbar1)
        ? 0
        : Phaser.Input.Keyboard.JustDown(this.keys.hotbar2)
          ? 1
          : Phaser.Input.Keyboard.JustDown(this.keys.hotbar3)
            ? 2
            : Phaser.Input.Keyboard.JustDown(this.keys.hotbar4)
              ? 3
              : Phaser.Input.Keyboard.JustDown(this.keys.hotbar5)
                ? 4
                : Phaser.Input.Keyboard.JustDown(this.keys.hotbar6)
                  ? 5
                  : -1;
    if (slot < 0) {
      return undefined;
    }
    return slot;
  }

  private createWorld(): void {
    this.createTerrainBase();
    this.ground = this.add.graphics();
    this.drawGround();
    this.createLivingDetails();
    this.skyTint = this.add.rectangle(viewportSize.width / 2, viewportSize.height / 2, viewportSize.width, viewportSize.height, 0x111827, 0.08);
    this.skyTint.setScrollFactor(0);
    this.skyTint.setDepth(100);
    this.dawnDuskTint = this.add.rectangle(viewportSize.width / 2, viewportSize.height / 2, viewportSize.width, viewportSize.height, 0xf7b267, 0);
    this.dawnDuskTint.setScrollFactor(0);
    this.dawnDuskTint.setBlendMode(Phaser.BlendModes.ADD);
    this.dawnDuskTint.setDepth(101);
    this.coldTint = this.add.rectangle(viewportSize.width / 2, viewportSize.height / 2, viewportSize.width, viewportSize.height, 0x8fd3ff, 0);
    this.coldTint.setScrollFactor(0);
    this.coldTint.setBlendMode(Phaser.BlendModes.SCREEN);
    this.coldTint.setDepth(102);
    this.threatTint = this.add.rectangle(viewportSize.width / 2, viewportSize.height / 2, viewportSize.width, viewportSize.height, 0xfb7185, 0);
    this.threatTint.setScrollFactor(0);
    this.threatTint.setDepth(103);
    this.campfireGlow = this.add.graphics();
    this.campfireGlow.setDepth(9);
    this.gatherPreview = this.add.graphics();
    this.gatherPreview.setDepth(14);
    this.ambientFx = this.add.graphics();
    this.ambientFx.setDepth(12);
    this.coldFx = this.add.graphics();
    this.coldFx.setDepth(12);
    this.threatFx = this.add.graphics();
    this.threatFx.setDepth(combatFxDepth);
    this.combatFx = this.add.graphics();
    this.combatFx.setDepth(combatFxDepth);
    this.occlusionRevealFx = this.add.graphics();
    this.occlusionRevealFx.setDepth(combatFxDepth + 1);
    this.collisionDebug = this.add.graphics();
    this.collisionDebug.setDepth(90);
    this.collisionDebug.setVisible(false);
    this.ecosystemDebugText = this.add.text(18, 158, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#fff3a3',
      backgroundColor: 'rgba(10, 18, 18, 0.72)',
      padding: { x: 8, y: 6 }
    });
    this.ecosystemDebugText.setScrollFactor(0);
    this.ecosystemDebugText.setDepth(106);
    this.ecosystemDebugText.setVisible(false);
  }

  private createTerrainBase(): void {
    this.terrainBase = this.add.tileSprite(0, 0, startingArea.width, startingArea.height, assetKeys.grassBase);
    this.terrainBase.setOrigin(0);
    this.terrainBase.setDepth(-10);

    this.clearingBase = this.add.tileSprite(710, 542, 430, 172, assetKeys.dirtClearing);
    this.clearingBase.setDepth(-9);

    const clearingMaskSource = this.add.graphics();
    clearingMaskSource.setVisible(false);
    clearingMaskSource.fillStyle(0xffffff, 1);
    clearingMaskSource.fillEllipse(710, 542, 425, 166);
    this.clearingBase.setMask(clearingMaskSource.createGeometryMask());
  }

  private drawGround(): void {
    this.ground.clear();
    this.ground.fillStyle(0x16312d, 0.34);
    this.ground.fillEllipse(1080, 230, 560, 150);
    this.ground.fillStyle(0x101f22, 0.32);
    this.ground.fillEllipse(1230, 232, 390, 122);
    this.ground.fillStyle(0x33251e, 0.18);
    this.ground.fillEllipse(704, 542, 392, 160);
    this.ground.fillStyle(0x263f35, 0.26);
    this.ground.fillEllipse(1110, 742, 360, 86);
    this.ground.lineStyle(3, 0xf5efd8, 0.24);
    this.ground.lineBetween(948, 740, 1292, 766);
  }

  private createLivingDetails(): void {
    for (const treeInstance of startingArea.environment.trees) {
      const treeDepth = actorDepthBase + (treeInstance.y + treeDepthBaseOffset) * 0.001;
      const tree = treeInstance.renderMode === 'assembled'
        ? this.createAssembledTreeView(treeInstance, treeDepth)
        : this.createWholeTreeView(treeInstance, treeDepth);
      this.treeViews.push({
        id: treeInstance.id,
        sprite: tree,
        x: treeInstance.x,
        y: treeInstance.y,
        canopyX: treeInstance.x,
        canopyY: treeInstance.y + treeInstance.canopyOffsetY,
        canopyRadiusX: treeInstance.canopyRadiusX,
        canopyRadiusY: treeInstance.canopyRadiusY
      });
    }

    this.sleepingSpot = this.add.image(this.state.respawnPoint.x, this.state.respawnPoint.y, assetKeys.leafBed);
    this.sleepingSpot.setDepth(groundPropDepth);
    this.sleepingSpot.setScale(0.86);

    for (const node of this.state.resources) {
      this.resourceSprites.set(node.id, this.createResourceSprite(node));
    }
  }

  private createWholeTreeView(
    treeInstance: Extract<(typeof startingArea.environment.trees)[number], { renderMode: 'whole' }>,
    treeDepth: number
  ): Phaser.GameObjects.Image {
    const useAltTree = treeInstance.variant === 'cluster-alt';
    const asset = getEnvironmentAsset(treeInstance.assetId);
    const tree = this.add.image(treeInstance.x, treeInstance.y, asset.textureKey);
    tree.setOrigin(0.5, useAltTree ? 0.92 : 0.88);
    tree.setDepth(treeDepth);
    tree.setScale(treeInstance.scaleX, treeInstance.scaleY);
    return tree;
  }

  private createAssembledTreeView(
    treeInstance: Extract<(typeof startingArea.environment.trees)[number], { renderMode: 'assembled' }>,
    treeDepth: number
  ): Phaser.GameObjects.Image {
    const rootAsset = getEnvironmentAsset(treeInstance.rootAssetId);
    const trunkAsset = getEnvironmentAsset(treeInstance.trunkAssetId);
    const canopyAsset = getEnvironmentAsset(treeInstance.canopyAssetId);
    const roots = this.add.image(treeInstance.x, treeInstance.y, rootAsset.textureKey);
    roots.setOrigin(0.5, 0.95);
    roots.setDepth(groundPropDepth + 1);
    roots.setScale(treeInstance.scaleX, treeInstance.scaleY);

    const trunk = this.add.image(treeInstance.x, treeInstance.y, trunkAsset.textureKey);
    trunk.setOrigin(0.5, 0.95);
    trunk.setDepth(treeDepth - 0.001);
    trunk.setScale(treeInstance.scaleX, treeInstance.scaleY);

    const canopy = this.add.image(treeInstance.x, treeInstance.y + treeInstance.canopyOffsetY, canopyAsset.textureKey);
    canopy.setOrigin(0.5, 0.56);
    canopy.setDepth(treeDepth + 0.002);
    canopy.setScale(treeInstance.scaleX, treeInstance.scaleY);
    return canopy;
  }

  private createResourceSprite(node: ResourceNode): Phaser.GameObjects.Image {
    const texture = this.getResourceTexture(node);
    const sprite = this.add.image(node.x, node.y, texture);
    sprite.setScale(this.getResourceScale(node));
    sprite.setRotation(this.getResourceRotation(node));
    sprite.setDepth(groundPropDepth + 2);
    this.resourceAmounts.set(node.id, node.amount);
    return sprite;
  }

  private getResourceTexture(node: ResourceNode): string {
    if (node.id === 'striking-stone') {
      return assetKeys.resourceStrikingStone;
    }
    switch (node.kind) {
      case 'twigs':
        return assetKeys.resourceTwigs;
      case 'bark':
        return assetKeys.resourceBark;
      case 'dryGrass':
        return assetKeys.resourceDryGrass;
      case 'herbs':
        return assetKeys.resourceHerb;
      case 'stone':
        return assetKeys.resourceStone;
      case 'wood':
        return assetKeys.resourceWood;
      case 'food':
        return assetKeys.resourceFruit;
    }
  }

  private getResourceScale(node: ResourceNode): number {
    if (node.kind === 'stone') {
      return node.id === 'striking-stone' ? 0.82 : 0.78;
    }
    if (node.kind === 'dryGrass') {
      return 0.86;
    }
    if (node.kind === 'twigs' || node.kind === 'bark') {
      return 0.84;
    }
    if (node.kind === 'wood' && node.source?.type === 'tree-dependent') {
      return [0.72, 0.68, 0.76][this.getStableResourceIndex(node.id) % 3];
    }
    return 0.64;
  }

  private getResourceRotation(node: ResourceNode): number {
    if (node.source?.type !== 'tree-dependent') {
      return 0;
    }
    return Phaser.Math.DegToRad([-18, 9, 24][this.getStableResourceIndex(node.id) % 3]);
  }

  private getStableResourceIndex(id: string): number {
    let hash = 0;
    for (let index = 0; index < id.length; index += 1) {
      hash = (hash * 31 + id.charCodeAt(index)) % 9973;
    }
    return hash;
  }

  private createActors(): void {
    this.player = this.createActor(assetKeys.player, this.state.player.x, this.state.player.y);
    this.createThoughtBubble();
    for (const enemy of this.state.enemies) {
      this.enemySprites.set(enemy.id, this.createEnemyActor(enemy.x, enemy.y));
    }
  }

  private createActor(textureKey: string, x: number, y: number): Phaser.GameObjects.Container {
    const shadow = this.add.image(0, 8, assetKeys.shadow);
    shadow.setName('player-shadow');
    const body = this.add.image(0, 0, textureKey);
    body.setName('player-body');
    body.setOrigin(0.5, 0.74);
    const heldItem = this.add.image(12, 0, assetKeys.playerHeldBranchClub);
    heldItem.setName('player-held-item');
    heldItem.setVisible(false);
    const container = this.add.container(x, y, [shadow, body, heldItem]);
    container.setDepth(actorDepthBase + y * 0.001);
    return container;
  }

  private createEnemyActor(x: number, y: number): Phaser.GameObjects.Container {
    const shadow = this.add.image(0, 13, assetKeys.shadow);
    shadow.setScale(2.1, 1.05);
    const body = this.add.sprite(0, 0, assetKeys.wolfIdleWatch);
    body.setName('enemy-body');
    body.setOrigin(0.5, 0.78);
    body.play(animationKeys.wolfIdleWatch);
    const container = this.add.container(x, y, [shadow, body]);
    container.setDepth(actorDepthBase + y * 0.001);
    return container;
  }

  private syncView(): void {
    const world = this.state.world;
    const coldPressure = this.getColdPressure();
    this.player.setPosition(this.state.player.x, this.state.player.y);
    this.player.setDepth(actorDepthBase + this.state.player.y * 0.001);
    this.syncPlayerView(coldPressure);
    this.syncThoughtBubble();

    for (const enemy of this.state.enemies) {
      const sprite = this.enemySprites.get(enemy.id);
      if (!sprite) {
        continue;
      }
      sprite.setPosition(enemy.x, enemy.y);
      sprite.setDepth(actorDepthBase + enemy.y * 0.001);
      sprite.setAlpha(enemy.health > 0 ? 1 : 0.18);
      sprite.setScale(enemy.mode === 'telegraphing' || enemy.mode === 'lunging' ? 1.08 : 1);
      this.syncEnemyAnimation(sprite, enemy.mode);
    }

    for (const node of this.state.resources) {
      const sprite = this.resourceSprites.get(node.id);
      if (sprite) {
        const previousAmount = this.resourceAmounts.get(node.id) ?? node.amount;
        if (previousAmount > 0 && node.amount <= 0) {
          this.playPickupFeedback(node, sprite);
        }
        this.resourceAmounts.set(node.id, node.amount);
        sprite.setAlpha(node.amount > 0 ? 1 : 0.25);
        sprite.setScale(this.getResourceScale(node));
        sprite.setRotation(this.getResourceRotation(node));
      }
    }

    this.syncCampfires();
    this.drawGatherPreview();

    const safetyRelief = world.rawNightPressure - world.localNightPressure;
    const nightAlpha = 0.06 + world.mood * 0.32 - safetyRelief * 0.16;
    this.skyTint.setFillStyle(0x111827, nightAlpha);
    this.dawnDuskTint.setAlpha(world.dawnDuskGlow * 0.16);
    this.coldTint.setAlpha(coldPressure * 0.18);
    this.syncTreeOcclusion();
    this.drawThreatFx();
    this.drawAmbientFx();
    this.drawColdFx();
    this.drawCombatFx();
    this.drawCollisionDebug();
  }

  private createThoughtBubble(): void {
    this.thoughtBubbleBg = this.add.graphics();
    this.thoughtBubbleText = this.add.text(0, -3, '', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '13px',
      color: '#3d2818',
      align: 'center',
      wordWrap: { width: 150, useAdvancedWrap: true }
    });
    this.thoughtBubbleText.setOrigin(0.5);
    this.thoughtBubble = this.add.container(this.state.player.x, this.state.player.y - 74, [
      this.thoughtBubbleBg,
      this.thoughtBubbleText
    ]);
    this.thoughtBubble.setDepth(104);
    this.thoughtBubble.setVisible(false);
  }

  private syncThoughtBubble(): void {
    const message = this.state.ui.thoughtMessage;
    const visible = message.length > 0 && this.state.ui.thoughtTimerMs > 0;
    this.thoughtBubble.setVisible(visible);
    if (!visible) {
      this.lastThoughtMessage = '';
      return;
    }

    const lift = this.state.equipment.mainHand === 'bare-hands' ? 72 : 82;
    const bob = Math.sin(this.state.world.windPhase * 2.2) * 1.8;
    this.thoughtBubble.setPosition(this.state.player.x, this.state.player.y - lift + bob);
    this.thoughtBubble.setDepth(104);
    this.thoughtBubble.setAlpha(Math.min(1, this.state.ui.thoughtTimerMs / 220));

    if (message !== this.lastThoughtMessage) {
      this.lastThoughtMessage = message;
      this.thoughtBubbleText.setText(message);
      this.drawThoughtBubble();
    }
  }

  private drawThoughtBubble(): void {
    const width = Phaser.Math.Clamp(this.thoughtBubbleText.displayWidth + 28, 74, 178);
    const height = Phaser.Math.Clamp(this.thoughtBubbleText.displayHeight + 18, 34, 72);
    const left = -width / 2;
    const top = -height / 2;
    const right = width / 2;
    const bottom = height / 2;

    this.thoughtBubbleBg.clear();
    this.thoughtBubbleBg.fillStyle(0xf7efd8, 0.96);
    this.thoughtBubbleBg.lineStyle(2, 0x6b4426, 0.78);
    this.thoughtBubbleBg.fillRoundedRect(left, top, width, height, 12);
    this.thoughtBubbleBg.strokeRoundedRect(left, top, width, height, 12);
    this.thoughtBubbleBg.fillStyle(0xf7efd8, 0.96);
    this.thoughtBubbleBg.fillTriangle(-9, bottom - 1, 2, bottom + 12, 13, bottom - 1);
    this.thoughtBubbleBg.lineStyle(2, 0x6b4426, 0.72);
    this.thoughtBubbleBg.lineBetween(-9, bottom - 1, 2, bottom + 12);
    this.thoughtBubbleBg.lineBetween(2, bottom + 12, 13, bottom - 1);
    this.thoughtBubbleBg.lineStyle(1, 0xfffbef, 0.68);
    this.thoughtBubbleBg.lineBetween(left + 12, top + 6, right - 14, top + 6);
  }

  private syncPlayerView(coldPressure: number): void {
    const body = this.player.getByName('player-body') as Phaser.GameObjects.Image | undefined;
    const shadow = this.player.getByName('player-shadow') as Phaser.GameObjects.Image | undefined;
    const heldItem = this.player.getByName('player-held-item') as Phaser.GameObjects.Image | undefined;
    const rolling = this.state.combat.phase === 'rolling';
    const coldBody = this.isPlayerColdBody(coldPressure);

    this.player.setScale(rolling ? 0.9 : 1);
    this.player.rotation = rolling ? Math.sin(this.state.world.windPhase * 18) * 0.14 : 0;

    if (body) {
      body.setTexture(this.getPlayerTextureKey(coldBody));
      body.setScale(playerBodyScale * (1 - coldPressure * 0.07), playerBodyScale * (1 + coldPressure * 0.08));
      body.setY(coldPressure * 2);
      if (coldPressure > 0.18) {
        body.setTint(0xc7eeff);
      } else {
        body.clearTint();
      }
    }

    if (shadow) {
      shadow.setScale(1 - coldPressure * 0.12, 1);
      shadow.setAlpha(0.34 - coldPressure * 0.08);
    }

    this.syncPlayerEquipmentView(heldItem, coldPressure);
  }

  private isPlayerColdBody(coldPressure: number): boolean {
    return this.state.world.openingStage !== 'open' && coldPressure > 0.28;
  }

  private getPlayerTextureKey(coldBody: boolean): string {
    switch (this.state.player.facing) {
      case 'north':
        return coldBody ? assetKeys.playerNorth : assetKeys.playerWarmNorth;
      case 'south':
        return coldBody ? assetKeys.playerSouth : assetKeys.playerWarmSouth;
      case 'west':
        return coldBody ? assetKeys.playerWest : assetKeys.playerWarmWest;
      case 'east':
        return coldBody ? assetKeys.playerEast : assetKeys.playerWarmEast;
    }
  }

  private syncPlayerEquipmentView(heldItem: Phaser.GameObjects.Image | undefined, coldPressure: number): void {
    if (!heldItem) {
      return;
    }

    if (this.state.equipment.mainHand === 'bare-hands') {
      heldItem.setVisible(false);
      return;
    }

    heldItem.setVisible(true);
    heldItem.setTexture(
      this.state.equipment.mainHand === 'branch-club'
        ? assetKeys.playerHeldBranchClub
        : assetKeys.playerHeldStoneEdge
    );
    heldItem.setAlpha(1);
    heldItem.setScale(0.78 - coldPressure * 0.04);

    switch (this.state.player.facing) {
      case 'north':
        heldItem.setPosition(-11, 2 + coldPressure * 2);
        heldItem.setAngle(-118);
        heldItem.setDepth(-0.01);
        break;
      case 'south':
        heldItem.setPosition(12, 3 + coldPressure * 2);
        heldItem.setAngle(34);
        heldItem.setDepth(0.01);
        break;
      case 'west':
        heldItem.setPosition(-13, 1 + coldPressure * 2);
        heldItem.setAngle(-34);
        heldItem.setDepth(0.01);
        break;
      case 'east':
        heldItem.setPosition(13, 1 + coldPressure * 2);
        heldItem.setAngle(34);
        heldItem.setDepth(0.01);
        break;
    }
  }

  private syncTreeOcclusion(): void {
    this.occlusionRevealFx.clear();

    let occludingTreeCount = 0;
    const playerDepth = actorDepthBase + this.state.player.y * 0.001;
    for (const tree of this.treeViews) {
      const treeDepth = actorDepthBase + (tree.y + treeDepthBaseOffset) * 0.001;
      const dx = (this.state.player.x - tree.canopyX) / tree.canopyRadiusX;
      const dy = (this.state.player.y - tree.canopyY) / tree.canopyRadiusY;
      const insideCanopy = dx * dx + dy * dy <= 1;
      const treeDrawsOverPlayer = treeDepth > playerDepth;
      const occluding = insideCanopy && treeDrawsOverPlayer;
      tree.sprite.setAlpha(occluding ? 0.58 : 1);
      if (occluding) {
        occludingTreeCount += 1;
      }
    }

    if (occludingTreeCount <= 0) {
      return;
    }

    const pulse = 0.65 + this.state.world.lifePulse * 0.12;
    this.occlusionRevealFx.fillStyle(0xf5efd8, 0.05);
    this.occlusionRevealFx.fillEllipse(this.state.player.x, this.state.player.y - 6, 58, 68);
    this.occlusionRevealFx.lineStyle(2, 0xf5efd8, 0.34 * pulse);
    this.occlusionRevealFx.strokeEllipse(this.state.player.x, this.state.player.y - 6, 58, 68);
    this.occlusionRevealFx.lineStyle(1, 0x8fd3ff, 0.18);
    this.occlusionRevealFx.strokeEllipse(this.state.player.x, this.state.player.y - 6, 72, 82);
  }

  private syncCampfires(): void {
    for (const campfire of this.state.campfires) {
      if (!this.campfireSprites.has(campfire.id)) {
        this.campfireSprites.set(campfire.id, this.createCampfireSprite(campfire));
      }
    }

    this.campfireGlow.clear();
    for (const campfire of this.state.campfires) {
      const sprite = this.campfireSprites.get(campfire.id);
      const deadLayer = sprite?.getByName('dead-fire') as Phaser.GameObjects.Image | undefined;
      const litLayer = sprite?.getByName('lit-fire') as Phaser.GameObjects.Image | undefined;
      const shadowLayer = sprite?.getByName('campfire-shadow') as Phaser.GameObjects.Image | undefined;
      const isActive = campfire.fuelMs > 0 && campfire.integrity > 0;
      const firstFlamePulse = campfire.id === 'first-fire' && this.state.world.openingStage === 'first-flame';
      sprite?.setAlpha(1);
      sprite?.setPosition(campfire.x, campfire.y);
      sprite?.setDepth(groundPropDepth + 3);
      shadowLayer?.setVisible(campfire.id !== 'first-fire');
      deadLayer?.setVisible(!isActive);
      deadLayer?.setAlpha(1);
      litLayer?.setVisible(isActive);
      litLayer?.setAlpha(1);
      litLayer?.setScale(1);
      this.syncCampfireFlameFx(campfire, isActive, firstFlamePulse);
      if (isActive) {
        this.drawFireSparks(campfire, firstFlamePulse);
        this.drawCampfireIntegrity(campfire);
      }
    }
  }

  private drawCampfireIntegrity(campfire: CampfireState): void {
    if (campfire.integrity >= campfire.maxIntegrity) {
      return;
    }

    const integrityRatio = Phaser.Math.Clamp(campfire.integrity / campfire.maxIntegrity, 0, 1);
    const warning = integrityRatio <= 0.35;
    this.campfireGlow.lineStyle(3, warning ? 0xfb7185 : 0xffb84d, warning ? 0.72 : 0.48);
    this.campfireGlow.beginPath();
    this.campfireGlow.arc(campfire.x, campfire.y + 8, 34, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * integrityRatio), false);
    this.campfireGlow.strokePath();
  }

  private syncEnemyAnimation(sprite: Phaser.GameObjects.Container, mode: string): void {
    const body = sprite.getByName('enemy-body') as Phaser.GameObjects.Sprite | undefined;
    if (!body) {
      return;
    }

    if (mode === 'watching' && body.anims.currentAnim?.key !== animationKeys.wolfIdleWatch) {
      body.play(animationKeys.wolfIdleWatch);
      return;
    }

    if (mode !== 'watching' && body.anims.isPlaying) {
      body.stop();
      body.setFrame(0);
    }
  }

  private drawGatherPreview(): void {
    this.gatherPreview.clear();
    if (this.state.world.status !== 'playing') {
      return;
    }

    const nearest = getNearestGatherableResource(this.state);
    if (!nearest) {
      return;
    }

    const openingMaterial =
      nearest.kind === 'twigs' || nearest.kind === 'dryGrass' || nearest.kind === 'bark' || nearest.id === 'striking-stone';
    const color = openingMaterial ? 0xfff3a3 : 0x8ff7ff;
    const pulse = 0.55 + this.state.world.lifePulse * 0.25;
    this.gatherPreview.fillStyle(color, 0.08);
    this.gatherPreview.fillEllipse(nearest.x, nearest.y + 5, 54, 22);
    this.gatherPreview.lineStyle(2, color, pulse);
    this.gatherPreview.strokeEllipse(nearest.x, nearest.y + 5, 54, 22);
  }

  private drawCollisionDebug(): void {
    this.collisionDebug.clear();
    this.collisionDebug.setVisible(this.collisionDebugVisible);
    this.ecosystemDebugText.setVisible(this.collisionDebugVisible);
    if (!this.collisionDebugVisible) {
      return;
    }

    this.collisionDebug.lineStyle(2, 0x00e5ff, 0.85);
    this.collisionDebug.fillStyle(0x00e5ff, 0.12);
    for (const obstacle of startingArea.collision) {
      const endY = obstacle.segmentEndY ?? obstacle.y;
      const top = Math.min(obstacle.y, endY);
      const height = Math.abs(endY - obstacle.y);
      this.collisionDebug.fillRect(obstacle.x - obstacle.radius, top, obstacle.radius * 2, height);
      this.collisionDebug.strokeRect(obstacle.x - obstacle.radius, top, obstacle.radius * 2, height);
    }

    this.collisionDebug.lineStyle(2, 0xfff3a3, 0.85);
    this.collisionDebug.strokeCircle(this.state.player.x, this.state.player.y, 14);
    this.collisionDebug.lineStyle(2, 0xff8a3d, 0.9);
    this.collisionDebug.fillStyle(0xff8a3d, 0.12);
    for (const campfire of this.state.campfires) {
      this.collisionDebug.fillCircle(campfire.x, campfire.y + 8, 28);
      this.collisionDebug.strokeCircle(campfire.x, campfire.y + 8, 28);
    }

    this.collisionDebug.lineStyle(1, 0xb7f7c6, 0.62);
    for (const tree of this.treeViews) {
      this.collisionDebug.strokeEllipse(tree.canopyX, tree.canopyY, tree.canopyRadiusX * 2, tree.canopyRadiusY * 2);
    }

    this.collisionDebug.lineStyle(1, 0xffc15c, 0.74);
    this.collisionDebug.fillStyle(0xffc15c, 0.72);
    for (const node of this.state.resources) {
      const source = node.source;
      if (node.amount <= 0 || !source) {
        continue;
      }
      if (source.type === 'zone-dependent') {
        this.collisionDebug.fillCircle(node.x, node.y, 4);
        this.collisionDebug.strokeCircle(node.x, node.y, 10);
        continue;
      }
      const parentTree = this.treeViews.find((tree) => tree.id === source.parentId);
      if (!parentTree) {
        continue;
      }
      this.collisionDebug.lineBetween(node.x, node.y, parentTree.x, parentTree.y);
      this.collisionDebug.fillCircle(node.x, node.y, 3);
      this.collisionDebug.strokeCircle(parentTree.x, parentTree.y, 5);
    }

    this.ecosystemDebugText.setText(this.getEcosystemDebugText());
  }

  private getEcosystemDebugText(): string {
    const ecosystemResources = this.state.resources.filter((node) => node.source);
    const active = ecosystemResources.filter((node) => node.amount > 0).length;
    const depleted = ecosystemResources.length - active;
    const activeBranches = ecosystemResources.filter((node) => node.source?.type === 'tree-dependent' && node.amount > 0).length;
    const activeHerbs = ecosystemResources.filter((node) => node.source?.type === 'zone-dependent' && node.amount > 0).length;
    const ecosystem = this.state.ecosystem;
    const world = this.state.world;

    return [
      `eco seed: ${ecosystem.seed}`,
      `windfall: ${ecosystem.windfallPressure.toFixed(2)}`,
      `last regen: day ${ecosystem.lastRegenerationDay} @ ${ecosystem.lastRegenerationPressure.toFixed(2)}`,
      `eco resources: ${active} active / ${depleted} depleted`,
      `branches ${activeBranches} / herbs ${activeHerbs}`,
      `world: day ${world.day} time ${world.timeOfDay.toFixed(2)} night ${world.rawNightPressure.toFixed(2)}`
    ].join('\n');
  }

  private playPickupFeedback(node: ResourceNode, sprite: Phaser.GameObjects.Image): void {
    sprite.setAlpha(1);
    sprite.setScale(this.getResourceScale(node) * 1.18);
    this.tweens.add({
      targets: sprite,
      y: node.y - 8,
      alpha: 0.25,
      scale: this.getResourceScale(node) * 0.72,
      duration: 180,
      ease: 'Quad.easeOut',
      onComplete: () => {
        sprite.setPosition(node.x, node.y);
      }
    });

    const ring = this.add.graphics();
    ring.setDepth(combatFxDepth);
    ring.lineStyle(2, 0xfff3a3, 0.85);
    ring.strokeEllipse(node.x, node.y + 5, 24, 10);
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 220,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => {
        const value = tween.getValue() ?? 0;
        ring.clear();
        ring.lineStyle(2, 0xfff3a3, 0.85 * (1 - value));
        ring.strokeEllipse(node.x, node.y + 5, 24 + value * 34, 10 + value * 16);
      },
      onComplete: () => {
        ring.destroy();
      }
    });
  }

  private createCampfireSprite(campfire: CampfireState): Phaser.GameObjects.Container {
    const shadow = this.add.image(0, 11, assetKeys.shadow);
    shadow.setName('campfire-shadow');
    const dead = this.add.image(0, 2, campfire.id === 'first-fire' ? assetKeys.deadFirePit : assetKeys.campfireDead);
    dead.setName('dead-fire');
    const lit = this.add.image(0, 0, campfire.id === 'first-fire' ? assetKeys.litFirePit : assetKeys.campfireLit);
    lit.setName('lit-fire');
    lit.setVisible(false);
    const container = this.add.container(campfire.x, campfire.y, [shadow, dead, lit]);
    container.setDepth(groundPropDepth + 3);
    return container;
  }

  private syncCampfireFlameFx(campfire: CampfireState, isActive: boolean, firstFlamePulse: boolean): void {
    let flameFx = this.campfireFlameFx.get(campfire.id);
    if (!flameFx) {
      flameFx = this.add.graphics();
      this.campfireFlameFx.set(campfire.id, flameFx);
    }

    flameFx.clear();
    flameFx.setPosition(campfire.x, campfire.y);
    flameFx.setDepth(groundPropDepth + 4);
    flameFx.setVisible(isActive);
    if (!isActive) {
      return;
    }

    this.drawCampfireFlameFx(flameFx, firstFlamePulse);
  }

  private drawCampfireFlameFx(flameFx: Phaser.GameObjects.Graphics, firstFlamePulse: boolean): void {
    const phase = this.state.world.windPhase;
    const intensity = firstFlamePulse ? 1.18 : 1;
    const lean = Math.sin(phase * 5.4) * 2.8;
    const lift = Math.sin(phase * 8.2) * 1.6;
    const outerHeight = (28 + Math.sin(phase * 7.1) * 3.5) * intensity;
    const innerHeight = (18 + Math.cos(phase * 9.3) * 2.2) * intensity;

    flameFx.fillStyle(0xf97316, 0.52);
    flameFx.fillTriangle(-9, -8, lean, -8 - outerHeight - lift, 10, -8);
    flameFx.fillStyle(0xffb84d, 0.68);
    flameFx.fillTriangle(-6, -7, lean * 0.55, -8 - innerHeight - lift, 6, -7);
    flameFx.fillStyle(0xfff3a3, 0.78);
    flameFx.fillTriangle(-3, -6, lean * 0.35, -18 - lift, 4, -6);

    const emberAlpha = firstFlamePulse ? 0.65 : 0.45;
    for (let i = 0; i < 4; i += 1) {
      const emberPhase = phase * (3.2 + i * 0.4) + i * 1.7;
      flameFx.fillStyle(i % 2 === 0 ? 0xfff3a3 : 0xffb84d, emberAlpha * (0.45 + Math.sin(emberPhase) * 0.2));
      flameFx.fillCircle(Math.cos(emberPhase) * 9, -19 - i * 4 - Math.sin(emberPhase) * 4, 1.2);
    }
  }

  private drawFireSparks(campfire: CampfireState, firstFlamePulse: boolean): void {
    const sparkCount = firstFlamePulse ? 9 : 5;
    for (let i = 0; i < sparkCount; i += 1) {
      const phase = this.state.world.windPhase * (1.8 + i * 0.12) + i * 1.91;
      const rise = (Math.sin(phase) + 1) * (firstFlamePulse ? 13 : 8);
      const drift = Math.cos(phase * 0.8) * (firstFlamePulse ? 18 : 11);
      const alpha = firstFlamePulse ? 0.35 + this.state.world.lifePulse * 0.45 : 0.22 + this.state.world.lifePulse * 0.28;
      this.campfireGlow.fillStyle(i % 2 === 0 ? 0xfff3a3 : 0xffb84d, alpha);
      this.campfireGlow.fillCircle(campfire.x + drift, campfire.y - 8 - rise, firstFlamePulse ? 2 : 1.4);
    }
  }

  private drawAmbientFx(): void {
    const world = this.state.world;
    this.ambientFx.clear();
    const fireflyAlpha = Math.max(world.rawNightPressure, world.dawnDuskGlow * 0.7) * 0.72;
    if (fireflyAlpha <= 0.05) {
      return;
    }

    for (let i = 0; i < 22; i += 1) {
      const baseX = 80 + ((i * 137) % (startingArea.width - 160));
      const baseY = 118 + ((i * 83) % (startingArea.height - 236));
      const driftX = Math.sin(world.windPhase * 0.8 + i * 1.7) * 18;
      const driftY = Math.cos(world.windPhase * 1.1 + i * 0.9) * 10;
      const pulse = (Math.sin(world.windPhase * 3.4 + i) + 1) / 2;
      this.ambientFx.fillStyle(i % 3 === 0 ? 0x8ff7ff : 0xfff3a3, fireflyAlpha * (0.32 + pulse * 0.5));
      this.ambientFx.fillCircle(baseX + driftX, baseY + driftY, 1.5 + pulse * 1.4);
    }
  }

  private drawColdFx(): void {
    this.coldFx.clear();
    const coldPressure = this.getColdPressure();
    if (coldPressure <= 0.04) {
      return;
    }

    const player = this.state.player;
    this.coldFx.lineStyle(1, 0xc7eeff, 0.18 * coldPressure);
    for (let i = 0; i < 8; i += 1) {
      const phase = this.state.world.windPhase * 1.5 + i * 0.83;
      const x = player.x - 78 + i * 22 + Math.sin(phase) * 8;
      const y = player.y - 46 + Math.cos(phase * 0.7) * 14;
      this.coldFx.lineBetween(x, y, x + 9 + coldPressure * 8, y - 4);
    }

    const breathPulse = (Math.sin(this.state.world.windPhase * 7) + 1) / 2;
    this.coldFx.fillStyle(0xdaf7ff, (0.08 + breathPulse * 0.12) * coldPressure);
    this.coldFx.fillEllipse(player.x + 12, player.y - 9 - breathPulse * 5, 18 + breathPulse * 10, 7 + breathPulse * 4);
  }

  private drawThreatFx(): void {
    this.threatFx.clear();
    const threatened = isPlayerUnderThreat(this.state);
    this.threatTint.setAlpha(threatened ? 0.08 + this.state.world.lifePulse * 0.06 : 0);
    if (!threatened) {
      return;
    }

    const player = this.state.player;
    const pulse = 0.45 + this.state.world.lifePulse * 0.35;
    this.threatFx.lineStyle(3, 0xfb7185, pulse);
    this.threatFx.strokeEllipse(player.x, player.y + 4, 88 + this.state.world.lifePulse * 16, 46 + this.state.world.lifePulse * 8);
    this.threatFx.lineStyle(1, 0xffd1dc, 0.35);
    this.threatFx.strokeEllipse(player.x, player.y + 4, 112, 58);
  }

  private drawCombatFx(): void {
    this.combatFx.clear();
    this.drawPlayerAttackArc();
    this.drawEnemyTelegraphs();
  }

  private drawPlayerAttackArc(): void {
    const combat = this.state.combat;
    if (combat.phase !== 'windup' && combat.phase !== 'active' && combat.phase !== 'recovery') {
      return;
    }

    const player = this.state.player;
    const arc = this.getFacingArc(player.facing);
    const radius = combat.phase === 'active' ? 58 : 48;
    const alpha = combat.phase === 'active' ? 0.82 : 0.34;
    const lineWidth = combat.phase === 'active' ? 6 : 3;
    this.combatFx.lineStyle(lineWidth, combat.phase === 'active' ? 0xfff3a3 : 0x8ff7ff, alpha);
    this.combatFx.beginPath();
    this.combatFx.arc(player.x, player.y + 2, radius, arc.start, arc.end, false);
    this.combatFx.strokePath();

    if (combat.lastHitFlashMs > 0) {
      const flashAlpha = combat.lastHitFlashMs / 150;
      this.combatFx.lineStyle(4, 0xffffff, flashAlpha);
      this.combatFx.strokeCircle(player.x, player.y + 2, 66 - flashAlpha * 10);
    }
  }

  private drawEnemyTelegraphs(): void {
    for (const enemy of this.state.enemies) {
      if (enemy.health <= 0 || enemy.telegraphMs <= 0) {
        continue;
      }

      const progress = Math.min(1, enemy.telegraphMs / 260);
      this.combatFx.fillStyle(0xfb7185, 0.08 + progress * 0.16);
      this.combatFx.fillEllipse(enemy.x, enemy.y + 6, 74 + progress * 16, 34 + progress * 8);
      this.combatFx.lineStyle(2 + progress * 2, 0xfb7185, 0.38 + progress * 0.48);
      this.combatFx.strokeEllipse(enemy.x, enemy.y + 6, 74 + progress * 16, 34 + progress * 8);
    }
  }

  private getFacingArc(facing: string): { start: number; end: number } {
    switch (facing) {
      case 'north':
        return { start: Phaser.Math.DegToRad(210), end: Phaser.Math.DegToRad(330) };
      case 'south':
        return { start: Phaser.Math.DegToRad(30), end: Phaser.Math.DegToRad(150) };
      case 'west':
        return { start: Phaser.Math.DegToRad(120), end: Phaser.Math.DegToRad(240) };
      case 'east':
      default:
        return { start: Phaser.Math.DegToRad(-60), end: Phaser.Math.DegToRad(60) };
    }
  }

  private getColdPressure(): number {
    if (this.state.world.openingStage === 'open') {
      return 0;
    }
    return Phaser.Math.Clamp(this.state.world.cold / this.state.world.maxCold, 0, 1);
  }
}
