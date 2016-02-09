define(['./pipe'], function (Pipe) {

  var PipeGroup = function(game, parent, bottomY) {

    Phaser.Group.call(this, game, parent);
    this.bottomY = bottomY ? bottomY : 440;
    this.topPipe = new Pipe(this.game, 0, 0, 0);
    this.bottomPipe = new Pipe(this.game, 0, this.bottomY, 1);
    this.add(this.topPipe);
    this.add(this.bottomPipe);
    this.hasScored = false;

    this.setAll('body.velocity.x', -200);
  };

  PipeGroup.prototype = Object.create(Phaser.Group.prototype);
  PipeGroup.prototype.constructor = PipeGroup;

  PipeGroup.prototype.update = function() {
    this.checkWorldBounds(); 
  };

  PipeGroup.prototype.checkWorldBounds = function() {
    if(!this.topPipe.inWorld) {
      this.exists = false;
    }
  };


  PipeGroup.prototype.reset = function(x, y) {
    this.topPipe.reset(0,0);
    this.bottomPipe.reset(0,this.bottomY);
    this.x = x;
    this.y = y;
    this.setAll('body.velocity.x', -200);
    this.hasScored = false;
    this.exists = true;
  };
  return PipeGroup;
});