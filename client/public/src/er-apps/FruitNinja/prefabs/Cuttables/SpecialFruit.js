define(['./Cuttable'], function (Cuttable) {


SpecialFruit = function (game_state, name, position, properties) {
    "use strict";
    var frame_index;
    Cuttable.call(this, game_state, name, position, properties);
    
    this.body.setSize(20, 20);
    
    // create a timer with autoDestroy = false, so it won't be killed
    this.kill_timer = this.game_state.game.time.create(false);
};

SpecialFruit.prototype = Object.create(Cuttable.prototype);
SpecialFruit.prototype.constructor = SpecialFruit;

SpecialFruit.prototype.kill = function () {
    "use strict";
    Phaser.Sprite.prototype.kill.call(this);
    // prepare the fruit so it can be reused
    this.body.allowGravity = true;
    this.kill_timer.stop();
};

SpecialFruit.prototype.cut = function () {
    "use strict";
    Cuttable.prototype.cut.call(this);
    // if a fruit is cut, increment score
    this.game_state.score += 1;
    // if it's the first cut, stops the fruit and start the timer to kill it
    if (!this.kill_timer.running) {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
        this.body.velocity.x = 0;
        this.kill_timer.add(Phaser.Timer.SECOND * 3, this.kill, this);
        this.kill_timer.start();
    }
};
return SpecialFruit;
});