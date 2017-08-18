define(['./level', '../prefabs/pipeGroup', '../prefabs/starGroup'], function (Level, PipeGroup, StarGroup) {

	function Level1() {
	}

	Level1.prototype = Object.create(Level.prototype);
	Level1.prototype.constructor = Level;
	Level1.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && 
        	(pipeGroup.topPipe.world.x <= this.bird.world.x || pipeGroup.bottomPipe.world.x <= this.bird.world.x)) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
      };
      
	Level1.prototype.generatePipes = function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
            return;
        }
        if (this.pipeCount == this.maxPipeCount) {
            // don't generate pipes anymore.
            this.pipeCount++;
            this.pipeGenerator = this.game.time.events.add(1500, this.generatePipes, this);
            return;
        }
        this.pipeDelay = Math.max(this.pipeDelay - 50, 1500);
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }

        if (this.game.rnd.integerInRange(0, 1) == 0) {
        	pipeGroup.reset(this.game.width, 90);
        	pipeGroup.bottomPipe.visible = false;
            this.createStars(this.pipeDelay, 310);
            this.createStars(this.pipeDelay, 310);
        } else {
        	pipeGroup.reset(this.game.width, -130);
        	pipeGroup.topPipe.visible = false;
            this.createStars(this.pipeDelay, 70);
            this.createStars(this.pipeDelay, 70);
        }
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(this.pipeDelay, this.generatePipes, this);
      };

	return Level1;
});

