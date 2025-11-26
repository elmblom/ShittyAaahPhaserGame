import FirstScene from './assets/js/scenes/scene1.js';
import SecondScene from './assets/js/scenes/scene2.js';
import ThirdScene from './assets/js/scenes/scene3.js';

const resMult = 1;

const config = {
    type: Phaser.AUTO,
    width: 560 * resMult,
    height: 400 * resMult,
    pixelArt: true,
    physics: { default: "arcade", arcade: { gravity: { y: 470 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [FirstScene, SecondScene, ThirdScene]
};

config.scene.forEach(scene => {
    scene.resMult = resMult;
});

const game = new Phaser.Game(config);

