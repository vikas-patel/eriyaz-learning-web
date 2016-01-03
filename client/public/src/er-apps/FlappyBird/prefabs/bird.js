define([], function () {

  var Bird = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'bird', frame);
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('flap');
    this.animations.play('flap', 12, true);

    this.flapSound = this.game.add.audio('flap');

    this.name = 'bird';
    this.alive = false;
    this.onGround = false;


    // enable physics on the bird
    // and disable gravity on the bird
    // until the game is started
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;


    this.events.onKilled.add(this.onKilled, this);

    
    
  };

  Bird.prototype = Object.create(Phaser.Sprite.prototype);
  Bird.prototype.constructor = Bird;

  Bird.prototype.update = function() {
    // check to see if our angle is less than 90
    // if it is rotate the bird towards the ground by 2.5 degrees
    if(this.angle < 90 && this.alive) {
      if (this.angle > 1) {
        this.angle -= 2;
      } else if (this.angle < -1) {
        this.angle += 2;
      }
    }

    if(!this.alive) {
      this.body.velocity.x = 0;
    }
  };

  Bird.prototype.flap = function(y) {
    if(!!this.alive) {
      if (Math.abs(y-this.y) < 4) {
        this.y = y;
      } else {
        if (y > this.y) {
          this.y = this.y + (y-this.y)/10;
          this.game.add.tween(this).to({angle: 40}, 100).start();
        } else {
          this.y = this.y - (this.y - y)/10;
          this.game.add.tween(this).to({angle: -40}, 100).start();
        }
      }
      // stay above ground.
      if (this.y > 388) this.y = 388;
    }
  };


  Bird.prototype.revived = function() { 
  };

  Bird.prototype.onKilled = function() {
    this.exists = true;
    this.visible = true;
    this.animations.stop();
    var duration = 90 / this.y * 300;
    this.game.add.tween(this).to({angle: 90}, duration).start();
  };
  return Bird;
});
