export function playerPassthrough(group, player) {
    if (!group) return;
    const objects = Array.isArray(group) ? group : group.getChildren?.() || [];
    objects.forEach((object) => {
        const platformTop = object.y - object.displayHeight / 2;
        if (player.y > platformTop) object.body.enable = false; else object.body.enable = true;
    });
}
export function loadAssets(game) {
    game.load.image("logo", "assets/images/phaser.png");
    game.load.image("sky", "assets/images/sky.png");
    game.load.image("stage1", "assets/images/stage1.png");
    game.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 16, frameHeight: 16 });
    game.load.spritesheet("blocks", "assets/images/world_tileset.png", { frameWidth: 16, frameHeight: 16 });
    game.load.spritesheet("fruit", "assets/images/fruit.png", { frameWidth: 16, frameHeight: 16 });
    game.load.spritesheet("platforms", "assets/images/platforms.png", { frameWidth: 16, frameHeight: 16 });
    game.load.spritesheet("door", "assets/images/door.png", { frameWidth: 16, frameHeight: 32 });
    ["level1", "level2", "level3"].forEach(level => {
        game.load.tilemapTiledJSON(level, `assets/levels/${level}.json`);
    });
    game.load.spritesheet("player", "assets/images/knight.png", { frameWidth: 32, frameHeight: 32 });
}
export function reload(game) {
    loadAssets(game)
    if (game.keys.R.isDown) game.scene.restart();
}
export function pushGroupApart(group, pushStrength = 1) {
    for (let i = 0; i < group.length - 1; i++) {
        for (let j = i + 1; j < group.length; j++) {
            pushApart(group[i], group[j], pushStrength);
        }
    }
}
export function pushApart(objA, objB, pushStrength = 1) {
    const dx = objB.x - objA.x;
    const dy = objB.y - objA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = (objA.displayWidth + objB.displayWidth) / 2;

    if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) * 0.5 * pushStrength;
        const nx = dx / dist;
        const ny = dy / dist;

        objA.x -= nx * overlap;
        objB.x += nx * overlap;
    }
}
export function scoreCount(game) {
    if (globalThis.score) {
        if (globalThis.score != game.lastscore) {
            globalThis.scoreText.setText(`Score: ${globalThis.score.toString().padStart(6, '0')}`);
            game.tweens.addCounter({
                from: 0, to: 100, duration: 50,
                onUpdate: (t) => {
                    const value = Math.floor(t.getValue());
                    globalThis.scoreText.setColor(`rgb(255, ${255 - value * 2}, 0)`);
                },
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    globalThis.scoreText.setColor("#ffffff");
                }
            });
            game.lastscore = globalThis.score
        }
    }
}
export function crackFall(game) {
    game.CrackForms.forEach(crack => {
        if (crack.falling) return;
        if (game.player.body.touching.down && crack.body.touching.up) {
            crack.falling = true;
            game.time.delayedCall(150, () => {
                crack.body.setAllowGravity(true);
                crack.setVelocityY(100);
                game.time.delayedCall(10000, () => {
                    crack.body.setAllowGravity(false);
                    crack.setVelocityY(0);
                    crack.setPosition(crack.originalPos.x, crack.originalPos.y);
                    crack.falling = false;
                });
            });
        }
    });
}
export function pushBoxes(game) {
    game.boxes.forEach(box => {
        if (box.body.touching.left) {
            if (game.player.anims.currentAnim?.key == "roll") {
                box.setVelocityX(60)
            } else {
                box.setVelocityX(40)
            }
        } else if (box.body.touching.right) {
            if (game.player.anims.currentAnim?.key == "roll") {
                box.setVelocityX(-60)
            } else {
                box.setVelocityX(-40)
            }
        } else box.setVelocityX(Math.max(box.body.velocity.x - 5, 0));
        if (box.body.touching.bottom) {
            box.setVelocityY(0)
        }
    });
}
export function handlePlayerMovement(game) {
    const playerTile = game.waterLayer.getTileAtWorldXY(game.player.x, game.player.y);
    if (game.cursors.left.isDown || game.keys.A.isDown) {
        game.player.setVelocityX(-210);
        if (game.player.anims.currentAnim?.key !== "roll") game.player.anims.play("run", true), game.player.setVelocityX(-160);
        game.player.setFlipX(true);
    } else if (game.cursors.right.isDown || game.keys.D.isDown) {
        game.player.setVelocityX(210);
        if (game.player.anims.currentAnim?.key !== "roll") game.player.anims.play("run", true), game.player.setVelocityX(160);
        game.player.setFlipX(false);
    } else {
        game.player.setVelocityX(0);
        if (game.player.anims.currentAnim?.key !== "roll") game.player.anims.play("idle", true);
    }

    if ((game.cursors.up.isDown || game.keys.W.isDown || game.keys.SPACE.isDown) && game.player.body.blocked.down) {
        game.player.setVelocityY(-190)
    } else if (game.cursors.up.isDown && playerTile && game.player.waterTime > 13) {
        game.player.setVelocityY(-190)
    }

    if ((game.cursors.down.isDown || game.keys.S.isDown) && game.player.body.blocked.down) {
        if (!game.lastRollTime || (game.time.now - game.lastRollTime > 800 && !game.isRolling)) {
            game.lastRollTime = game.time.now;
            game.isRolling = true;
            game.player.anims.play("roll", true).once("animationcomplete", () => {
                game.player.anims.play("idle");
                game.isRolling = false;
            });
        }
    }

    if (game.keys.K.isDown && game.debug == true) game.player.setVelocityY(-150);

    if (game.waterLayer) {
        if (playerTile) {
            if (game.player.body.velocity.x > 50) game.player.body.setVelocityX(50);
            if (game.player.body.velocity.x < -50) game.player.body.setVelocityX(-50);
            if (game.player.body.velocity.y > 100) game.player.body.setVelocityY(100);
            if (game.player.body.velocity.y < -100) game.player.body.setVelocityY(-100);
            game.player.waterTime++;
        } else {
            game.player.waterTime = 0;
        }
    }
}
export function processLayers(game, levelKey) {
    const map = game.make.tilemap({
        key: levelKey,
        tileWidth: 16,
        tileHeight: 16,
    });
    const tilesetBlocks = map.addTilesetImage("blocks", "blocks");
    const tilesetPlatforms = map.addTilesetImage("platforms", "platforms");
    const tilesetFruit = map.addTilesetImage("fruit", "fruit");
    const tilesetDoor = map.addTilesetImage("door", "door")
    const layers = [];

    Array.from({ length: 11 }).forEach((_, i) => {
        layers[i] = map.createLayer(
            i,
            [tilesetBlocks, tilesetPlatforms, tilesetFruit, tilesetDoor],
            0,
            0
        );
    });

    if (game.resMult && game.resMult !== 1) {
        if (game.cameras && game.cameras.main && typeof game.cameras.main.setZoom === 'function') {
            game.cameras.main.setZoom(game.resMult);
            if (typeof map.widthInPixels === 'number' && typeof map.heightInPixels === 'number') {
                game.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            }
        }
        if (game.physics && game.physics.world && typeof game.physics.world.setBounds === 'function') {
            if (typeof map.widthInPixels === 'number' && typeof map.heightInPixels === 'number') {
                game.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            }
        }
    }

    layers.forEach((layer) => {
        if (!layer) return;
        layer.setCollisionByExclusion([-1]);
        if (layer.layer.name === "Solid") {
            game.solidLayer = layer;
            layer.setDepth(101);
        }
        else if (layer.layer.name === "Box") game.boxLayer = layer;
        else if (layer.layer.name === "Bridge") game.bridgeLayer = layer;
        else if (layer.layer.name === "UDplatform") game.UDplatformLayer = layer;
        else if (layer.layer.name === "SpinPlatform") game.SpinPlatformLayer = layer;
        else if (layer.layer.name === "Crumble") game.crumbleLayer = layer;
        else if (layer.layer.name === "Fruit") game.fruitLayer = layer;
        else if (layer.layer.name === "Door") game.doorLayer = layer;
        else if (layer.layer.name === "Water") {
            game.waterLayer = layer;
            layer.setDepth(100);
        }
        else if (layer.layer.name === "Signs") game.signLayer = layer;
    });
}
export function boxHandler(game) {
    if (!game.boxLayer) return;
    game.boxLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const box = game.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            "blocks",
            55
        );
        game.boxLayer.removeTileAt(tile.x, tile.y);
        box.setImmovable(true).setCollideWorldBounds(true).setGravity(0);
        game.physics.add.collider(game.player, box);
        game.physics.add.collider(box, game.solidLayer);
        game.boxes.push(box);
    });

    game.boxes.forEach((box, index) => {
        game.boxes.forEach((otherBox, otherIndex) => {
            if (index === otherIndex) return;
            game.physics.add.collider(box, otherBox);
        });
    });
}
export function doorHandler(game) {
    if (!game.doorLayer) return;
    game.doorLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();

        let frame;
        if (tile.index === 285) frame = 0;
        else return;

        const door = game.physics.add.image(worldX, worldY-16, "door", frame);
        game.doorLayer.removeTileAt(tile.x, tile.y);
        door.setImmovable(true);
        door.body.setAllowGravity(false);
        game.physics.add.overlap(game.player, door);
        game.Doors.push(door);
    });
}
export function doorCheck(game, scene) {
    if (game.physics.overlap(game.player, game.Doors) && game.cursors.down.isDown) {
        game.scene.start(scene);
    }
}
export function bridgeHandler(game) {
    if (!game.bridgeLayer) return;
    game.bridgeLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();

        let frame;
        if (tile.index === 10) frame = 9;
        else if (tile.index === 11) frame = 10;
        else if (tile.index === 12) frame = 11;
        else return;

        const bridge = game.physics.add.image(worldX, worldY, "blocks", frame);
        game.bridgeLayer.removeTileAt(tile.x, tile.y);
        bridge.setSize(bridge.width, 7);
        bridge.body.setOffset(0, 1);
        bridge.setImmovable(true);
        bridge.body.setAllowGravity(false);
        game.physics.add.collider(game.player, bridge);
        game.Bridges.push(bridge);
    });
}
export function UDplatformHandler(game) {
    if (!game.UDplatformLayer) return;
    game.UDplatformLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const frame = tile.index === 258 ? 1 : 2;
        const p = game.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            "platforms",
            frame
        );
        game.UDplatformLayer.removeTileAt(tile.x, tile.y);
        p.setSize(p.width, 8)
        p.body.setOffset(0, 0)
        p.setImmovable(true).body.setAllowGravity(false);
        game.UDplatforms.push(p);
    });

    game.UDplatforms.forEach((platform) => {
        game.tweens.add({
            targets: platform,
            y: platform.y + 70,
            duration: 4400,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });
        platform.collider = game.physics.add.collider(game.player, platform);
    });
}
export function spinPlatformHandler(game) {
    if (!game.SpinPlatformLayer) return;
    game.SpinPlatformLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const p = game.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            "platforms",
            0
        );
        game.SpinPlatformLayer.removeTileAt(tile.x, tile.y);
        p.setSize(p.width, 8)
        p.body.setOffset(0, 0)
        p.setImmovable(true).body.setAllowGravity(false);
        p.xStart = p.x;
        p.yStart = p.y - 50;
        game.SpinPlatforms.push(p);
    });

    game.SpinPlatforms.forEach((platform) => {
        platform.tween = game.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 7000,
            repeat: -1,
            onUpdate: (t) => {
                const a = Phaser.Math.DegToRad(t.getValue());
                const r = 50;
                const prevX = platform.x,
                    prevY = platform.y;
                platform.x = platform.xStart + Math.cos(a) * r;
                platform.y = platform.yStart + Math.sin(a) * r;
                if (game.player.body.touching.down && platform.body.touching.up) {
                    game.player.x += platform.x - prevX;
                    game.player.y += platform.y - prevY;
                }
            },
        });
        platform.collider = game.physics.add.collider(game.player, platform);
    });
}
export function signHandler(game, textsArray) {
            if (!game.signLayer) return;
            game.signLayer.forEachTile((tile) => {
                if (tile.index === -1) return;
                const p = game.physics.add.image(
                    tile.getCenterX(),
                    tile.getCenterY(),
                    "blocks",
                    tile.index-1
                );
                game.signLayer.removeTileAt(tile.x, tile.y);
                p.setImmovable(true).body.setAllowGravity(false);
                p.text = textsArray[game.signCount];
                game.signCount+=1;
                game.Signs.push(p);
                p.textBox = game.add.text(p.x, p.y - 30, p.text, {
                    fontFamily: "Font1",
                    fontSize: 10,
                    color: "#2e2b2bff",
                    stroke: "#dad8d8ff",
                    strokeThickness: 3,
                    wordWrap: { width: 160 },
                    alpha: 0
                }).setOrigin(0.5);
                if (p.textBox.x < p.textBox.width / 2 + 5) {
                    p.textBox.x = p.textBox.width / 2 + 5;
                } else if (p.textBox.x > game.scale.width - p.textBox.width / 2 - 5) {
                    p.textBox.x = game.scale.width - p.textBox.width / 2 - 5;
                }
                p.textBox.setAlpha(0)
                p.textBox.Text = p.text
                p.textBox.initialY = p.y - 40
            });
        }
