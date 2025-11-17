import FirstScene from './assets/js/scenes/scene1.js';
import SecondScene from './assets/js/scenes/scene2.js';
import ThirdScene from './assets/js/scenes/scene3.js';

const config = {
    type: Phaser.AUTO,
    width: 560,
    height: 400,
    pixelArt: true,
    physics: { default: "arcade", arcade: { gravity: { y: 470 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [FirstScene, SecondScene, ThirdScene]
};

const game = new Phaser.Game(config);

