define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup', '../prefabs/wallGroup'], function (Parent, PipeGroup, StarGroup, WallGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;
	Level.prototype.checkScore = function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && 
        	(pipeGroup.topWall.world.x <= this.bird.world.x)) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
      };
    Level.prototype.postCreate = function() {
        this.game.physics.arcade.gravity.y = 50;
        this.bird.body.allowGravity = true;
        this.yScale = d3.scale.linear()
            .domain([0, 12])
            .range([this.game.height - 80, 0]);
    };

    // Level.prototype.update = function() {
    //     Parent.prototype.update.call(this);
    //     if(!this.gameover) {
    //         this.game.physics.arcade.overlap(this.bird, this.brickGroup, this.deathHandler, null, this);
    //     }
    // };

    // Level.prototype.deathHandler = function() {
    //     if(!this.gameover) {
    //         // this.pipeHitSound.play();
    //     }
    // };

	Level.prototype.generatePipes = function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
            return;
        }
        this.pipeCount++;
        var random = this.game.rnd.integerInRange(1, 5);

        for (var i = 0; i < random; i++) {
            this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -200);
            this.subPipeGenerator.timer.start();
        }
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*5, this.generatePipes, this);
      };

    Level.prototype.generateSubPipes = function(y) {
        var wallGroup = this.pipes.getFirstExists(false);
        if(!wallGroup) {
            wallGroup = new WallGroup(this.game, this.pipes, 160);
        }
        wallGroup.reset(this.game.width, y);
        this.pipeCount++;
    };

	return Level;
});

