define(['./Level', '../prefabs/Spawners/FruitSpawner', '../prefabs/Spawners/BombSpawner', '../prefabs/Spawners/SpecialFruitSpawner', 
    '../prefabs/Prefab', '../prefabs/HUD/Lives', '../prefabs/HUD/RemainingTime'], 
    function (Level, FruitSpawner, BombSpawner, SpecialFruitSpawner, Prefab, Lives, RemainingTime) {

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
    
    this.lives = 5;
    this.remaining_time = Phaser.Timer.SECOND * 60;
    this.highest_score = "classic_score";
};

Classic.prototype.update = function () {
    "use strict";
    if (this.remaining_time > 0) {
        this.remaining_time -= this.game.time.elapsed;
        if (this.remaining_time <= 0) {
            this.game_over();
            this.remaining_time = 0;
        }
    }
};

Classic.prototype.init_hud = function () {
    "use strict";
    Level.prototype.init_hud.call(this);
    var lives_position, lives;
    // create lives prefab
    lives_position = new Phaser.Point(0.70 * this.game.world.width, 40);
    lives = new Lives(this, "lives", lives_position, {texture: "sword_image", group: "hud", "lives": 5, "lives_spacing": 25});

    var remaining_time_position, remaining_time_style, remaining_time;
    // show remaining time
    remaining_time_position = new Phaser.Point(0.65 * this.game.world.width, 10);
    remaining_time_style = {font: "32px Shojumaru", fill: "#fff"};
    remaining_time = new RemainingTime(this, "remaining_time", remaining_time_position, {text: "Remaining time: ", style: remaining_time_style, group: "hud"});

};
return Classic;
});