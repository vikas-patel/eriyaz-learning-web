define(['./Spawner', '../Cuttables/Fruit'], function (Spawner, Fruit) {


var FruitSpawner = function (game_state, name, position, properties) {
    "use strict";
    Spawner.call(this, game_state, name, position, properties);
    
    this.frames = properties.frames;
};

FruitSpawner.prototype = Object.create(Spawner.prototype);
FruitSpawner.prototype.constructor = FruitSpawner;

FruitSpawner.prototype.create_object = function (name, position, velocity) {
    "use strict";
    // return new fruit with random frame
    return new Fruit(this.game_state, name, position, {texture: "fruits_spritesheet", group: "fruits", frames: this.frames, velocity: velocity});
};
return FruitSpawner;
});