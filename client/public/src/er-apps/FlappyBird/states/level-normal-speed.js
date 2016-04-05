define(['./level-slow', '../prefabs/PipeGroup', '../prefabs/starGroup'], function (Parent, PipeGroup, StarGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;

    Level.prototype.postCreate = function() {
        this.velocity = -200;
        this.maxPipeCount = 8;
        this.pipeDelay = Phaser.Timer.SECOND*3.5;
        this.yScale = d3.scale.linear()
            .domain([this.game.rootNote - 2, this.game.rootNote + 2])
            .range([this.game.height - this.ground.height, 0]);
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
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }

        if (this.game.rnd.integerInRange(0, 1) == 0) {
            pipeGroup.reset(this.game.width, 50);
            pipeGroup.bottomPipe.visible = false;
            this.createStars(this.pipeDelay, 270);
            this.createStars(this.pipeDelay, 270);
        } else {
            pipeGroup.reset(this.game.width, -110);
            pipeGroup.topPipe.visible = false;
            this.createStars(this.pipeDelay, 100);
            this.createStars(this.pipeDelay, 100);
        }
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(this.pipeDelay, this.generatePipes, this);
      };

	return Level;
});

