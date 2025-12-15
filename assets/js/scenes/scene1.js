import * as utils from "../utils/utils.js";
export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.resMult = Scene1.resMult

        this.add.sprite(w / 2, h / 2, "sky").setOrigin(0.5).setScale(0.7 * this.resMult);

        // Define stuff
        utils.defineStuff(this);

        // Create map, add tilesets and define layers
        utils.processLayers(this, "level1");

        // Add player
        utils.spawnPlayer(this, 1, 1)

        // Handle Layers
        utils.boxHandler(this);
        utils.bridgeHandler(this);
        utils.UDplatformHandler(this);
        utils.spinPlatformHandler(this);
        utils.crumbleHandler(this);
        utils.fruitHandler(this);
        utils.doorHandler(this);
        utils.signHandler(this, ["amogus"]);

        // Sidewalls
        utils.addBorders(this, true, true, false, true);

        this.thisReady = true;
    }

    update() {
        if (!this.thisReady) return;

        // Core update
        utils.handlePlayerMovement(this);
        utils.scoreCount(this);
        utils.doorCheck(this, "Scene2");

        // Optional update
        utils.pushBoxes(this);
        utils.crackFall(this);
        utils.pushGroupApart(this.boxes);
        utils.playerPassthrough(this.SpinPlatforms, this.player);
        utils.playerPassthrough(this.UDplatforms, this.player);
        utils.playerPassthrough(this.Bridges, this.player);
        utils.signDisplay(this)
        utils.debug(this)
        
        utils.reload(this);
    }
}
