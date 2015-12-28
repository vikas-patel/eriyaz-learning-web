define(['./Spawner', '../Cuttables/Clock'], function (Spawner, Clock) {


var ClockSpawner = function (game_state, name, position, properties) {
    "use strict";
    Spawner.call(this, game_state, name, position, properties);
};

ClockSpawner.prototype = Object.create(Spawner.prototype);
ClockSpawner.prototype.constructor = ClockSpawner;

ClockSpawner.prototype.create_object = function (name, position, velocity) {
    "use strict";
    // return new time bomb
    console.log("spawning clock");
    return new Clock(this.game_state, name, position, {texture: "clock_image", group: "clocks", velocity: velocity});
};
return ClockSpawner;
});