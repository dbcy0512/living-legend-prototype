import Phaser from 'phaser';
import { animationKeys, assetKeys } from '../../game/assets/manifest';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image(assetKeys.grassBase, 'assets/environment/grass-base-v2.png');
    this.load.image(assetKeys.dirtClearing, 'assets/environment/dirt-clearing-v2.png');
    this.load.image(assetKeys.grassClearingEdge, 'assets/environment/grass-clearing-edge-v1.png');
    this.load.image(assetKeys.darkUndergrowth, 'assets/environment/dark-undergrowth-v1.png');
    this.load.image(assetKeys.resourceHerb, 'assets/environment/resource-herb-v1.png');
    this.load.image(assetKeys.resourceStone, 'assets/environment/resource-stone-v1.png');
    this.load.image(assetKeys.resourceWood, 'assets/environment/resource-wood-v1.png');
    this.load.image(assetKeys.resourceFruit, 'assets/environment/resource-fruit-v1.png');
    this.load.image(assetKeys.deadFirePit, 'assets/environment/dead-fire-pit-v1.png');
    this.load.image(assetKeys.litFirePit, 'assets/environment/lit-fire-pit-v1.png');
    this.load.image(assetKeys.leafBed, 'assets/environment/leaf-bed-v1.png');
    this.load.image(assetKeys.treeCluster, 'assets/environment/tree-cluster-v1.png');
    this.load.image(assetKeys.treeClusterAlt, 'assets/environment/tree-cluster-alt-v1.png');
    this.load.image(assetKeys.zone1TreeTrunk, 'assets/environment/zone1-tree-trunk-v1.png');
    this.load.image(assetKeys.zone1TreeRoots, 'assets/environment/zone1-tree-roots-v1.png');
    this.load.image(assetKeys.zone1TreeTrunkBody, 'assets/environment/zone1-tree-trunk-body-v1.png');
    this.load.image(assetKeys.zone1TreeCanopy, 'assets/environment/zone1-tree-canopy-v1.png');
    this.load.image(assetKeys.roundBush, 'assets/environment/round-bush-v1.png');
    this.load.image(assetKeys.grassClump, 'assets/environment/grass-clump-v1.png');
    this.load.image(assetKeys.smallTree, 'assets/environment/small-tree-v1.png');
    this.load.image(assetKeys.resourceTwigs, 'assets/environment/resource-twigs-v2.png');
    this.load.image(assetKeys.resourceDryGrass, 'assets/environment/resource-dry-grass-v2.png');
    this.load.image(assetKeys.resourceBark, 'assets/environment/resource-bark-v2.png');
    this.load.image(assetKeys.resourceStrikingStone, 'assets/environment/resource-striking-stone-v2.png');
    this.load.image(assetKeys.playerSouth, 'assets/characters/starter-child-cold-v3-south.png');
    this.load.image(assetKeys.playerNorth, 'assets/characters/starter-child-cold-v3-north.png');
    this.load.image(assetKeys.playerEast, 'assets/characters/starter-child-cold-v3-east.png');
    this.load.image(assetKeys.playerWest, 'assets/characters/starter-child-cold-v3-west.png');
    this.load.image(assetKeys.playerSouthEast, 'assets/characters/starter-child-cold-v3-south-east.png');
    this.load.image(assetKeys.playerSouthWest, 'assets/characters/starter-child-cold-v3-south-west.png');
    this.load.image(assetKeys.playerNorthEast, 'assets/characters/starter-child-cold-v3-north-east.png');
    this.load.image(assetKeys.playerNorthWest, 'assets/characters/starter-child-cold-v3-north-west.png');
    this.load.image(assetKeys.enemy, 'assets/enemies/wolf-idle-watch-game-v1.png');
    this.load.spritesheet(assetKeys.wolfIdleWatch, 'assets/enemies/wolf-idle-watch-sheet-v2.png', {
      frameWidth: 96,
      frameHeight: 96
    });
  }

  create(): void {
    this.createGeneratedTextures();
    this.createAnimations();
    this.scene.start('WorldScene');
  }

  private createAnimations(): void {
    if (this.anims.exists(animationKeys.wolfIdleWatch)) {
      return;
    }

    this.anims.create({
      key: animationKeys.wolfIdleWatch,
      frames: this.anims.generateFrameNumbers(assetKeys.wolfIdleWatch, { frames: [0, 1, 2, 1] }),
      frameRate: 4,
      repeat: -1,
      repeatDelay: 1400
    });
  }

  private createGeneratedTextures(): void {
    this.makeCircleTexture(assetKeys.shadow, 36, 0x111827, 0.34);
    this.makeHeroEquipmentTextures();
    this.makeGrassTexture();
    this.makeTreeTexture();
    this.makeFlowerTexture();
    this.makeSleepingSpotTexture();
    this.makeWorldDetailTextures();
    this.makeOpeningMaterialTextures();
    this.makeCampfireTexture();
  }

  private makeCircleTexture(key: string, size: number, color: number, alpha: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, alpha);
    graphics.fillEllipse(size / 2, size / 2, size, size * 0.45);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  private makeHeroEquipmentTextures(): void {
    const graphics = this.add.graphics();

    graphics.lineStyle(5, 0x5a341f, 1);
    graphics.lineBetween(5, 25, 24, 5);
    graphics.lineStyle(2, 0xd8a15c, 0.72);
    graphics.lineBetween(8, 22, 18, 11);
    graphics.generateTexture(assetKeys.playerHeldBranchClub, 30, 30);
    graphics.clear();

    graphics.lineStyle(4, 0x5a341f, 1);
    graphics.lineBetween(8, 24, 21, 10);
    graphics.fillStyle(0x475569, 1);
    graphics.fillTriangle(17, 4, 27, 12, 18, 17);
    graphics.lineStyle(1, 0xdaf7ff, 0.74);
    graphics.lineBetween(19, 6, 25, 11);
    graphics.generateTexture(assetKeys.playerHeldStoneEdge, 30, 30);
    graphics.destroy();
  }

  private makeEnemyTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x24102d, 1);
    graphics.fillEllipse(18, 20, 28, 18);
    graphics.fillStyle(0x7c3aed, 1);
    graphics.fillTriangle(6, 12, 12, 4, 15, 14);
    graphics.fillTriangle(30, 12, 24, 4, 21, 14);
    graphics.fillStyle(0xf9fafb, 1);
    graphics.fillCircle(12, 18, 2);
    graphics.fillCircle(24, 18, 2);
    graphics.lineStyle(2, 0xf472b6, 1);
    graphics.strokeEllipse(18, 20, 29, 19);
    graphics.generateTexture(assetKeys.enemy, 36, 32);
    graphics.destroy();
  }

  private makeGrassTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x375f45, 1);
    graphics.fillRoundedRect(0, 0, 24, 18, 3);
    graphics.fillStyle(0x8ccf69, 1);
    graphics.fillTriangle(4, 14, 8, 3, 12, 14);
    graphics.fillTriangle(12, 15, 16, 2, 20, 15);
    graphics.lineStyle(1, 0xe7f9a9, 0.8);
    graphics.lineBetween(8, 4, 7, 13);
    graphics.lineBetween(16, 3, 16, 14);
    graphics.generateTexture(assetKeys.grass, 24, 18);
    graphics.destroy();
  }

  private makeTreeTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x0f241f, 0.78);
    graphics.fillEllipse(34, 52, 56, 18);
    graphics.fillStyle(0x3b2418, 1);
    graphics.fillRoundedRect(28, 34, 11, 22, 3);
    graphics.fillStyle(0x17372f, 1);
    graphics.fillCircle(20, 30, 17);
    graphics.fillCircle(38, 26, 20);
    graphics.fillCircle(51, 38, 16);
    graphics.fillStyle(0x2f6b49, 1);
    graphics.fillCircle(24, 26, 14);
    graphics.fillCircle(41, 23, 16);
    graphics.fillCircle(49, 35, 13);
    graphics.fillStyle(0x77b765, 0.7);
    graphics.fillCircle(30, 18, 5);
    graphics.fillCircle(50, 30, 4);
    graphics.lineStyle(2, 0xd9f99d, 0.42);
    graphics.lineBetween(21, 18, 13, 32);
    graphics.lineBetween(44, 13, 53, 27);
    graphics.generateTexture('environment:cel-tree', 70, 62);
    graphics.destroy();
  }

  private makeFlowerTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x65a30d, 1);
    graphics.fillRect(7, 8, 2, 9);
    graphics.fillStyle(0xf8d16c, 1);
    graphics.fillCircle(8, 7, 5);
    graphics.fillStyle(0xfb7185, 1);
    graphics.fillCircle(8, 7, 2);
    graphics.generateTexture(assetKeys.flower, 16, 18);
    graphics.destroy();
  }

  private makeSleepingSpotTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x10211a, 0.94);
    graphics.fillEllipse(34, 26, 62, 26);
    graphics.fillStyle(0x506638, 1);
    graphics.fillEllipse(30, 23, 50, 19);
    graphics.fillStyle(0x82904b, 1);
    graphics.fillTriangle(9, 27, 22, 9, 28, 28);
    graphics.fillTriangle(24, 29, 40, 8, 45, 27);
    graphics.fillTriangle(35, 27, 57, 14, 54, 31);
    graphics.fillStyle(0xb56f4d, 1);
    graphics.fillRoundedRect(17, 19, 34, 7, 3);
    graphics.fillStyle(0x7a4533, 1);
    graphics.fillRoundedRect(24, 15, 28, 5, 2);
    graphics.lineStyle(2, 0xf2e3ad, 0.46);
    graphics.strokeEllipse(34, 24, 55, 21);
    graphics.generateTexture(assetKeys.sleepingSpot, 68, 40);
    graphics.destroy();
  }

  private makeWorldDetailTextures(): void {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x1f120d, 0.82);
    graphics.fillEllipse(32, 27, 56, 14);
    graphics.lineStyle(8, 0x51311d, 1);
    graphics.lineBetween(8, 22, 54, 10);
    graphics.lineStyle(5, 0x7a4a28, 1);
    graphics.lineBetween(16, 29, 48, 16);
    graphics.lineStyle(2, 0xe7a969, 0.72);
    graphics.lineBetween(15, 20, 28, 17);
    graphics.lineBetween(35, 18, 46, 15);
    graphics.generateTexture(assetKeys.fallenBranch, 64, 38);
    graphics.clear();

    graphics.fillStyle(0x93a5bf, 0.95);
    graphics.fillTriangle(5, 5, 33, 11, 13, 27);
    graphics.fillStyle(0xdbeafe, 0.82);
    graphics.fillTriangle(10, 8, 28, 12, 15, 22);
    graphics.lineStyle(1, 0x1e3a5f, 0.55);
    graphics.lineBetween(8, 7, 22, 24);
    graphics.lineBetween(19, 10, 14, 25);
    graphics.generateTexture(assetKeys.tornCloth, 38, 30);
    graphics.clear();

    graphics.fillStyle(0x0f1720, 0.54);
    graphics.fillEllipse(24, 12, 43, 13);
    graphics.fillStyle(0x6b7280, 0.32);
    graphics.fillEllipse(20, 10, 25, 7);
    graphics.lineStyle(1, 0xcbd5e1, 0.16);
    graphics.lineBetween(8, 10, 31, 13);
    graphics.generateTexture(assetKeys.ashMark, 48, 24);
    graphics.clear();

    graphics.fillStyle(0x0f241f, 0.24);
    graphics.fillEllipse(27, 16, 44, 14);
    graphics.fillStyle(0x6f7f43, 0.16);
    graphics.fillEllipse(24, 13, 27, 8);
    graphics.generateTexture(assetKeys.gatherPatch, 54, 28);
    graphics.clear();

    graphics.fillStyle(0x334155, 1);
    graphics.fillEllipse(12, 10, 18, 11);
    graphics.fillStyle(0x64748b, 1);
    graphics.fillEllipse(22, 13, 14, 9);
    graphics.fillStyle(0xdaf7ff, 0.46);
    graphics.fillEllipse(14, 8, 7, 3);
    graphics.generateTexture(assetKeys.trailStone, 32, 24);
    graphics.destroy();
  }

  private makeOpeningMaterialTextures(): void {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x1d120b, 0.5);
    graphics.fillEllipse(24, 28, 38, 10);
    graphics.lineStyle(5, 0x6b3f1f, 1);
    graphics.lineBetween(8, 25, 35, 12);
    graphics.lineBetween(13, 30, 40, 21);
    graphics.lineBetween(19, 23, 31, 8);
    graphics.lineStyle(2, 0xe7b86f, 0.82);
    graphics.lineBetween(10, 24, 18, 20);
    graphics.lineBetween(22, 27, 32, 24);
    graphics.generateTexture(assetKeys.resourceTwigs, 48, 36);
    graphics.clear();

    graphics.fillStyle(0x14251a, 0.48);
    graphics.fillEllipse(23, 30, 36, 9);
    graphics.fillStyle(0x6f8f3e, 1);
    graphics.fillTriangle(11, 31, 15, 8, 19, 31);
    graphics.fillTriangle(21, 32, 25, 5, 30, 32);
    graphics.fillStyle(0xd6d27a, 1);
    graphics.fillTriangle(6, 32, 10, 13, 15, 32);
    graphics.fillTriangle(28, 32, 34, 12, 39, 32);
    graphics.lineStyle(2, 0xf7f3ad, 0.82);
    graphics.lineBetween(25, 7, 25, 31);
    graphics.lineBetween(10, 15, 10, 31);
    graphics.generateTexture(assetKeys.resourceDryGrass, 46, 38);
    graphics.clear();

    graphics.fillStyle(0x1d120b, 0.42);
    graphics.fillEllipse(24, 27, 36, 9);
    graphics.fillStyle(0x4b2c1f, 1);
    graphics.fillRoundedRect(10, 9, 25, 18, 5);
    graphics.fillStyle(0x9a5a32, 1);
    graphics.fillRoundedRect(16, 7, 23, 15, 5);
    graphics.lineStyle(2, 0xe3a15c, 0.72);
    graphics.lineBetween(17, 10, 31, 21);
    graphics.lineBetween(14, 20, 37, 14);
    graphics.generateTexture(assetKeys.resourceBark, 48, 34);
    graphics.clear();

    graphics.fillStyle(0x0f1720, 0.42);
    graphics.fillEllipse(22, 27, 34, 10);
    graphics.fillStyle(0x334155, 1);
    graphics.fillCircle(20, 19, 12);
    graphics.fillStyle(0x94a3b8, 1);
    graphics.fillCircle(24, 15, 6);
    graphics.lineStyle(3, 0xdaf7ff, 0.86);
    graphics.lineBetween(10, 28, 34, 9);
    graphics.generateTexture(assetKeys.resourceStrikingStone, 44, 36);
    graphics.destroy();
  }

  private makeCampfireTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x111827, 0.88);
    graphics.fillEllipse(22, 28, 38, 13);
    graphics.lineStyle(4, 0x8b7b65, 0.75);
    graphics.strokeEllipse(22, 27, 33, 12);
    graphics.lineStyle(5, 0x4a3325, 1);
    graphics.lineBetween(9, 23, 34, 29);
    graphics.lineBetween(12, 31, 36, 21);
    graphics.fillStyle(0x9ca3af, 0.34);
    graphics.fillEllipse(22, 26, 22, 7);
    graphics.generateTexture(assetKeys.campfireDead, 44, 38);
    graphics.clear();

    graphics.fillStyle(0x2f1d16, 1);
    graphics.fillEllipse(22, 28, 38, 13);
    graphics.lineStyle(5, 0x5b3217, 1);
    graphics.lineBetween(9, 24, 34, 30);
    graphics.lineBetween(12, 31, 36, 22);
    graphics.fillStyle(0xffb84d, 1);
    graphics.fillTriangle(22, 3, 34, 28, 10, 28);
    graphics.fillStyle(0xfff3a3, 1);
    graphics.fillTriangle(22, 10, 29, 28, 15, 28);
    graphics.lineStyle(2, 0xf97316, 0.9);
    graphics.strokeTriangle(22, 3, 34, 28, 10, 28);
    graphics.generateTexture(assetKeys.campfireLit, 44, 38);
    graphics.generateTexture(assetKeys.campfire, 44, 38);
    graphics.destroy();
  }
}
