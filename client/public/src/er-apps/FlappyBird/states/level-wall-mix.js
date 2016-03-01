define(['./level-wall', '../prefabs/PipeGroup', '../prefabs/starGroup', '../prefabs/wallGroup'], function (Parent, PipeGroup, StarGroup, WallGroup) {

	function Level() {
	}

	Level.prototype = Object.create(Parent.prototype);
	Level.prototype.constructor = Parent;

	Level.prototype.generatePipes = function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
            return;
        }
        var random;
        if (this.pipeCount < this.maxPipeCount/5) {
            random = this.game.rnd.integerInRange(1, 2);
        } else if (this.pipeCount < this.maxPipeCount/3){
            random = this.game.rnd.integerInRange(2, 4);
        } else if (this.pipeCount < this.maxPipeCount/2) {
            random = this.game.rnd.integerInRange(3, 5);
        } else {
            random = this.game.rnd.integerInRange(3, 7);
        }
        var randomSeq = this.game.rnd.integerInRange(1, 4);

        for (var i = 0; i < random; i++) {
            if (randomSeq == 1) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -200);
                this.starY1 = 160;
            } else if (randomSeq == 2) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -330);
                this.starY1 = 30;
            } else if (randomSeq == 3) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -180 - 30*i);
                this.starY1 = -180 - 30*(random-1) + 360;
            } else if (randomSeq == 4) {
                this.subPipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.2*i, this.generateSubPipes, this, -330 + 30*i);
                this.starY1 = -330 + 30*(random-1) + 360;
            }
            this.subPipeGenerator.timer.start();
        }
        this.starY2 = this.starY1 + 160;
        this.createStars(3.5*200 + random*40 + 50);
        this.createStars(3.5*200 + random*40 + 50);
        this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*(3.5+0.2*random), this.generatePipes, this);
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

