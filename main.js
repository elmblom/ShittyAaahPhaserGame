import Scene0 from './assets/js/scenes/scene0.js';
import Scene1 from './assets/js/scenes/scene1.js';
import Scene2 from './assets/js/scenes/scene2.js';
import Scene3 from './assets/js/scenes/scene3.js';

const resMult = 1;

const config = {
    type: Phaser.AUTO,
    width: 560 * resMult,
    height: 400 * resMult,
    pixelArt: true,
    physics: { default: "arcade", arcade: { gravity: { y: 470 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Scene0, Scene1, Scene2, Scene3]
};

config.scene.forEach(scene => {
    scene.resMult = resMult;
});

const game = new Phaser.Game(config);

