define([], function () {

  var Settingboard = function(game) {
    
    var title;

    Phaser.Group.call(this, game);
    var style = { font: "30px Snap ITC", fill: "#FCA048", align: "center" };
    title = this.game.add.text(this.game.width / 2, 150, "Your Voice Range Set", style);
    this.add(title);
    title.anchor.setTo(0.5, 0.5);

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

  Settingboard.prototype.show = function(upperNote, lowerNote) {
    this.upperNote = upperNote;
    this.lowerNote = lowerNote;
    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
  };

  Settingboard.prototype.saveClick = function() {
    this.game.events.onSettingSaved.dispatch(this.game, this.upperNote, this.lowerNote);
    this.game.state.start("levels");
  };

  Settingboard.prototype.retryClick = function() {
      // pass paramter doen't show menu (true)
      this.game.state.restart(true, false, true);
  };

  Settingboard.prototype.update = function() {
    // write your prefab's specific update code here
  };
  return Settingboard;
});