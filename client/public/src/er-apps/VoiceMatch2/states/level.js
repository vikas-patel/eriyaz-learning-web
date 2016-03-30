define(['d3', '../scorer', '../prefabs/scoreboard', '../levels'], function (d3, scorer, Scoreboard, Levels) {

	function Level() {
	}

	Level.prototype = {
	  preload: function() {
	  	
	  },
	  create: function() {
	  	// this.game.stage.backgroundColor = 0x996E99;
	  	this.game.stage.backgroundColor = 0xffffff;
	  	this.offsetTop = 35;
	  	this.background = this.game.add.sprite(this.game.width/2, this.offsetTop,'encourage');
	  	this.background.anchor.setTo(0.5, 0);
	  	// this.background = this.game.add.sprite(0,0,'background');
	  	// this.background.scale.setTo(654/1000,0.6);
	  	this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 26);
        this.scoreText.anchor.setTo(0.5, 0);

	  	var yMin = -2;
		var yMax = 12;
		this.yDivs = yMax - yMin;
		this.chartHeight = this.game.height - this.background.height - this.offsetTop;
		this.xDivs = 3;
		this.yScale = d3.scale.linear()
			.domain([yMin, yMax])
			.range([this.game.height, this.background.height + this.offsetTop]);

		this.xScale = d3.scale.linear()
			.domain([0, this.xDivs])
			.range([0, this.game.width]);

		this.timeScale = d3.scale.linear()
			.domain([0, this.game.beatDuration])
			.range([0, this.game.width / this.xDivs]);
	  	var xWidth = this.game.width/this.xDivs;
	  	var graphics = this.game.add.graphics();
	  	graphics.lineStyle(0);
	  	graphics.beginFill(0x329DD5, 1);
	  	// graphics.beginFill(0x329DD5, 1);
	  	graphics.drawRect(0, this.background.height+this.offsetTop, this.game.width, this.game.height - (this.background.height+this.offsetTop));
	  	graphics.endFill();
    	// graphics.beginFill(0xED3883, 0.8);
    	graphics.beginFill(0x078CFD, 1);
    	var notes = Levels[this.game.level-1].notes;
    	graphics.drawRect(xWidth, this.yScale(_.max(notes) + 1), xWidth, 
    		this.chartHeight*(_.max(notes)-_.min(notes)+1)/this.yDivs);
    	graphics.endFill();
	  	graphics.lineStyle(1, 0xd3d3d3, 1);
    	for (var i = yMin; i <= yMax; i++) {
    		graphics.moveTo(0, this.yScale(i));
    		graphics.lineTo(this.game.width, this.yScale(i));
    	}
    	// y axis
    	for (var j = 1; j < this.xDivs; j++) {
    		graphics.moveTo(this.xScale(j), this.game.height);
    		graphics.lineTo(this.xScale(j), this.background.height + this.offsetTop);
    	}
    	this.exerciseGraphics = this.game.add.graphics();
    	this.exerciseGraphics.beginFill(0xffffff, 0.7);
    	this.exerciseGraphics.lineStyle(0);

    	this.feedbackGraphics = this.game.add.graphics();
    	this.pitchGraphics = this.game.add.graphics();
    	this.pitchGraphics.beginFill(0x000000, 1);

    	this.animGraphics = this.game.add.graphics();
    	this.animGraphics.lineStyle(3, 0xFFCCCC, 1);
    	this.animGraphics.moveTo(0, 0);
    	this.animGraphics.lineTo(0, this.chartHeight*(_.max(notes)-_.min(notes)+1)/this.yDivs);

    	this.markLinePlay = this.game.add.sprite(this.xScale(0) + this.timeScale(this.game.beatDuration), 
    		this.yScale(_.max(notes)+1), this.animGraphics.generateTexture());
    	this.markLinePlay.visible = false;
    	
    	this.animGraphics.clear();
    	this.animGraphics.lineStyle(3, 0x00FF00, 1);
    	this.animGraphics.moveTo(0, 0);
    	this.animGraphics.lineTo(0, this.chartHeight*(_.max(notes)-_.min(notes)+1)/this.yDivs);
    	this.markLineSing = this.game.add.sprite(this.xScale(0) + this.timeScale(this.game.beatDuration), 
    		this.yScale(_.max(notes)+1), this.animGraphics.generateTexture());
    	this.markLineSing.visible = false;
    	this.markLinePlay.anchor.setTo(0.5, 0);
    	this.markLineSing.anchor.setTo(0.5, 0);

	    //  And destroy the original graphics object
	    this.animGraphics.destroy();
	    //animate
	    this.answerGraphics = this.game.add.graphics();
	    this.answerGroup = this.game.add.group();
	    this.style = {font: "12px Snap ITC", fill: "#FFFFFF", align: "center"};
	    this.scoreSound = this.game.add.audio('success');
	    this.lostSound = this.game.add.audio('failure');
	    this.gameOverSound = this.game.add.audio('gameover');
	    this.levelUpSound = this.game.add.audio('levelup');
	    this.scoreTotalTween = this.game.add.tween(this.scoreText.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
	    this.game.start();
	  },
	  markPitch: function(interval, time) {
	  	this.pitchGraphics.drawRect(this.timeScale(time), this.yScale(interval)-this.chartHeight/(2*this.yDivs), 3, 3);
	  },
	  drawExercise: function(note, offset) {
	  		this.exerciseGraphics.drawRect(this.xScale(0) + this.timeScale(offset), this.yScale(note + 1), 
	  			this.game.width/this.xDivs, this.chartHeight/this.yDivs);
	  },
	  drawRange: function(interval, count, offset, isSing) {
	  	this.markLinePlay.x = this.xScale(0) + this.timeScale(offset);
		this.markLineSing.x = this.xScale(0);
	  },
	  markAnswer: function(interval, time, diff, offset, isHint) {
	  	var cy = this.yScale(interval) - this.chartHeight/(2*this.yDivs);
		var cx = this.timeScale(time) + this.timeScale(offset);
		var symbol;
		var angle = 0;
		if (diff == 0) {
			symbol = "✔";
		} else if (!isHint) {
			symbol = "✖";
		} else if (diff < 0) {
			// can't find html5 upward heavy arrow.
			symbol = "➔";
			angle = -90;
		} else if (diff > 0) {
			symbol = "➔";
			angle = 90;
		}
	  	if (diff == 0) {
	  		this.answerGraphics.beginFill(0x00CC00, 1);
	  	} else {
	  		this.answerGraphics.beginFill(0xC82736, 1);
	  	}
	  	this.answerGraphics.lineStyle(0.5, 0x000000, 1);
	  	this.answerGraphics.drawCircle(cx, cy, this.chartHeight/(this.yDivs));
        var answer = this.game.add.text(cx, cy, symbol, this.style);
        if (angle == 0) {
        	answer.anchor.setTo(0.5, 0.3);
        } else {
        	answer.anchor.setTo(0.5, 0.4);
        }
        answer.angle = angle;
        this.answerGroup.add(answer);
	  },
	  clear: function() {
	  	this.exerciseGraphics.clear();
	  	this.exerciseGraphics.beginFill(0xffffff, 0.7);
    	this.exerciseGraphics.lineStyle(0);
	  	this.feedbackGraphics.clear();
	  	this.pitchGraphics.clear();
	  	this.pitchGraphics.beginFill(0x000000, 1);
	  },
	  clearAnswer: function() {
	  	this.answerGroup.removeAll();
		this.answerGraphics.clear();
	  },
	  markPitchFeedback: function(interval, time, status) {
	  	if (status === scorer.statuses.SPOT_ON)
			this.feedbackGraphics.beginFill(0x00FF00, 0.5);
		else if (status === scorer.statuses.NEAR_MISS)
			this.feedbackGraphics.beginFill(0xFFFF00, 0.5);
		else 
			this.feedbackGraphics.beginFill(0xFF0000, 0.5);
		this.feedbackGraphics.drawRect(this.timeScale(time), this.yScale(interval+1), 5, this.chartHeight/this.yDivs);
		this.feedbackGraphics.endFill();
	  },
	  animateMarker: function(interval, duration, noteNum, offset, state) {
	  	if (state == 'Play') {
	  		this.background.loadTexture('encourage');
	  		this.markLinePlay.visible = true;
		  	this.animPlay = this.game.add.tween(this.markLinePlay);
	    	this.animPlay.to({x: this.xScale(noteNum+1) + this.timeScale(offset)}, duration/2, 'Linear', true);
	    	// this.animPlay.start();
	  	} else {
	  		this.background.loadTexture('listen');
	  		this.markLineSing.visible = true;
	  		this.animSing = this.game.add.tween(this.markLineSing);
	    	this.animSing.to({x: this.xScale(noteNum+1) + this.timeScale(offset)}, duration/2, 'Linear');
	    	this.animSing.start();
	  	}
	  	
	  },
	  levelCompleted: function() {
	  		this.levelUpSound.play();
            this.scoreboard = new Scoreboard(this.game, true);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);
      },
      gameOver: function() {
      		this.gameOverSound.play();
            this.scoreboard = new Scoreboard(this.game, false);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);
      },
      failed: function() {
	  	this.lostSound.play();
	  	this.background.loadTexture('sad');
	  },
	  addScore: function(score) {
	  	var me = this;
	  	this.scoreSound.play();
	  	this.background.loadTexture('happy');
	  	this.score += score;
	  	var scoreFont = "30px Arial";
	  	var scoreText = score == 10 ? "Perfect 10": '+'+score.toString();
    	//Create a new label for the score
    	var scoreAnimation = this.game.add.text(this.game.width/2, this.game.height - this.chartHeight/2, scoreText, {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 5}); 
		scoreAnimation.anchor.setTo(0.5, 0);
	    scoreAnimation.align = 'center';
	    //Tween this score label to the total score label
	    var scoreTween = this.game.add.tween(scoreAnimation).to({x:this.game.width/2, y: 10}, 800, Phaser.Easing.Exponential.In, true);
	    //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
	    scoreTween.onComplete.add(function(){
	        scoreAnimation.destroy();
	        me.scoreText.setText(me.score.toString());
	        me.scoreTotalTween.start();
	    }, me);
	  }
	};
	return Level;
});