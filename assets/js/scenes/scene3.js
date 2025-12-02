import * as utils from "../utils/utils.js"
export default class Scene3 extends Phaser.Scene {
    constructor() {
        super("Scene3");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.resMult = Scene3.resMult

        this.add.sprite(w / 2, h / 2, "sky").setOrigin(0.5).setScale(0.7 * this.resMult);

        // Define stuff
        utils.defineStuff(this)

        // Create map, add tilesets and define layers
        utils.processLayers(this,"level3")

        // Add player
        utils.spawnPlayer(this, 15, 1)

        // Handle Layers
        utils.boxHandler(this)
        utils.bridgeHandler(this)
        utils.UDplatformHandler(this)
        utils.spinPlatformHandler(this)
        utils.crumbleHandler(this)
        utils.fruitHandler(this)
        utils.doorHandler(this)
        utils.signHandler(this, ["To make up for lying about the sharks, here's one big dead shark with a laser canon on its head!"])        
        
        // Sidewalls
        utils.addBorders(this, true, true, false, true)

        this.gameReady = true
    }

    update() {
        if (!this.gameReady) return;

        // Core update
        utils.handlePlayerMovement(this)
        utils.scoreCount(this)
        utils.doorCheck(this,"Scene4    ")

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
