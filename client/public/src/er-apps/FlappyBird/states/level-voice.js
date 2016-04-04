define(['d3', '../prefabs/bird', '../prefabs/ground', '../prefabs/slider',
    '../prefabs/voice-setting', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchcustomdetector', 'music-calc', 'intensityfilter'], 
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

        MicUtil.getMicAudioStream(
            function(stream) {
              buffer = new AudioBuffer(audioContext, stream, 1024);
              buffer.addProcessor(updatePitch);
            }
          );
        var audioContext = CurrentAudioContext.getInstance();
        var detector = PitchDetector.getDetector(audioContext.sampleRate, this.game.isMan);

        var playObj = this;
        var updatePitch = function(data) {
           
            var pitch = detector.findPitch(data);
             // range 0-1
            var volume = 2*IntensityFilter.rootMeanSquare(data);
            if (volume < playObj.game.noise/100) return;
            if (!playObj.start) {
                if (!playObj.bird.animate().isRunning) playObj.bird.animate().start();
            }
            if (pitch == 0) return;
            // can't be human voice
            if (pitch > 1400) return;
            playObj.updatePitch(pitch);
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
            this.slider = new Slider(this.game, this.instructionGroup, this.game.width/2, 265, 100);
            this.instructionGroup.setAll('anchor.x', 0.5);
            this.instructionGroup.setAll('anchor.y', 0.5);
        } else {
            // Level restart, don't show menu again
            this.startGame();
        }
      },
      updatePitch: function(pitch) {
            currentNote = MusicCalc.freqToMidiNum(pitch);
            // if (!this.gameover) console.log(Math.round(currentNote));
            if (currentNote >= this.lowerNoteLimit && currentNote <= this.upperNoteLimit) {
                if (this.start) {
                    this.arrayPitch.push(Math.round(currentNote));
                    this.bird.x += 10;
                }
            }
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
        this.scoreboard.destroy();
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