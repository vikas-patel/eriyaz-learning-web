define(['./Spawner', '../Cuttables/SpecialFruit'], function (Spawner, SpecialFruit) {


var SpecialFruitSpawner = function (game_state, name, position, properties) {
    "use strict";
    Spawner.call(this, game_state, name, position, properties);
    
    this.frames = properties.frames;
};

SpecialFruitSpawner.prototype = Object.create(Spawner.prototype);
SpecialFruitSpawner.prototype.constructor = SpecialFruitSpawner;

SpecialFruitSpawner.prototype.create_object = function (name, position, velocity) {
    "use strict";
    // return new fruit with random frame
    return new SpecialFruit(this.game_state, name, position, {texture: "fruits_spritesheet", group: "special_fruits", frame: 15, velocity: velocity});
};
return SpecialFruitSpawner;
});