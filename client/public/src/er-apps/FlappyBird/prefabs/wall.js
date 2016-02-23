define([], function () {

	var Wall = function(game, x, y) {
	  Phaser.Sprite.call(this, game, x, y, 'wall');
	  this.anchor.setTo(0.5, 0);
	  this.game.physics.arcade.enableBody(this);

	  this.body.allowGravity = false;
	  this.body.immovable = true;
	};

	Wall.prototype = Object.create(Phaser.Sprite.prototype);
	Wall.prototype.constructor = Wall;

	Wall.prototype.update = function() {
	  // write your prefab's specific update code here
	  
	};
	return Wall;
});