define(['./level-wall', '../prefabs/pipeGroup', '../prefabs/starGroup', '../prefabs/wallGroup'], function (Parent, PipeGroup, StarGroup, WallGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;

    Level.prototype.postCreate = function() {
        Parent.prototype.postCreate.call(this);
        this.maxPipeCount = 15;
    };

    Level.prototype.medals = function(score) {
        var medals = 0;
        if(score >= this.maxPipeCount && score < 2*this.maxPipeCount) {
            medals = 1;
        } else if(score >= 2*this.maxPipeCount && score < 3*this.maxPipeCount) {
            medals = 2;
        } else if (score >= 3*this.maxPipeCount) {
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
        if (this.pipeCount < this.maxPipeCount/6) {
            random = 1;
        } else if (this.pipeCount < this.maxPipeCount/3) {
            random = 2;
        } else {
            random = this.game.rnd.integerInRange(2, 4);;
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

