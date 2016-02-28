define([], function () {

  var Scoreboard = function(game, isLevelCompleted) {
    
    var title;
    this.isLevelCompleted = isLevelCompleted;

    Phaser.Group.call(this, game);
    if (isLevelCompleted) {
        var style = { font: "30px Snap ITC", fill: "#FCA048", align: "center" };
        title = this.game.add.text(this.game.width / 2, 100, "Level Up", style);
        this.add(title);
    } else {
        title = this.create(this.game.width / 2, 100, 'gameover');
    }
    title.anchor.setTo(0.5, 0.5);

    this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
    this.scoreboard.anchor.setTo(0.5, 0.5);
    
    this.scoreText = this.game.add.bitmapText(this.game.width/2 + this.scoreboard.width*0.25, 180, 'flappyfont', '', 18);
    this.add(this.scoreText);
    
    this.bestText = this.game.add.bitmapText(this.game.width/2 + this.scoreboard.width*0.25, 230, 'flappyfont', '', 18);
    this.add(this.bestText);

    // add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);

    this.add(this.startButton);

    this.y = this.game.height;
    this.x = 0;
    
  };

  Scoreboard.prototype = Object.create(Phaser.Group.prototype);
  Scoreboard.prototype.constructor = Scoreboard;

  Scoreboard.prototype.show = function(score) {
    var medals, bestScore;
    this.scoreText.setText(score.toString());
    var bestScore = this.game.starArray[this.game.level-1].score;
    if(!bestScore || bestScore < score) {
      bestScore = score;
    }

    this.bestText.setText(bestScore.toString());

    if(score >= 20 && score < 40)
    {
      medals = this.game.add.sprite(this.game.width/2 - this.scoreboard.width*0.4, 150,'levels-trans', 1);
      this.totalStars = 1;
    } else if(score >= 40 && score < 60) {
      medals = this.game.add.sprite(this.game.width/2 - this.scoreboard.width*0.4, 150,'levels-trans', 2);
      this.totalStars = 2;
    } else if (score >= 60) {
      medals = this.game.add.sprite(this.game.width/2 - this.scoreboard.width*0.4, 150,'levels-trans', 3);
      this.totalStars = 3;
    }

    if (medals) this.add(medals);

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
    if (this.isLevelCompleted) {
      this.game.events.onLevelCompleted.dispatch(this.game.level, this.totalStars, score);
    } else {
      this.game.events.onLevelCompleted.dispatch(this.game.level, 0, score);
    }
  };

  Scoreboard.prototype.startClick = function(button) {
    if (this.isLevelCompleted) {
        this.game.state.start("levels");
    } else {
        // pass paramter true, doen't show menu
        this.game.state.restart(true, false, true);
    }
  };

  Scoreboard.prototype.update = function() {
    // write your prefab's specific update code here
  };
  return Scoreboard;
});