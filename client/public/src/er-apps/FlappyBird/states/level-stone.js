define(['./level', '../prefabs/block', '../prefabs/PipeGroup', '../prefabs/starGroup'], function (Parent, Block, PipeGroup, StarGroup) {

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
        this.cloud = new Block(this.game, 0, 360, 720, 40, 'stone');
        this.game.add.existing(this.cloud);

        this.yScale = d3.scale.linear()
            .domain([-2, 9])
            .range([this.game.height - 120, 0]);
    };

    Level.prototype.update = function() {
        Parent.prototype.update.call(this);
        if(!this.gameover) {
            this.game.physics.arcade.overlap(this.bird, this.cloud, this.deathHandler, null, this);
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
        var delay = Math.max(this.pipeGenerator.delay - 50, 1500);
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }
        this.createStars(delay);

        if (this.game.rnd.integerInRange(0, 1) == 0) {
            pipeGroup.reset(this.game.width, 50);
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

	return Level;
});

