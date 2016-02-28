define([], function () {

  var Settingboard = function(game, isLevelCompleted) {
    
    var title;
    this.isLevelCompleted = isLevelCompleted;

    Phaser.Group.call(this, game);
    if (!isLevelCompleted) {
        var style = { font: "30px Snap ITC", fill: "#FCA048", align: "center" };
        title = this.game.add.text(this.game.width / 2, 150, "Upper Range Set", style);
        this.add(title);
    } else {
        var style = { font: "30px Snap ITC", fill: "#FCA048", align: "center" };
        title = this.game.add.text(this.game.width / 2, 150, "Lower Range Set", style);
        this.add(title);
    }
    title.anchor.setTo(0.5, 0.5);

    // // add our start button with a callback
    // this.startButton = this.game.add.button(this.game.width/2, 250, 'startButton', this.startClick, this);
    // this.startButton.anchor.setTo(0.5,0.5);
    // this.add(this.startButton);

    retry_label = this.game.add.text(this.game.width/2 - 80, 250, 'Retry', { font: '32px Arial', fill: '#fff' });
    retry_label.anchor.setTo(0.5, 0.5);
    retry_label.inputEnabled = true;
    retry_label.events.onInputUp.add(this.retryClick, this);
    this.add(retry_label);

    save_label = this.game.add.text(this.game.width/2 + 80, 250, 'Save', { font: '32px Arial', fill: '#fff' });
    save_label.anchor.setTo(0.5, 0.5);
    save_label.inputEnabled = true;
    save_label.events.onInputUp.add(this.saveClick, this);
    this.add(save_label);

    this.y = this.game.height;
    this.x = 0;
  };

  Settingboard.prototype = Object.create(Phaser.Group.prototype);
  Settingboard.prototype.constructor = Settingboard;

  Settingboard.prototype.show = function(score) {
    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
    this.game.events.onSettingSaved.dispatch(score, !this.isLevelCompleted);
  };

  Settingboard.prototype.saveClick = function() {
    if (this.isLevelCompleted) {
        this.game.state.start("levels");
    } else {
        // pass paramter doen't show menu (true) & high pitch set (true)
        this.game.state.restart(true, false, true, true);
    }
  };

  Settingboard.prototype.retryClick = function() {
      // pass paramter doen't show menu (true)
      if (this.isLevelCompleted) {
        this.game.state.restart(true, false, true, true);
      } else {
        this.game.state.restart(true, false, true);
      }
  };

  Settingboard.prototype.update = function() {
    // write your prefab's specific update code here
  };
  return Settingboard;
});