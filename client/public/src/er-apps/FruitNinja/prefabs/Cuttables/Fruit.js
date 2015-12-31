define(['./Cuttable'], function (Cuttable) {


Fruit = function (game_state, name, position, properties) {
    "use strict";
    var frame_index;
    Cuttable.call(this, game_state, name, position, properties);
    
    this.frames = properties.frames;
    
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
    
    this.body.setSize(20, 20);
    this.events.onOutOfBounds.add(this.outHandler, this);
};

Fruit.prototype = Object.create(Cuttable.prototype);
Fruit.prototype.constructor = Fruit;

Fruit.prototype.reset = function (position_x, position_y, velocity) {
    "use strict";
    var frame_index;
    Cuttable.prototype.reset.call(this, position_x, position_y, velocity);
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
};

Fruit.prototype.cut = function (isRight) {
    "use strict";
    Cuttable.prototype.cut.call(this);
    this.kill();
};

Fruit.prototype.outHandler = function() {
    console.log("outHandler");
    //this.game_state.prefabs.lives.die();
};

return Fruit;
});