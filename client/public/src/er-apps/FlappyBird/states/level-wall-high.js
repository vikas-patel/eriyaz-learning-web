define(['./level-wall', '../prefabs/PipeGroup', '../prefabs/starGroup', '../prefabs/wallGroup'], function (Parent, PipeGroup, StarGroup, WallGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;

    Level.prototype.postCreate = function() {
        Parent.prototype.postCreate.call(this);
        this.starY1 = 30;
        this.starY2 = 190;
        this.starXRange = 100;
    };

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
        } else {
            random = this.game.rnd.integerInRange(2, 7);
        }

        for (var i = 0; i < random; i++) {
            this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -330);
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

