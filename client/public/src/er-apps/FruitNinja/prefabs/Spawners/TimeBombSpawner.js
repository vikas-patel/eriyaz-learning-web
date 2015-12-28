define(['./Spawner', '../Cuttables/TimeBomb'], function (Spawner, TimeBomb) {


var TimeBombSpawner = function (game_state, name, position, properties) {
    "use strict";
    Spawner.call(this, game_state, name, position, properties);
};

TimeBombSpawner.prototype = Object.create(Spawner.prototype);
TimeBombSpawner.prototype.constructor = TimeBombSpawner;

TimeBombSpawner.prototype.create_object = function (name, position, velocity) {
    "use strict";
    // return new time bomb
    return new TimeBomb(this.game_state, name, position, {texture: "time_bomb_image", group: "time_bombs", velocity: velocity});
};
return TimeBombSpawner;
});