define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup'], function (Level, PipeGroup, StarGroup) {

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

    Level1.prototype.setYScale = function() {
        console.log("level1");
        this.yScale = d3.scale.linear()
            .domain([0, 11])
            .range([this.game.height - 120, 0]);
    };

	Level1.prototype.generatePipes = function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
        }
        var delay = Math.max(this.pipeGenerator.delay - 50, 1500);
        var pipeY = this.game.rnd.integerInRange(-100, 100);
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }
        var starY = this.game.rnd.integerInRange(this.game.height/10, this.game.height*9/10);
        var pipeSpace = delay/1000*200;
        var starX = pipeSpace + this.game.rnd.integerInRange(pipeSpace*2/10, pipeSpace*7/10);
        var starGroup = this.stars.getFirstExists(false);
        if (!starGroup) {
            starGroup = new StarGroup(this.game, this.stars);
        }
        starGroup.reset(starX, starY);
        if (this.game.rnd.integerInRange(0, 1) == 0) {
        	pipeGroup.reset(this.game.width, 100);
        	pipeGroup.bottomPipe.visible = false;
        	//pipeGroup.topPipe.visible = true;
        } else {
        	pipeGroup.reset(this.game.width, -150);
        	pipeGroup.topPipe.visible = false;
        	//pipeGroup.bottomPipe.visible = true;
        }
        
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(delay, this.generatePipes, this);
      };

	return Level1;
});

