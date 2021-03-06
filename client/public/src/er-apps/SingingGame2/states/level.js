define(['d3', '../scorer', '../prefabs/scoreboard', '../levels'], function (d3, scorer, Scoreboard, Levels) {

	function Level() {
	}

	Level.prototype = {
	  preload: function() {
	  	
	  },
	  create: function() {
	  	this.game.stage.backgroundColor = 0x996E99;
	  	this.background = this.game.add.sprite(0,0,'background');
	  	this.background.scale.setTo(820/1000,0.6);
	  	this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 26);
        this.scoreText.anchor.setTo(0.5, 0);

        this.messageText = this.game.add.text(this.game.width/2, this.background.height - 10, "", {
	        font: "30px Arial",
	        fill: "#ffff00",
	        align: "center"
	    });

	    this.messageText.anchor.setTo(0.5, 0.5);

	  	var yMin = -2;
		var yMax = 12;
		this.yDivs = yMax - yMin;
		this.chartHeight = this.game.height - this.background.height;
		this.xDivs = 7;
		this.yScale = d3.scale.linear()
			.domain([yMin, yMax])
			.range([this.game.height, this.background.height]);

		this.xScale = d3.scale.linear()
			.domain([0, this.xDivs])
			.range([0, this.game.width]);

		this.timeScale = d3.scale.linear()
			.domain([0, 1000])
			.range([0, this.game.width / this.xDivs]);
	  	var xWidth = this.game.width/this.xDivs;
	  	var graphics = this.game.add.graphics();
	  	graphics.lineStyle(0);
    	graphics.beginFill(0xB66DBF, 1);
    	var maxNotes = Levels[this.game.level-1].exercises[0].length;
    	graphics.drawRect(xWidth, this.background.height, xWidth*maxNotes, this.chartHeight);
    	graphics.endFill();
	  	graphics.lineStyle(1, 0xd3d3d3, 1);
	  	var labelsData = ["S", "", "R", "", "G", "m", "", "P", "", "D", "", "N", "S'"];
    	for (var i = yMin; i <= yMax; i++) {
    		graphics.moveTo(0, this.yScale(i));
    		graphics.lineTo(this.game.width, this.yScale(i));
    		
    		if (i >= 0 && i < 12) {
    			var label = labelsData[(12 + i) % 12];
    			var text = this.game.add.text(10, this.yScale(i+0.5), label, {
						        font: "10px Arial",
						        fill: "#ffffff"
						    }).anchor.setTo(0,0.4);
    		}
    	}

    	for (var j = 1; j < this.xDivs; j++) {
    		graphics.moveTo(this.xScale(j), this.game.height);
    		graphics.lineTo(this.xScale(j), this.background.height);
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
    	this.animGraphics.lineTo(0, this.yScale(0) - this.yScale(4));

    	this.markLinePlay = this.game.add.sprite(this.xScale(0) + this.timeScale(1000), this.yScale(4), this.animGraphics.generateTexture());
    	this.markLinePlay.visible = false;
    	
    	this.animGraphics.clear();
    	this.animGraphics.lineStyle(3, 0x00FF00, 1);
    	this.animGraphics.moveTo(0, 0);
    	this.animGraphics.lineTo(0, this.yScale(0) - this.yScale(4));
    	this.markLineSing = this.game.add.sprite(this.xScale(0) + this.timeScale(1000), this.yScale(4), this.animGraphics.generateTexture());
    	this.markLineSing.visible = false;
    	this.markLinePlay.anchor.setTo(0.5, 1.0);
    	this.markLineSing.anchor.setTo(0.5, 1.0);
	    //  And destroy the original graphics object
	    this.animGraphics.destroy();
	    //animate
	    this.answerGraphics = this.game.add.graphics();
	    this.answerGroup = this.game.add.group();
	    this.style = {font: "12px Snap ITC", fill: "#FFFFFF", align: "center"};
	    this.rangeGraphics = this.game.add.graphics();
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
	  drawExercise: function(excData, offset) {
	  	for (var i = 0; i < excData.length; i++) {
	  		this.exerciseGraphics.drawRect(this.xScale(i) + this.timeScale(offset), this.yScale(excData[i] + 1), 
	  			this.game.width/this.xDivs, this.chartHeight/this.yDivs);
	  	}
	  },
	  drawRange: function(interval, count, offset, isSing) {
	  	this.markLinePlay.height = this.chartHeight*(interval+1)/this.yDivs;
	  	this.markLineSing.height = this.chartHeight*(interval+1)/this.yDivs;
	  	this.markLinePlay.x = this.xScale(0) + this.timeScale(offset);
		this.markLinePlay.y = this.yScale(0);
		this.markLineSing.x = this.xScale(0);
		this.markLineSing.y = this.yScale(0);
	  	this.rangeGraphics.drawRect(this.xScale(0) + this.timeScale(offset),  this.yScale(interval) - this.chartHeight/this.yDivs,
	  		this.game.width*count/this.xDivs, this.chartHeight*(interval+1)/this.yDivs);
	  },
	  markAnswer: function(interval, time, isCorrect, offset) {
	  	var cy = this.yScale(interval) - this.chartHeight/(2*this.yDivs);
		var cx = this.timeScale(time) + this.timeScale(offset);
	  	if (isCorrect) {
	  		this.answerGraphics.beginFill(0x00CC00, 1);
	  	} else {
	  		this.answerGraphics.beginFill(0xC82736, 1);
	  	}
	  	this.answerGraphics.lineStyle(0.5, 0x000000, 1);
	  	this.answerGraphics.drawCircle(cx, cy, this.chartHeight/(this.yDivs));
        var answer = this.game.add.text(cx, cy, isCorrect?"✔":"✖", this.style);
        answer.anchor.setTo(0.5, 0.3);
        this.answerGroup.add(answer);
	  },
	  clear: function() {
	  	this.exerciseGraphics.clear();
	  	this.exerciseGraphics.beginFill(0xffffff, 0.7);
    	this.exerciseGraphics.lineStyle(0);
	  	this.feedbackGraphics.clear();
	  	this.pitchGraphics.clear();
	  	this.pitchGraphics.beginFill(0x000000, 1);
		this.answerGroup.removeAll();
		this.answerGraphics.clear();
		this.rangeGraphics.clear();
		this.rangeGraphics.lineStyle(1, 0x00CC00, 1);
	  },
	  markPitchFeedback: function(interval, time, status) {
	  	// if (status === scorer.statuses.SPOT_ON)
		this.feedbackGraphics.beginFill(0x00FF00, 0.5);
		// else if (status === scorer.statuses.NEAR_MISS)
		// 	this.feedbackGraphics.beginFill(0xFFFF00, 0.5);
		// else 
		// 	this.feedbackGraphics.beginFill(0xFF0000, 0.5);
		this.feedbackGraphics.drawRect(this.timeScale(time), this.yScale(interval+1), 5, this.chartHeight/this.yDivs);
		this.feedbackGraphics.endFill();
	  },
	  animateMarker: function(interval, duration, noteNum, offset, state) {
	  	if (state == 'Play') {
	  		this.markLinePlay.visible = true;
		  	this.animPlay = this.game.add.tween(this.markLinePlay);
	    	this.animPlay.to({x: this.xScale(noteNum+1) + this.timeScale(offset)}, duration, 'Linear', true);
	    	// this.animPlay.start();
	  	} else {
	  		this.markLineSing.visible = true;
	  		this.animSing = this.game.add.tween(this.markLineSing);
	    	this.animSing.to({x: this.xScale(noteNum+1) + this.timeScale(offset)}, duration, 'Linear');
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
	  },
	  showMessage: function(msg) {
	  	this.messageText.setText(msg);
	  },
	  hideMessage: function() {
	  	this.messageText.setText("");
	  },
	  showLevelUp: function() {
	  	var me = this;
	  	var scoreFont = "30px Arial";
	  	var scoreText = "Level Up";
    	//Create a new label for the score
    	var scoreAnimation = this.game.add.text(this.game.width/2, this.game.height - this.chartHeight/2, scoreText, {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 5}); 
		scoreAnimation.anchor.setTo(0.5, 0);
	    scoreAnimation.align = 'center';
	    //Tween this score label to the total score label
	    var scoreTween = this.game.add.tween(scoreAnimation).to({x:this.game.width/2, y: 10}, 800, Phaser.Easing.Exponential.In, true);
	    //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
	    scoreTween.onComplete.add(function(){
	        scoreAnimation.destroy();
	    }, me);
	  },
	  addScore: function(score) {
	  	var me = this;
	  	this.scoreSound.play();
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