define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup', 'music-calc'], function (Level, PipeGroup, StarGroup, MusicCalc) {

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

    Level1.prototype.postCreate = function() {
        this.velocity = -150;
        this.ground.autoScroll(this.velocity,0);
        this.maxPipeCount = 4;
        this.pipeDelay = Phaser.Timer.SECOND*5;
        this.duration = 0.5 + this.maxPipeCount*5 + 1.5;
        this.yScale = d3.scale.linear()
            .domain([this.game.rootNote - 2, this.game.rootNote + 2])
            .range([this.game.height - this.ground.height, 0]);
    };

    Level1.prototype.updatePitch = function(pitch) {
        currentNote = MusicCalc.freqToMidiNum(pitch);
        if (!this.gameover) console.log(Math.round(currentNote));
        if (currentNote >= this.game.lowerNote-1 && currentNote <= this.game.upperNote+1) {
            this.bird.flap(this.yScale(currentNote));
        }
    };

    Level1.prototype.createStars = function(delay, y) {
        var starY = this.game.rnd.integerInRange(y-50, y+50);
        var pipeSpace = delay/1000*200;
        var starX = this.game.width + this.game.rnd.integerInRange(pipeSpace*0.05, pipeSpace*0.2);
        var starGroup = this.stars.getFirstExists(false);
        if (!starGroup) {
            starGroup = new StarGroup(this.game, this.stars);
        }
        starGroup.reset(starX, starY);
        starGroup.setAll('body.velocity.x', this.velocity);
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
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }

        if (this.pipeCount%2 == 1) {
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
        pipeGroup.setAll('body.velocity.x', this.velocity);
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(this.pipeDelay, this.generatePipes, this);
      };

	return Level1;
});

