define(['d3', '../prefabs/bird', '../prefabs/ground', '../prefabs/pipe', '../prefabs/slider', '../prefabs/pipeGroup', '../prefabs/starGroup', 
    '../prefabs/scoreboard', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchcustomdetector', 'music-calc', 'intensityfilter'], 
    function (d3, Bird, Ground, Pipe, Slider, PipeGroup, StarGroup, Scoreboard, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, 
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

        // give our world an initial gravity of 1200
        // this.game.physics.arcade.gravity.y = 200;

        this.maxPipeCount = 20;
        this.pipeCount = 0;
        this.pipeDelay = 3200;
        this.start = false;
        //this.game.level = 1;

        // add the background sprite
        this.background = this.game.add.sprite(0,0,'background');

        // create and add a group to hold our pipeGroup prefabs
        this.pipes = this.game.add.group();
        this.stars = this.game.add.group();

        // create and add a new Ground object
        this.ground = new Ground(this.game, 0, 400, 720, 112);
        this.game.add.existing(this.ground);

        var back_button = this.game.add.text(20, 15, '➜', { font: '28px Arial', fill: '#fff' });
        back_button.anchor.setTo(0.5, 0.5);
        back_button.angle = 180;
        back_button.inputEnabled = true;
        back_button.events.onInputUp.add(function() {this.game.state.start("levels");}, this);

        this.graphics = this.game.add.graphics();
        this.graphics.lineStyle(2, 0xD6D6D6, 1);
        this.graphics.moveTo(0, 1);
        this.graphics.lineTo(this.game.width, 1);
        this.graphics.lineStyle(2, 0xF12B24, 1);
        this.graphics.moveTo(0,1);
        // create and add a new Bird object
        this.bird = new Bird(this.game, 100, this.game.height/2);
        this.game.add.existing(this.bird);
        var playObj = this;
        MicUtil.getMicAudioStream(
            function(stream) {
              playObj.stream = stream;
              buffer = new AudioBuffer(audioContext, stream, 1024);
              buffer.addProcessor(updatePitch);
            }
          );
        var audioContext = CurrentAudioContext.getInstance();
        var detector = PitchDetector.getDetector(audioContext.sampleRate, this.game.isMan);
        if (this.game.gender == "man") {
            this.upperNoteLimit = 63;
            this.lowerNoteLimit = 43;
        } else if (this.game.gender == "child") {
            this.upperNoteLimit = 74;
            this.lowerNoteLimit = 54;
        } else {
            this.upperNoteLimit = 74;
            this.lowerNoteLimit = 54;
        }
        this.yScale = d3.scale.linear()
            .domain([this.game.lowerNote, this.game.upperNote])
            .range([this.game.height - 124, 0]);
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

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);

        this.pipeGenerator = null;
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
            this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 60,'getReady'));
            this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 185,'instructions'));
            var startButton = this.game.add.sprite(this.game.width/2, 355,'startButton');
            startButton.inputEnabled = true;
            startButton.events.onInputDown.add(this.startGame, this);
            this.instructionGroup.add(startButton);
            this.slider = new Slider(this.game, this.instructionGroup, this.game.width/2, 285, 100);
            this.instructionGroup.setAll('anchor.x', 0.5);
            this.instructionGroup.setAll('anchor.y', 0.5);
        } else {
            // Level restart, don't show menu again
            this.startGame();
        }

        this.pipeHitSound = this.game.add.audio('pipeHit');
        this.groundHitSound = this.game.add.audio('groundHit');
        this.scoreSound = this.game.add.audio('score');
        this.postCreate();
        //TODO: star collect sound
        
      },
      postCreate: function() {
        // Abstract method
        // Initialize level specific variables
      },
      updatePitch: function(pitch) {
            currentNote = MusicCalc.freqToMidiNum(pitch);
            // if (!this.gameover) console.log(Math.round(currentNote));
            if (currentNote >= this.game.lowerNote-1 && currentNote <= this.game.upperNote+1) {
                this.bird.flap(this.yScale(currentNote));
            }
      },
      update: function() {
        this.game.physics.arcade.collide(this.bird, this.ground);
        if(!this.gameover) {
            // enable collisions between the bird and the ground
            // this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

            // enable collisions between the bird and each group in the pipes group
            this.pipes.forEach(function(pipeGroup) {
                this.checkScore(pipeGroup);
                this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
            }, this);

            this.stars.forEach(function(starGroup) {
                this.game.physics.arcade.overlap(this.bird, starGroup, this.collectStar, null, this);
            }, this);
        }
        if (this.bird.alive && this.duration) {
            this.timeElapsed = this.game.time.totalElapsedSeconds();
            var percentage = this.timeElapsed/this.duration;
            this.graphics.moveTo(this.graphics.x, 1);
            this.graphics.lineTo(this.game.width*percentage, 1);
        }
      },
      shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        if (this.pipes) this.pipes.destroy();
        if (this.scoreboard) this.scoreboard.destroy();
        this.stream.getTracks()[0].stop();
      },
      startGame: function() {
        if(!this.bird.alive && !this.gameover) {
            this.bird.body.allowGravity = true;
            this.bird.alive = true;
            this.start = true;
            this.game.time.reset();
            // add a timer
            //this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
            this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*0.5, this.generatePipes, this);
            this.pipeGenerator.timer.start();

            this.instructionGroup.destroy();
        }
      },
      checkScore: function(pipeGroup) {
        if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
      },
      collectStar: function(bird, star) {
            // Removes star from screen
            star.kill();
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
      },
      medals: function(score) {
            var medals = 0;
            if(score >= this.maxPipeCount && score < 2*this.maxPipeCount) {
                medals = 1;
            } else if(score >= 2*this.maxPipeCount && score < 3*this.maxPipeCount) {
                medals = 2;
            } else if (score >= 3*this.maxPipeCount) {
                medals = 3;
            }
            return medals;
      },
      deathHandler: function(bird, enemy) {
        //if (enemy instanceof Pipe || enemy instanceof Saw){
            this.pipeHitSound.play();
            this.scoreboard = new Scoreboard(this.game, false);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score, this.medals(this.score));

            this.gameover = true;
            this.bird.kill();
            this.pipes.callAll('stop');
            this.pipeGenerator.timer.stop();
            this.ground.stopScroll();
            this.game.physics.arcade.gravity.y = 1200;
        //}
      },
      levelCompleted: function() {
            this.scoreboard = new Scoreboard(this.game, true);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score, this.medals(this.score));

            this.gameover = true;
            this.bird.kill();
            this.pipes.callAll('stop');
            this.pipeGenerator.timer.stop();
            this.ground.stopScroll();
      },
      createStars: function(delay, y) {
            var starY = this.game.rnd.integerInRange(y-50, y+50);
            var pipeSpace = delay/1000*200;
            var starX = this.game.width + this.game.rnd.integerInRange(pipeSpace*0.1, pipeSpace*0.5);
            var starGroup = this.stars.getFirstExists(false);
            if (!starGroup) {
                starGroup = new StarGroup(this.game, this.stars);
            }
            starGroup.reset(starX, starY);
        },   
      generatePipes: function() {
        if (this.pipeCount > this.maxPipeCount) {
            // Level Complete
            this.levelCompleted();
        }
        var delay = Math.max(this.pipeGenerator.delay - 50, 1500);
        var pipeY = this.game.rnd.integerInRange(-100, 100);
        var pipeGroup = this.pipes.getFirstExists(false);
        if(!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);  
        }
        this.createStars(delay);
        pipeGroup.reset(this.game.width, pipeY);
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(delay, this.generatePipes, this);
      }
    };
    return Level;
});