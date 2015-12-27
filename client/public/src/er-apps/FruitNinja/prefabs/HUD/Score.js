define(['../TextPrefab'], function (TextPrefab) {


var Score = function (game_state, name, position, properties) {
    "use strict";
    TextPrefab.call(this, game_state, name, position, properties);
};

Score.prototype = Object.create(TextPrefab.prototype);
Score.prototype.constructor = Score;

Score.prototype.update = function () {
    "use strict";
    // update the text to show the number of cutted fruits
    this.text = "Fruits: " + this.game_state.score;
};
return Score;
});