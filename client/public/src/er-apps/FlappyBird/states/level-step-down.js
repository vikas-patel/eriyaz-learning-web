define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup'], function (Parent, PipeGroup, StarGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;
	Level.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && 
        	(pipeGroup.topPipe.world.x <= this.bird.world.x || pipeGroup.bottomPipe.world.x <= this.bird.world.x)) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
      };
    Level.prototype.postCreate = function() {
        this.yScale = d3.scale.linear()
            .domain([0, 9])
            .range([this.game.height - 120, 0]);
    };

    Level.prototype.updatePitch = function(pitch) {
            currInterval = Math.round(1200 * Math.log(pitch/this.rootFreq) / Math.log(2))/100;
            //if (currInterval > 18) currInterval -= 12;
            //if (currInterval < -9) currInterval += 12;
            // this.bird.flap(this.yScale(currInterval));
            console.log(Math.floor(currInterval));
            if (currInterval > -6 && currInterval < 18) {
                this.bird.flap(this.yScale(currInterval));
            }
    };

	Level.prototype.generatePipes = function() {
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

        this.y = -150;
        var random = this.game.rnd.integerInRange(2, 4);

        for (var i = 0; i < random; i++) {
            this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*1.6*i, this.generateSubPipes, this, this.y+70*i);
            this.subPipeGenerator.timer.start();
        }
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*(3 + 1.6*random), this.generatePipes, this);
      };

    Level.prototype.generateSubPipes = function(y) {
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes, 480);  
        }
        pipeGroup.reset(this.game.width, y);
        this.pipeCount++;
    };

	return Level;
});