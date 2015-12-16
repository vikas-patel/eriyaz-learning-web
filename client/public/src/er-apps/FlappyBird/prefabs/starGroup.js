define([], function () {

  var StarGroup = function(game, parent) {

    Phaser.Group.call(this, game, parent);
    this.enableBody = true;


    // Create 3 stars, evenly spaced
    this.star1 = this.create(0, 0, 'star');
    // Giving it gravity and bounce
    this.star1.body.allowGravity = false;
    this.star2 = this.create(70, 0, 'star');
    this.star2.body.allowGravity = false;
    this.star3 = this.create(140, 0, 'star');
    this.star3.body.allowGravity = false;


    // this.topPipe = new Pipe(this.game, 0, 0, 0);
    // this.bottomPipe = new Pipe(this.game, 0, 440, 1);
    // this.add(this.topPipe);
    // this.add(this.bottomPipe);
    // this.hasScored = false;

    this.setAll('body.velocity.x', -200);
  };

  StarGroup.prototype = Object.create(Phaser.Group.prototype);
  StarGroup.prototype.constructor = StarGroup;

  StarGroup.prototype.update = function() {
    //this.checkWorldBounds();
  };

  StarGroup.prototype.checkWorldBounds = function() {
    if(!this.star1.inWorld) {
      this.exists = false;
    }
  };

  StarGroup.prototype.reset = function(x, y) {
    this.star1.reset(0, 0);
    this.star2.reset(70, 0);
    this.star3.reset(140, 0);
    this.x = x;
    this.y = y;
    this.setAll('body.velocity.x', -200);
    this.exists = true;
  };
  return StarGroup;
});