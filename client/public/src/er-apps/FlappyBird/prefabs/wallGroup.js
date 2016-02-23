define(['./wall'], function (Wall) {

  var WallGroup = function(game, parent, gap) {

    Phaser.Group.call(this, game, parent);
    this.gap = gap ? gap : 160;
    this.topWall = new Wall(this.game, 0, 0);
    this.bottomWall = new Wall(this.game, 0, this.topWall.height + this.gap);
    this.add(this.topWall);
    this.add(this.bottomWall);
    this.hasScored = false;

    this.setAll('body.velocity.x', -200);
  };

  WallGroup.prototype = Object.create(Phaser.Group.prototype);
  WallGroup.prototype.constructor = WallGroup;

  WallGroup.prototype.update = function() {
    this.checkWorldBounds(); 
  };

  WallGroup.prototype.checkWorldBounds = function() {
    if(!this.topWall.inWorld) {
      this.exists = false;
    }
  };

  WallGroup.prototype.reset = function(x, y) {
    this.topWall.reset(0, 0);
    this.bottomWall.reset(0, this.topWall.height + this.gap);
    this.x = x;
    this.y = y;
    this.setAll('body.velocity.x', -200);
    this.hasScored = false;
    this.exists = true;
  };
  return WallGroup;
});