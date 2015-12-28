define(['./Cuttable'], function (Cuttable) {


Bomb = function (game_state, name, position, properties) {
    "use strict";
    Cuttable.call(this, game_state, name, position, properties);
    
    this.body.setSize(20, 20);
};

Bomb.prototype = Object.create(Cuttable.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.cut = function () {
    "use strict";
    Cuttable.prototype.cut.call(this);
    // if a bomb is cut, the player lose a life
    this.game_state.prefabs.lives.die();
    this.kill();
};
return Bomb
});