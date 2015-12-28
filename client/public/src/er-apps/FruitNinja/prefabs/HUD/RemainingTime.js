define(['../TextPrefab'], function (TextPrefab) {


var RemainingTime = function (game_state, name, position, properties) {
    "use strict";
    TextPrefab.call(this, game_state, name, position, properties);
};

RemainingTime.prototype = Object.create(TextPrefab.prototype);
RemainingTime.prototype.constructor = RemainingTime;

RemainingTime.prototype.update = function () {
    "use strict";
    // update the text to show the remaining time in seconds
    this.text = "Remaining time: " + this.game_state.remaining_time / Phaser.Timer.SECOND;
};
return RemainingTime;
});