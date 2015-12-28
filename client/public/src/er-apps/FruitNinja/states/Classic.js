define(['./Level', '../prefabs/Spawners/FruitSpawner', '../prefabs/Spawners/BombSpawner', 
    '../prefabs/Spawners/SpecialFruitSpawner', '../prefabs/Prefab', '../prefabs/HUD/Lives'], function (Level, FruitSpawner, BombSpawner, SpecialFruitSpawner, Prefab, Lives) {

Classic = function () {
    "use strict";
    Level.call(this);
    
    this.prefab_classes = {
        "fruit_spawner": FruitSpawner.prototype.constructor,
        "bomb_spawner": BombSpawner.prototype.constructor,
        "special_fruit_spawner": SpecialFruitSpawner.prototype.constructor,
        "background": Prefab.prototype.constructor
    };
};

Classic.prototype = Object.create(Level.prototype);
Classic.prototype.constructor = Classic;

Classic.prototype.init = function (level_data) {
    "use strict";
    Level.prototype.init.call(this, level_data);
    
    this.lives = 3;
    
    this.highest_score = "classic_score";
};

Classic.prototype.init_hud = function () {
    "use strict";
    Level.prototype.init_hud.call(this);
    var lives_position, lives;
    // create lives prefab
    lives_position = new Phaser.Point(0.75 * this.game.world.width, 20);
    lives = new Lives(this, "lives", lives_position, {texture: "sword_image", group: "hud", "lives": 3, "lives_spacing": 50});
};
return Classic;
});