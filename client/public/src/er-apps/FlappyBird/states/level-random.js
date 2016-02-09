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
        var random = this.game.rnd.integerInRange(-150, 100);
       var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes, 500);  
        }
        pipeGroup.reset(this.game.width, random);
        this.pipeCount++;

        this.createStars(Phaser.Timer.SECOND*3);
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*3, this.generatePipes, this);
      };

	return Level;
});

