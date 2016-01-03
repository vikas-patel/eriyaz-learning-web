define(['./Cuttable', '../../problem'], function (Cuttable, ProblemFactory) {


Fruit = function (game_state, name, position, properties) {
    "use strict";
    var frame_index;
    Cuttable.call(this, game_state, name, position, properties);
    
    this.frames = properties.frames;
    
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
    
    this.body.setSize(20, 20);
    this.inputEnabled = true;
    this.events.onOutOfBounds.add(this.outBoundHandler, this);

    this.events.onInputOver.add(this.mouseOver, this);
    this.events.onInputOut.add(this.mouseOut, this);
    this.problem = ProblemFactory.getInstance();
    this.problem.next();
    this.isUp = this.problem.isUp;
    this.on_selection_animation = this.game_state.game.add.tween(this.scale);
    this.on_selection_animation.to({x: 1.2 * this.scale.x, y: 1.2 * this.scale.y}, 500);
    this.on_selection_animation.to({x: this.scale.x, y: this.scale.y}, 500);
    this.on_selection_animation.start();
};

Fruit.prototype = Object.create(Cuttable.prototype);
Fruit.prototype.constructor = Fruit;

Fruit.prototype.reset = function (position_x, position_y, velocity) {
    "use strict";
    var frame_index;
    Cuttable.prototype.reset.call(this, position_x, position_y, velocity);
    frame_index = this.game_state.rnd.between(0, this.frames.length - 1);
    this.frame = this.frames[frame_index];
    this.problem.next();
    this.isUp = this.problem.isUp;
    
    this.on_selection_animation.start();
};

Fruit.prototype.cut = function (isRight) {
    "use strict";
    Cuttable.prototype.cut.call(this);
    this.game_state.splashSound.play();
    if (this.isUp && isRight) this.game_state.score++;
    else if (!this.isUp && !isRight) this.game_state.score++;
    else this.game_state.prefabs.lives.die();
    this.kill();
};

Fruit.prototype.mouseOver = function(pointer) {
    this.overPointerX = this.game.input.x;;
};

Fruit.prototype.mouseOut = function() {
    var isRight = this.game.input.x > this.overPointerX ? true : false;
    this.cut(isRight);
};

Fruit.prototype.outBoundHandler = function() {
    // out of bound
};

return Fruit;
});