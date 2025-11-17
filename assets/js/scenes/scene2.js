import * as utils from "../utils/utils.js";
export default class SecondScene extends Phaser.Scene {
    constructor() {
        super("SecondScene");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.add
            .sprite(w / 2, h / 2, "sky")
            .setOrigin(0.5)
            .setScale(0.7);

        // Define stuff
        utils.defineStuff(this);

        // Create map, add tilesets and define layers
        utils.processLayers(this, "level1");

        // Add player
        this.player = this.physics.add.sprite(30, 375, "player");
        this.player.setSize(12, 15);
        this.player.body.setOffset(10, 12);
        this.player.anims.play("idle");
        this.physics.add.collider(this.player, this.solidLayer);
        this.player.setDepth(99);

        // Handle Layers
        utils.boxHandler(this);
        utils.bridgeHandler(this);
        utils.UDplatformHandler(this);
        utils.spinPlatformHandler(this);
        utils.crumbleHandler(this);
        utils.fruitHandler(this);
        utils.doorHandler(this);
        utils.signHandler(this, "Hello")

        // Sidewalls
        utils.addBorders(this, true, true, false, true);

        this.thisReady = true;
    }

    update() {
        if (!this.thisReady) return;

        // Core update
        utils.handlePlayerMovement(this);
        utils.scoreCount(this);
        utils.doorCheck(this, "ThirdScene");

        // Optional update
        utils.pushBoxes(this);
        utils.crackFall(this);
        utils.pushGroupApart(this.boxes);
        utils.playerPassthrough(this.SpinPlatforms, this.player);
        utils.playerPassthrough(this.UDplatforms, this.player);
        utils.playerPassthrough(this.Bridges, this.player);
        utils.debug(this)
        
        
        utils.reload(this);
    }
}
