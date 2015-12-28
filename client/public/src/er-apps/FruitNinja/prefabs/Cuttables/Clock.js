define(['./Cuttable'], function (Cuttable) {


Clock = function (game_state, name, position, properties) {
    "use strict";
    Cuttable.call(this, game_state, name, position, properties);
    
    this.body.setSize(20, 20);
};

Clock.prototype = Object.create(Cuttable.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.cut = function () {
    "use strict";
    Cuttable.prototype.cut.call(this);
    // if a time bomb is cut, increase the remaining time by 3 seconds
    this.game_state.remaining_time += Phaser.Timer.SECOND * 3;
    this.kill();
};
return Clock;
});