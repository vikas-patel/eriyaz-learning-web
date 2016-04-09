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
    Level.prototype.postCreate = function() {
        // if (this.highPitchSet) {
        //     this.game.physics.arcade.gravity.y = -1;
        // } else {
        //     this.game.physics.arcade.gravity.y = 1;
        // }
        this.bird.body.allowGravity = true;
        this.yScale = d3.scale.linear()
            .domain([-12, 12])
            .range([this.game.height - 80, 0]);
        this.maxPipeCount = 10;
        console.log(this.game.gender);
        if (this.game.gender == "man") {
            this.rootNote = 50;
        } else if (this.game.gender == "child") {
            this.rootNote = 65;
        } else {
            this.rootNote = 61;
        }
        this.rootFreq = MusicCalc.midiNumToFreq(this.rootNote);
        this.iterate = 0;
        this.upperNote = this.rootNote;
        this.lowerNote = this.rootNote;
        this.isUp = true;
        this.isDown = false;
        this.pipeInGroup = 10;
        this.lastHighWall = null;
    };

    Level.prototype.shutdown = function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        this.pipes.destroy();
        if (this.board) this.board.destroy();
        this.stream.getTracks()[0].stop();
    };

    Level.prototype.update = function() {
         Parent.prototype.update.call(this);
         if (this.lastHighWall && !this.isDown && this.lastHighWall.topPipe.world.x + 100 <= this.bird.world.x) {
            this.isUp = false;
            this.isDown = true;
         }
    };

    Level.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
            pipeGroup.hasScored = true;
            if (this.isUp) {
                this.upperNote++;
                this.score++;
                this.scoreSound.play();
            } else if (this.isDown) {
                this.lowerNote--;
                this.score++;
                this.scoreSound.play();
            }
            this.scoreText.setText(this.score.toString());
        }
    };

    Level.prototype.deathHandler = function() {
        if (this.isDown) {
            this.levelCompleted();
            return;
        } else {
            this.isUp = false;
            this.bird.x = 120;
        }
    };

    Level.prototype.levelCompleted = function() {
        console.log(this.upperNote + " " + this.lowerNote);
        this.board = new Settingboard(this.game);
        this.game.add.existing(this.board);
        this.board.show(this.upperNote, this.lowerNote);
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
    };

    Level.prototype.updatePitch = function(pitch) {
        currInterval = Math.round(1200 * Math.log(pitch/this.rootFreq) / Math.log(2))/100;
        if (currInterval > -15 && currInterval < 18) {
            this.bird.flap(this.yScale(currInterval));
        }
    };

	Level.prototype.generatePipes = function() {
        if (this.iterate == 2) {
            this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*1, this.levelCompleted, this);
            return;
        }
        var jump = (this.game.height - this.ground.height)/24;
        if (this.iterate == 0) {
            this.isDown = false;
            this.isUp = true;
            for (var i = 0; i < this.pipeInGroup; i++) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.1*i, this.generateHighPitchPipes, this, i*jump);
                this.subPipeGenerator.timer.start();
            }
        } else {
            for (var i = 0; i < this.pipeInGroup; i++) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.1*i, this.generateLowPitchPipes, this, i*jump);
                this.subPipeGenerator.timer.start();
            }
        }
        this.iterate++;
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*5, this.generatePipes, this);
      };

      Level.prototype.generateLowPitchPipes = function(increment) {
        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = this.game.add.group(this.pipes);
            wallGroup.topPipe = new Wall(this.game, 0, 0);
            wallGroup.add(wallGroup.topPipe);
        }
        wallGroup.setAll('body.velocity.x', -200);
        wallGroup.x = this.game.width;
        wallGroup.topPipe.anchor.setTo(0, 1);
        wallGroup.y = (this.game.height - this.ground.height)/2 + increment;
        this.pipeCount++;
    };

    Level.prototype.generateHighPitchPipes = function(increment) {
        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = this.game.add.group(this.pipes);
            wallGroup.topPipe = new Wall(this.game, 0, 0);
            wallGroup.add(wallGroup.topPipe);
        }
        wallGroup.setAll('body.velocity.x', -200);
        wallGroup.x = this.game.width;
        wallGroup.topPipe.anchor.setTo(0, 0);
        wallGroup.y = (this.game.height - this.ground.height)/2 - increment;
        this.lastHighWall = wallGroup;
        this.pipeCount++;
    };

	return Level;
});

