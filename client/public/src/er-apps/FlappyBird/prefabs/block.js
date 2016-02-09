define([], function () {

  var Block = function(game, x, y, width, height, sprite) {
    Phaser.TileSprite.call(this, game, x, y, width, height, sprite);
    // start scrolling our Block
    
    // enable physics on the Block sprite
    // this is needed for collision detection
    this.game.physics.arcade.enableBody(this);
        
    // we don't want the Block's body
    // to be affected by gravity or external forces
    this.body.allowGravity = false;
    this.body.immovable = true;
  };

  Block.prototype = Object.create(Phaser.TileSprite.prototype);
  Block.prototype.constructor = Block;

  Block.prototype.update = function() {
    
    // write your prefab's specific update code here
    
  };
  return Block;
});