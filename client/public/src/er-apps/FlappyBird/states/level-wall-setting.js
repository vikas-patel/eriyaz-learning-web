define(['./level', '../prefabs/PipeGroup', '../prefabs/wall', 'music-calc', '../prefabs/settingboard'], 
    function (Parent, PipeGroup, Wall, MusicCalc, Settingboard) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;

    Level.prototype.init = function(hideMenu, highPitchSet) {
         Parent.prototype.init.call(this, hideMenu);
         if (highPitchSet) {
            this.highPitchSet = true;
         } else {
            this.highPitchSet = false;
         }
    };

	Level.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }    
        // add +1 to score
    };
    Level.prototype.postCreate = function() {
        if (this.highPitchSet) {
            this.game.physics.arcade.gravity.y = -2;
        } else {
            this.game.physics.arcade.gravity.y = 2;
        }
        this.bird.body.allowGravity = true;
        this.yScale = d3.scale.linear()
            .domain([-12, 12])
            .range([this.game.height - 80, 0]);
        this.maxPipeCount = 10;
        if (this.game.gender == "man") {
            this.rootNote = 50;
        } else if (this.game.gender == "child") {
            this.rootNote = 68;
        } else {
            this.rootNote = 64;
        }
        this.rootFreq = MusicCalc.midiNumToFreq(this.rootNote);
    };

    Level.prototype.shutdown = function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        this.pipes.destroy();
        this.board.destroy();
    };

    Level.prototype.deathHandler = function() {
        this.pipeHitSound.play();
        this.board = new Settingboard(this.game, this.highPitchSet);
        this.game.add.existing(this.board);
        if (this.highPitchSet) {
            this.board.show(this.rootNote - this.score);
        } else {
            this.board.show(this.rootNote + this.score);
        }
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
        this.game.physics.arcade.gravity.y = 1200;
    };

    Level.prototype.levelCompleted = function() {
        this.board = new Settingboard(this.game, this.highPitchSet);
        this.game.add.existing(this.board);
        if (this.highPitchSet) {
            this.board.show(this.rootNote - this.score);
        } else {
            this.board.show(this.rootNote + this.score);
        }
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
    };

    Level.prototype.updatePitch = function(pitch) {
        currInterval = Math.round(1200 * Math.log(pitch/this.rootFreq) / Math.log(2))/100;
        // console.log(Math.floor(currInterval));
        if (currInterval > -12 && currInterval < 12) {
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
        var random;

        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = this.game.add.group(this.pipes);
            wallGroup.topPipe = new Wall(this.game, 0, 0);
            wallGroup.add(wallGroup.topPipe);
        }
        wallGroup.setAll('body.velocity.x', -200);
        wallGroup.x = this.game.width;
        var increment = (this.game.height - this.ground.height)/24;
        if (this.highPitchSet) {
            wallGroup.topPipe.anchor.setTo(0, 1);
            wallGroup.y = (this.game.height - this.ground.height)/2 + increment*this.pipeCount;
        } else {
            wallGroup.topPipe.anchor.setTo(0, 0);
            wallGroup.y = (this.game.height - this.ground.height)/2 - increment*this.pipeCount;
        }
        this.pipeCount++;

        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*3, this.generatePipes, this);
      };

	return Level;
});

