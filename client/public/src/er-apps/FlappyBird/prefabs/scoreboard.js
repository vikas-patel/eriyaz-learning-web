define(['phaser'], function (Phaser) {

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
    
    this.scoreText = this.game.add.bitmapText(this.scoreboard.width*1.5, 180, 'flappyfont', '', 18);
    this.add(this.scoreText);
    
    this.bestText = this.game.add.bitmapText(this.scoreboard.width*1.5, 230, 'flappyfont', '', 18);
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
    if(!!localStorage) {
      bestScore = localStorage.getItem('bestScore');
      if(!bestScore || bestScore < score) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
      }
    } else {
      bestScore = 'N/A';
    }

    this.bestText.setText(bestScore.toString());

    if(score >= 20 && score < 30)
    {
      medals = this.game.add.sprite(this.scoreboard.width-30, 150,'levels-trans', 1);
      this.totalStars = 1;
    } else if(score >= 30 && score < 40) {
      medals = this.game.add.sprite(this.scoreboard.width-30, 150,'levels-trans', 2);
      this.totalStars = 2;
    } else if (score >= 40) {
      medals = this.game.add.sprite(this.scoreboard.width-30, 150,'levels-trans', 3);
      this.totalStars = 3;
    }

    if (medals) this.add(medals);

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
  };

  Scoreboard.prototype.startClick = function(button) {
    if (this.isLevelCompleted) {
        // did we improved our stars in current level?
        if(this.game.starArray[this.game.level-1]<this.totalStars){
          this.game.starArray[this.game.level-1] = this.totalStars;
        }
        // if we completed a level and next level is locked - and exists - then unlock it
        if(this.totalStars>0 && this.game.starArray[this.game.level]==4 && this.game.level<this.game.starArray.length){
          this.game.starArray[this.game.level] = 0;
        }
        this.game.state.start("levels");
    } else {
        this.game.state.start('play');
    }
  };

  Scoreboard.prototype.update = function() {
    // write your prefab's specific update code here
  };
  return Scoreboard;
});