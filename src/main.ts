import Phaser from 'phaser';
import { createGameState } from './game/simulation/state';
import { createHud } from './ui/hud';
import { BootScene } from './phaser/scenes/BootScene';
import { WorldScene } from './phaser/scenes/WorldScene';
import { viewportSize } from './game/content/maps/startingArea';
import './styles.css';

const hud = createHud(document.querySelector('#hud-root'));
const state = createGameState();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  pixelArt: true,
  backgroundColor: '#15233a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: viewportSize.width,
    height: viewportSize.height
  },
  scene: [BootScene, WorldScene]
});

game.registry.set('simulation', state);
game.registry.set('hud', hud);
