define([], function () {

  var VoiceSetting = function(game) {
    
    var title;

    Phaser.Group.call(this, game);
    var style = { font: "30px Snap ITC", fill: "#FCA048", align: "center" };
    title = this.game.add.text(this.game.width / 2, 150, "Your Voice is Set", style);
    this.add(title);
    title.anchor.setTo(0.5, 0.5);

    save_label = this.game.add.text(this.game.width/2, 250, 'Save', { font: '32px Arial', fill: '#fff' });
    save_label.anchor.setTo(0.5, 0.5);
    save_label.inputEnabled = true;
    save_label.events.onInputUp.add(this.saveClick, this);
    this.add(save_label);

    this.y = this.game.height;
    this.x = 0;
  };

  VoiceSetting.prototype = Object.create(Phaser.Group.prototype);
  VoiceSetting.prototype.constructor = VoiceSetting;

  VoiceSetting.prototype.show = function(rootNote) {
    this.rootNote = rootNote;
    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
  };

  VoiceSetting.prototype.saveClick = function() {
    this.game.events.onVoiceSaved.dispatch(this.game, this.rootNote);
    this.game.state.start("levels");
  };

  VoiceSetting.prototype.update = function() {
    // write your prefab's specific update code here
  };
  return VoiceSetting;
});