export function crumbleHandler(game) {
    if (!game.crumbleLayer) return;
    game.crumbleLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        const crack = game.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            "blocks",
            1
        );
        game.crumbleLayer.removeTileAt(tile.x, tile.y);
        crack.setImmovable(true).body.setAllowGravity(false);
        crack.originalPos = { x: crack.x, y: crack.y };
        crack.falling = false;
        game.physics.add.collider(game.player, crack);
        game.CrackForms.push(crack);
    });
}
export function fruitHandler(game) {
    if (!game.fruitLayer) return;
    game.fruitLayer.forEachTile((tile) => {
        if (tile.index === -1) return;
        let frame;
        let score;
        if (tile.index === 269) (frame = 0), (score = 100);
        else if (tile.index === 270) (frame = 1), (score = 100);
        else if (tile.index === 271) (frame = 2), (score = 100);
        else if (tile.index === 273) (frame = 4), (score = 300);
        else if (tile.index === 274) (frame = 5), (score = 300);
        else if (tile.index === 275) (frame = 6), (score = 300);
        else if (tile.index === 277) (frame = 8), (score = 500);
        else if (tile.index === 278) (frame = 9), (score = 500);
        else if (tile.index === 279) (frame = 10), (score = 500);
        else if (tile.index === 281) (frame = 12), (score = 1000);
        else if (tile.index === 282) (frame = 13), (score = 1000);
        else if (tile.index === 283) (frame = 14), (score = 1000);
        else return;

        const fruit = game.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            "fruit",
            frame
        );
        fruit.score = score;
        game.fruitLayer.removeTileAt(tile.x, tile.y);
        fruit.setImmovable(true).body.setAllowGravity(false);
        fruit.originalPos = { x: fruit.x, y: fruit.y };
        game.physics.add.overlap(game.player, fruit, () => {
            fruit.destroy();
            globalThis.score += fruit.score;
        });
        game.Fruits.push(fruit);
    });
}
export function defineStuff(game) {
    game.boxes = [];
    game.UDplatforms = [];
    game.SpinPlatforms = [];
    game.CrackForms = [];
    game.Fruits = [];
    game.Doors = [];
    game.Bridges = [];
    game.Signs = [];
    game.debug = false;
    game.keys = game.input.keyboard.addKeys('W,A,S,D,SPACE,SHIFT,Z,X,C,V,B,N,M,Q,E,R,T,Y,U,I,O,P,F,G,H,J,K,L,F1');
    game.cursors = game.input.keyboard.createCursorKeys();
    game.lastscore = 0
    game.signCount = 0
    globalThis.scoreText = game.add
        .text(
            game.scale.width - 10,
            10,
            `Score: ${globalThis.score.toString().padStart(6, "0")}`,
            {
                fontFamily: "Arial",
                fontSize: 18,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
            }
        )
        .setOrigin(1, 0);
}
export function addBorders(game, left = false, right = false, top = false, bottom = false) {
    if (left) {
        const leftWall = game.physics.add
            .image(-5, game.scale.height / 2, null)
            .setOrigin(0.5);
        leftWall.setImmovable(true).setDisplaySize(10, game.scale.height * 2);
        leftWall.body.setAllowGravity(false);
        game.physics.add.collider(game.player, leftWall);
    }

    if (right) {
        const rightWall = game.physics.add
            .image(5 + game.scale.width, game.scale.height / 2, null)
            .setOrigin(0.5);
        rightWall.setImmovable(true).setDisplaySize(10, game.scale.height * 2);
        rightWall.body.setAllowGravity(false);
        game.physics.add.collider(game.player, rightWall);
    }

    if (top) {
        const topWall = game.physics.add
            .image(game.scale.width / 2, -5, null)
            .setOrigin(0.5);
        topWall.setImmovable(true).setDisplaySize(game.scale.width * 2, 10);
        topWall.body.setAllowGravity(false);
        game.physics.add.collider(game.player, topWall);
    }

    if (bottom) {
        const bottomWall = game.physics.add
            .image(game.scale.width / 2, 5 + game.scale.height, null)
            .setOrigin(0.5);
        bottomWall.setImmovable(true).setDisplaySize(game.scale.width * 2, 10);
        bottomWall.body.setAllowGravity(false);
        game.physics.add.collider(game.player, bottomWall);
    }
}
export function debug(game) {
    if (game.debug == true) {
            if (!game.physics.world.debugGraphic)game.physics.world.createDebugGraphic();;
            game.physics.world.drawDebug = true;
            game.physics.world.debugGraphic.clear();
            game.physics.world.drawDebug = true;
        } else {
            if (game.physics.world.debugGraphic) {
                game.physics.world.debugGraphic.clear();
                game.physics.world.drawDebug = false;
            }
        }
    if (Phaser.Input.Keyboard.JustDown(game.keys.F1)) {
        if(!game.debug)game.debug=true; else game.debug=false;
    }
}
export function signDisplay(game) {
    game.Signs.forEach(sign => {
        const distance = Phaser.Math.Distance.Between(game.player.x, game.player.y, sign.x, sign.y);

        if (distance < 30 && sign.textBox) {
            sign.textBox.setAlpha(Math.min(sign.textBox.alpha + 0.05, 1));
            sign.textBox.setScale(Math.min(sign.textBox.scale + 0.05, 1));
            if (sign.textBox.text.length < sign.textBox.Text.length && sign.textBox.alpha > 0.8) {
                sign.textBox.text += sign.textBox.Text.charAt(sign.textBox.text.length);
            }
        } else if (sign.textBox) {
            sign.textBox.setAlpha(Math.max(sign.textBox.alpha - 0.05, 0));
            sign.textBox.setScale(Math.max(sign.textBox.scale - 0.05, 0));
            if (sign.textBox.alpha == 0) {
                sign.textBox.text = ""
            }
        }
    });
}