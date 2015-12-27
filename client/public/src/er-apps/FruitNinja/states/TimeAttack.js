define(['./Level','../prefabs/Spawners/FruitSpawner', '../prefabs/Spawners/TimeBombSpawner', '../prefabs/Spawners/ClockSpawner' ,
    '../prefabs/Spawners/SpecialFruitSpawner', '../prefabs/Prefab', '../prefabs/HUD/RemainingTime'], function (Level, FruitSpawner, TimeBombSpawner, ClockSpawner, SpecialFruitSpawner, Prefab, RemainingTime) {

var TimeAttack = function () {
    "use strict";
    Level.call(this);
    
    this.prefab_classes = {
        "fruit_spawner": FruitSpawner.prototype.constructor,
        "time_bomb_spawner": TimeBombSpawner.prototype.constructor,
        "clock_spawner": ClockSpawner.prototype.constructor,
        "special_fruit_spawner": SpecialFruitSpawner.prototype.constructor,
        "background": Prefab.prototype.constructor
    };
};

TimeAttack.prototype = Object.create(Level.prototype);
TimeAttack.prototype.constructor = TimeAttack;

TimeAttack.prototype.init = function (level_data) {
    "use strict";
    Level.prototype.init.call(this, level_data);
    
    this.remaining_time = Phaser.Timer.SECOND * 60;
    
    this.highest_score = "time_attack_score";
};

TimeAttack.prototype.update = function () {
    "use strict";
    if (this.remaining_time > 0) {
        this.remaining_time -= this.game.time.elapsed;
        if (this.remaining_time <= 0) {
            this.game_over();
            this.remaining_time = 0;
        }
    }
};

TimeAttack.prototype.init_hud = function () {
    "use strict";
    Level.prototype.init_hud.call(this);
    var remaining_time_position, remaining_time_style, remaining_time;
    // show remaining time
    remaining_time_position = new Phaser.Point(0.5 * this.game.world.width, 20);
    remaining_time_style = {font: "32px Shojumaru", fill: "#fff"};
    remaining_time = new RemainingTime(this, "remaining_time", remaining_time_position, {text: "Remaining time: ", style: remaining_time_style, group: "hud"});
};
return TimeAttack;
});