define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup', '../prefabs/wallGroup'], function (Parent, PipeGroup, StarGroup, WallGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;
	Level.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && 
        	(pipeGroup.topWall.world.x <= this.bird.world.x)) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
      };
    Level.prototype.postCreate = function() {
        this.game.physics.arcade.gravity.y = 50;
        this.bird.body.allowGravity = true;
        this.maxPipeCount = 40;
    };

    Level.prototype.createStars = function(delay) {
        var starY = this.game.rnd.integerInRange(50, this.game.height-this.ground.height-150);
        var pipeSpace = delay/1000*200;
        var starX = this.game.width + this.game.rnd.integerInRange(pipeSpace*0.3, pipeSpace*0.6);
        var starGroup = this.stars.getFirstExists(false);
        if (!starGroup) {
            starGroup = new StarGroup(this.game, this.stars);
        }
        starGroup.reset(starX, starY);
    };

    // Level.prototype.deathHandler = function() {
    //     if(!this.gameover) {
    //         // this.pipeHitSound.play();
    //     }
    // };

	Level.prototype.generatePipes = function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
            return;
        }
        var random;
        if (this.pipeCount < 8) {
            random = this.game.rnd.integerInRange(1, 2);
        } else {
            random = this.game.rnd.integerInRange(2, 7);
        }
        var randomH = this.game.rnd.integerInRange(-200, -330);
        for (var i = 0; i < random; i++) {
            this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, randomH);
            this.subPipeGenerator.timer.start();
        }
        this.createStars(Phaser.Timer.SECOND*5);
        this.createStars(Phaser.Timer.SECOND*5);
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*5, this.generatePipes, this);
      };

    Level.prototype.generateSubPipes = function(y) {
        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = new WallGroup(this.game, this.pipes, 160);
        }
        wallGroup.reset(this.game.width, y);
        this.pipeCount++;
    };

	return Level;
});

