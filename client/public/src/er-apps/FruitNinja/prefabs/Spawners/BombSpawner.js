define(['./Spawner', '../Cuttables/Bomb'], function (Spawner, Bomb) {


var BombSpawner = function (game_state, name, position, properties) {
    "use strict";
    Spawner.call(this, game_state, name, position, properties);
};

BombSpawner.prototype = Object.create(Spawner.prototype);
BombSpawner.prototype.constructor = BombSpawner;

BombSpawner.prototype.create_object = function (name, position, velocity) {
    "use strict";
    // return new bomb
    return new Bomb(this.game_state, name, position, {texture: "bomb_image", group: "bombs", velocity: velocity});
};
return BombSpawner;
});