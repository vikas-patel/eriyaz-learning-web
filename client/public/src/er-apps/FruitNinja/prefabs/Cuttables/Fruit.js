define(['./Cuttable', '../../problem'], function (Cuttable, Problem) {


Fruit = function (game_state, name, position, properties) {
    "use strict";
    var frame_index;
    Cuttable.call(this, game_state, name, position, properties);
    
    this.frames = properties.frames;
    
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
    
    this.body.setSize(20, 20);

    this.inputEnabled = true;
    this.events.onInputDown.add(this.onTap, this);
    this.problem = new Problem();
};

Fruit.prototype = Object.create(Cuttable.prototype);
Fruit.prototype.constructor = Fruit;

Fruit.prototype.reset = function (position_x, position_y, velocity) {
    "use strict";
    var frame_index;
    Cuttable.prototype.reset.call(this, position_x, position_y, velocity);
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
    this.problem = new Problem();
};

Fruit.prototype.cut = function (isRight) {
    "use strict";
    Cuttable.prototype.cut.call(this);
    console.log("right:"+isRight + " up:"+this.problem.isUp());
    // if a fruit is cut, increment score
    if (isRight && this.problem.isUp()) {
        this.game_state.score += 1;
    } else if (!isRight && !this.problem.isUp()) {
        this.game_state.score += 1;
    } else {
        // do nothing
    }
    
    this.body.allowGravity = true;
    this.kill();

};

Fruit.prototype.onTap = function () {
    this.body.allowGravity = false;
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.game.player.playNote(this.problem.note1, this.problem.playTime);
    this.game.player.playNote(this.problem.note2, this.problem.playTime, this.problem.playTime);
};
return Fruit;
});