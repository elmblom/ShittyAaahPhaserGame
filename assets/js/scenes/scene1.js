import * as utils from "../utils/utils.js"
export default class FirstScene extends Phaser.Scene {
    constructor() {
        super('FirstScene');
    }

    preload() {
        // Load assets
        utils.loadAssets(this)
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        globalThis.score = 0;

        // Create animations
        this.anims.create({ key: "rotate", frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 11 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("player", { start: 16, end: 31 }), frameRate: 9, repeat: -1 });
        this.anims.create({ key: "roll", frames: this.anims.generateFrameNumbers("player", { start: 40, end: 47 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: "hit", frames: this.anims.generateFrameNumbers("player", { start: 48, end: 51 }), frameRate: 7, repeat: 0 });
        this.anims.create({ key: "death", frames: this.anims.generateFrameNumbers("player", { start: 56, end: 59 }), frameRate: 3, repeat: 0 });

        // Title / UI
        this.add.sprite(w / 2, h / 2, "sky").setScale(0.7 * FirstScene.resMult).setOrigin(0.5);
        const logo = this.add.sprite(w / 2, 150 * FirstScene.resMult, "logo").setScale(0.6 * FirstScene.resMult).setOrigin(0.5);
        const playText = this.add.text(w / 2, 290 * FirstScene.resMult, "Press Space To Start", { fontFamily: "Arial", fontSize: 28 * FirstScene.resMult, color: "#ffffff", stroke: "#000000", strokeThickness: 6 }).setOrigin(0.5);
        this.time.addEvent({ delay: 500, callback: () => playText.visible = !playText.visible, loop: true });

         this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start('SecondScene');
        });
    }
}
