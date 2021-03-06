define(['d3', '../prefabs/bird', '../prefabs/ground', '../prefabs/slider',
    '../prefabs/voice-setting', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'music-calc', 'intensityfilter'], 
    function (d3, Bird, Ground, Slider, Scoreboard, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, 
        MusicCalc, IntensityFilter) {
    function Level() {
        
    }
    Level.prototype = {

        init: function(hideMenu) { 
            if (hideMenu) {
                this.hideMenu = true;
            } else {
                this.hideMenu = false;
            }
        },
      create: function() {
        // start the phaser arcade physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.start = false;
        this.arrayPitch = [];
        //this.game.level = 1;

        // add the background sprite
        this.background = this.game.add.sprite(0,0,'background');

        // create and add a new Ground object
        this.ground = new Ground(this.game, 0, 400, 720, 112);
        this.game.add.existing(this.ground);
        this.exit = this.game.add.sprite(this.game.width, this.game.height-this.ground.height,'exit');
        this.exit.anchor.setTo(1, 1);

        var back_button = this.game.add.text(20, 15, '➜', { font: '28px Arial', fill: '#fff' });
        back_button.anchor.setTo(0.5, 0.5);
        back_button.angle = 180;
        back_button.inputEnabled = true;
        back_button.events.onInputUp.add(function() {this.game.state.start("levels");}, this);

        this.slider = new Slider(this.game, this.game.width-21, this.game.height/2-140, 200);

        // create and add a new Bird object
        this.bird = new Bird(this.game, 100, this.game.height/2);
        this.game.add.existing(this.bird);

         if (this.game.gender == "man") {
            this.upperNoteLimit = 65;
            this.lowerNoteLimit = 40;
        } else {
            this.upperNoteLimit = 76;
            this.lowerNoteLimit = 51;
        }
        var playObj = this;
        MicUtil.getMicAudioStream(
            function(stream) {
                playObj.stream = stream;
              buffer = new AudioBuffer(audioContext, stream, 2048);
              buffer.addProcessor(updatePitch);
            }
          );
        var audioContext = CurrentAudioContext.getInstance();
        var detector = PitchDetector.getDetector('yin', audioContext.sampleRate);

        var updatePitch = function(data) {
            // range 0-1
            var volume = 2*IntensityFilter.rootMeanSquare(data);
            playObj.slider.setVolume(volume);
            if (volume < playObj.game.noise/100) return;
           
            var pitchAndProb = detector.findPitch(data);
            if (!pitchAndProb) return;
            var probability = pitchAndProb[1];
            var pitch = pitchAndProb[0];

          if (pitch == 0) return;
            // can't be human voice
            if (pitch > 1400) return;
            if (probability < 0.95) return;

            
            playObj.updatePitch(pitch, probability);
        };

        this.gameover = false;

        this.instructionGroup = this.game.add.group();
        if (!this.hideMenu) {
            // add keyboard controls
            this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.flapKey.onDown.addOnce(this.startGame, this);
            //this.flapKey.onDown.add(this.bird.flap, this.bird);
            // add mouse/touch controls
            // this.game.input.onDown.addOnce(this.startGame, this);
            //this.game.input.onDown.add(this.bird.flap, this.bird);
        
            // keep the spacebar from propogating up to the browser
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
            this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 80,'getReady'));
            this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 185,'instructions-voice'));
            var startButton = this.game.add.sprite(this.game.width/2, 345,'startButton');
            startButton.inputEnabled = true;
            startButton.events.onInputDown.add(this.startGame, this);
            this.instructionGroup.add(startButton);
            this.instructionGroup.setAll('anchor.x', 0.5);
            this.instructionGroup.setAll('anchor.y', 0.5);
        } else {
            // Level restart, don't show menu again
            this.startGame();
        }
      },
      updatePitch: function(pitch, prob) {
            currentNote = MusicCalc.freqToMidiNum(pitch);
            console.log(currentNote);
            // if (!this.gameover) console.log(Math.round(currentNote));
            // if (currentNote >= this.lowerNoteLimit && currentNote <= this.upperNoteLimit) {
                if (this.start) {
                    this.arrayPitch.push(Math.round(currentNote));
                    this.bird.x += 5;
                }
            // }
      },
      update: function() {
            // check if bird reached to end point
            if (this.bird.x >= this.game.width-this.exit.width/2 && !this.gameover) {
                this.levelCompleted();
            }
      },
      shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        if(this.scoreboard) this.scoreboard.destroy();
        this.slider.destroy();
      },
      startGame: function() {
        if(!this.bird.alive && !this.gameover) {
            // this.bird.body.allowGravity = true;
            this.bird.alive = true;
            this.start = true;
            this.instructionGroup.destroy();
        }
      },
      levelCompleted: function() {
            this.scoreboard = new Scoreboard(this.game, true);
            this.game.add.existing(this.scoreboard);
            var rootNote = this.mode(this.arrayPitch);
            console.log("rootNote:"+rootNote);
            this.scoreboard.show(rootNote);
            this.gameover = true;
            // this.bird.kill();
            this.ground.stopScroll();
      },
      mode : function(list) {
        return _.chain(list).countBy().pairs().max(_.last).head().value();
      }
    };
    return Level;
});