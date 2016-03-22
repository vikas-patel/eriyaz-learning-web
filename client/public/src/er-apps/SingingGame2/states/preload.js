define([], function () {
  function Preload() {
    this.asset = null;
    this.ready = false;
  }

  Preload.prototype = {
    preload: function() {
      this.asset = this.add.sprite(0,this.game.height/2, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.image('background', 'er-apps/SingingGame2/assets/background.jpg');

      this.load.image('startButton', 'er-apps/FlappyBird/assets/start-button.png');
      this.load.image('scoreboard', 'er-apps/FlappyBird/assets/scoreboard.png');
      this.load.image('gameover', 'er-apps/FlappyBird/assets/gameover.png');
      this.load.image('levelup', 'er-apps/FlappyBird/assets/levelup.png');
      this.load.spritesheet("levels", "er-apps/FlappyBird/assets/levels.png", 64, 64, 5);
      this.load.spritesheet("levels-trans", "er-apps/FlappyBird/assets/levels-trans.gif", 64, 64, 5);
      // sound
      this.load.audio('success', 'er-apps/SingingGame2/assets/success.wav');
      this.load.audio('failure', 'er-apps/SingingGame2/assets/failure.wav');
      this.load.audio('gameover', 'er-apps/SingingGame2/assets/game-over.wav');
      this.load.audio('levelup', 'er-apps/SingingGame2/assets/level-up.wav');
      // font
      this.load.bitmapFont('flappyfont', 'er-apps/FlappyBird/assets/fonts/flappyfont/flappyfont.png', 'er-apps/FlappyBird/assets/fonts/flappyfont/flappyfont.fnt');

    },
    create: function() {
      this.asset.cropEnabled = false;
    },
    update: function() {
      if(!!this.ready) {
        //this.game.state.start('menu');
        this.game.state.start('levelboard');
      }
    },
    onLoadComplete: function() {
      this.ready = true;
    }
  };
  return Preload;
});