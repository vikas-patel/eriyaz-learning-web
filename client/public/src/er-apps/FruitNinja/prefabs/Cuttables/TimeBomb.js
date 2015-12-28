define(['./Cuttable'], function (Cuttable) {


TimeBomb = function (game_state, name, position, properties) {
    "use strict";
    Cuttable.call(this, game_state, name, position, properties);
    
    this.body.setSize(20, 20);
};

TimeBomb.prototype = Object.create(Cuttable.prototype);
TimeBomb.prototype.constructor = TimeBomb;

TimeBomb.prototype.cut = function () {
    "use strict";
    Cuttable.prototype.cut.call(this);
    // if a time bomb is cut, decrease the remaining time by 5 seconds
    this.game_state.remaining_time -= Phaser.Timer.SECOND * 5;
    this.kill();
};
return TimeBomb;
});