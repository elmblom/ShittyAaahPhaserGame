import * as utils from "../utils/utils.js"
export default class ThirdScene extends Phaser.Scene {
    constructor() {
        super("ThirdScene");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.resMult = ThirdScene.resMult

        this.add.sprite(w / 2, h / 2, "sky").setOrigin(0.5).setScale(0.7 * this.resMult);

        // Define stuff
        utils.defineStuff(this)

        // Create map, add tilesets and define layers
        utils.processLayers(this,"level2")

        // Add player
        this.player = this.physics.add.sprite(30, 200, "player");
        this.player.setSize(12, 15);
        this.player.body.setOffset(10, 12);
        this.player.anims.play("idle");
        this.physics.add.collider(this.player, this.solidLayer);
        this.player.setDepth(99)

        // Handle Layers
        utils.boxHandler(this)
        utils.bridgeHandler(this)
        utils.UDplatformHandler(this)
        utils.spinPlatformHandler(this)
        utils.crumbleHandler(this)
        utils.fruitHandler(this)
        utils.doorHandler(this)
        utils.signHandler(this, ["String1", "string2"])        
        
        // Sidewalls
        utils.addBorders(this, true, true, false, true)

        this.gameReady = true
    }

    update() {
        if (!this.gameReady) return;

        // Core update
        utils.handlePlayerMovement(this)
        utils.scoreCount(this)
        utils.doorCheck(this,"FourthScene")

        // Optional update
        utils.pushBoxes(this)
        utils.crackFall(this)
        utils.pushGroupApart(this.boxes)
        utils.playerPassthrough(this.SpinPlatforms,this.player)
        utils.playerPassthrough(this.UDplatforms,this.player)
        utils.playerPassthrough(this.bridges,this.player)
        utils.signDisplay(this)
        utils.debug(this)
        
        utils.reload(this)
    }
}
