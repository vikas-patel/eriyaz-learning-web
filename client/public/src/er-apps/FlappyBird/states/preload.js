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
      this.load.image('background', 'er-apps/FlappyBird/assets/background.png');
      this.load.image('ground', 'er-apps/FlappyBird/assets/ground.png');
      this.load.image('cloud', 'er-apps/FlappyBird/assets/cloud.png');
      this.load.image('stone', 'er-apps/FlappyBird/assets/stone.png');
      this.load.image('title', 'er-apps/FlappyBird/assets/title.png');
      this.load.spritesheet('bird', 'er-apps/FlappyBird/assets/bird.png', 34,24,3);
      this.load.spritesheet('pipe', 'er-apps/FlappyBird/assets/pipes.png', 54,320,2);
      this.load.image('wall', 'er-apps/FlappyBird/assets/wall_40x360.png');
      this.load.image('startButton', 'er-apps/FlappyBird/assets/start-button.png');
      
      this.load.image('instructions', 'er-apps/FlappyBird/assets/instructions.png');
      this.load.image('getReady', 'er-apps/FlappyBird/assets/get-ready.png');
      
      this.load.image('scoreboard', 'er-apps/FlappyBird/assets/scoreboard.png');
      this.load.spritesheet('medals', 'er-apps/FlappyBird/assets/medals.png',44, 46, 2);
      this.load.image('gameover', 'er-apps/FlappyBird/assets/gameover.png');
      this.load.image('levelup', 'er-apps/FlappyBird/assets/levelup.png');
      this.load.image('particle', 'er-apps/FlappyBird/assets/particle.png');
      this.load.image('star', 'er-apps/FlappyBird/assets/star.png');
      this.load.spritesheet("levels", "er-apps/FlappyBird/assets/levels.png", 64, 64, 5);
      this.load.spritesheet("levels-trans", "er-apps/FlappyBird/assets/levels-trans.gif", 64, 64, 5);

      this.load.audio('flap', 'er-apps/FlappyBird/assets/flap.wav');
      this.load.audio('pipeHit', 'er-apps/FlappyBird/assets/pipe-hit.wav');
      this.load.audio('groundHit', 'er-apps/FlappyBird/assets/ground-hit.wav');
      this.load.audio('score', 'er-apps/FlappyBird/assets/score.wav');
      this.load.audio('ouch', 'er-apps/FlappyBird/assets/ouch.wav');

      this.load.bitmapFont('flappyfont', 'er-apps/FlappyBird/assets/fonts/flappyfont/flappyfont.png', 'er-apps/FlappyBird/assets/fonts/flappyfont/flappyfont.fnt');

    },
    create: function() {
      this.asset.cropEnabled = false;
    },
    update: function() {
      if(!!this.ready) {
        //this.game.state.start('menu');
        this.game.state.start('levels');
      }
    },
    onLoadComplete: function() {
      this.ready = true;
    }
  };
  return Preload;
});