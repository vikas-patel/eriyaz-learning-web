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
        this.maxPipeCount = 15;
        this.starY1 = 160;
        this.starY2 = this.game.height-this.ground.height-50;
        this.starXRange = 100;
    };

    Level.prototype.createStars = function(starX1) {
        var starY = this.game.rnd.integerInRange(this.starY1, this.starY2);
        // var pipeSpace = delay/1000*200;
        var starX = this.game.rnd.integerInRange(starX1, starX1 + this.starXRange);
        var starGroup = this.stars.getFirstExists(false);
        if (!starGroup) {
            starGroup = new StarGroup(this.game, this.stars);
        }
        starGroup.reset(starX, starY);
    };

    Level.prototype.updateProgress = function() {
        var percentage = (this.pipeCount)/(this.maxPipeCount+1);
        this.graphics.moveTo(this.graphics.x, 1);
        this.graphics.lineTo(this.game.width*percentage, 1);
    };

    Level.prototype.medals = function(score) {
        var medals = 0;
        if(score >= this.maxPipeCount*4/3 && score < 3*this.maxPipeCount) {
            medals = 1;
        } else if(score >= 3*this.maxPipeCount && score < 4*this.maxPipeCount) {
            medals = 2;
        } else if (score >= 4*this.maxPipeCount) {
            medals = 3;
        }
        return medals;
    }

	Level.prototype.generatePipes = function() {
       this.updateProgress();
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
            return;
        }
        var random;
        if (this.pipeCount < this.maxPipeCount/5) {
            random = this.game.rnd.integerInRange(1, 2);
        } else if (this.pipeCount < this.maxPipeCount/3){
            random = this.game.rnd.integerInRange(2, 4);
        } else if (this.pipeCount < this.maxPipeCount/2) {
            random = this.game.rnd.integerInRange(3, 5);
        } else {
            random = this.game.rnd.integerInRange(3, 7);
        }

        for (var i = 0; i < random; i++) {
            this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -200);
            this.subPipeGenerator.timer.start();
        }
        this.createStars(3.5*200 + random*40 + 50);
        this.createStars(3.5*200 + random*40 + 50);
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*(3.5+0.2*random), this.generatePipes, this);
        this.pipeCount++;
      };

    Level.prototype.generateSubPipes = function(y) {
        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = new WallGroup(this.game, this.pipes, 160);
        }
        wallGroup.reset(this.game.width, y);
    };

	return Level;
});

