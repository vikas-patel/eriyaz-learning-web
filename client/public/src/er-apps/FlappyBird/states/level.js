define(['d3', '../prefabs/bird', '../prefabs/ground', '../prefabs/pipe', '../prefabs/pipeGroup', '../prefabs/starGroup', '../prefabs/scoreboard', 'mic-util', 'currentaudiocontext', 'audiobuffer', 'pitchdetector', 'music-calc', 'intensityfilter'], 
    function (d3, Bird, Ground, Pipe, PipeGroup, StarGroup, Scoreboard, MicUtil, CurrentAudioContext, AudioBuffer, PitchDetector, MusicCalc, IntensityFilter) {
    function Level() {
        
    }
    Level.prototype = {
      create: function() {
        // start the phaser arcade physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // give our world an initial gravity of 1200
        //this.game.physics.arcade.gravity.y = 1200;

        this.maxPipeCount = 20;
        this.pipeCount = 0;
        //this.game.level = 1;

        // add the background sprite
        this.background = this.game.add.sprite(0,0,'background');

        // create and add a group to hold our pipeGroup prefabs
        this.pipes = this.game.add.group();
        this.stars = this.game.add.group();
        
        // create and add a new Bird object
        this.bird = new Bird(this.game, 100, this.game.height/2);
        this.game.add.existing(this.bird);
        
        

        // create and add a new Ground object
        this.ground = new Ground(this.game, 0, 400, 670, 112);
        this.game.add.existing(this.ground);
        

        MicUtil.getMicAudioStream(
            function(stream) {
              buffer = new AudioBuffer(audioContext, stream, 1024);
              buffer.addProcessor(updatePitch);
            }
          );
        var audioContext = CurrentAudioContext.getInstance();
        var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
        var rootNote = this.game.rootNote;
        this.rootFreq = MusicCalc.midiNumToFreq(rootNote);
        this.yScale = d3.scale.linear()
            .domain([0, 11])
            .range([this.game.height - 120, 0]);
        var playObj = this;
        var updatePitch = function(data) {
           
            var pitch = detector.findPitch(data);
             // range 0-1
            var volume = 2*IntensityFilter.rootMeanSquare(data);
            // if (volume < 0.15) return;
            if (pitch !== 0 && volume > 0.15) {
                playObj.updatePitch(pitch);
            }
            
        };
        // add keyboard controls
        this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.flapKey.onDown.addOnce(this.startGame, this);
        //this.flapKey.onDown.add(this.bird.flap, this.bird);
        

        // add mouse/touch controls
        this.game.input.onDown.addOnce(this.startGame, this);
        //this.game.input.onDown.add(this.bird.flap, this.bird);
        

        // keep the spacebar from propogating up to the browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);

        this.instructionGroup = this.game.add.group();
        this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
        this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 225,'instructions'));
        this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 355,'startButton'));
        this.instructionGroup.setAll('anchor.x', 0.5);
        this.instructionGroup.setAll('anchor.y', 0.5);

        this.pipeGenerator = null;

        this.gameover = false;

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
            currInterval = Math.round(1200 * (Math.log(pitch/this.rootFreq) / Math.log(2)) / 100);
            if (currInterval > -6 && currInterval < 18) {
                this.bird.flap(this.yScale(currInterval));
            }
      },
      update: function() {
        // enable collisions between the bird and the ground
        this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

        if(!this.gameover) {    
            // enable collisions between the bird and each group in the pipes group
            this.pipes.forEach(function(pipeGroup) {
                this.checkScore(pipeGroup);
                this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
            }, this);

            this.stars.forEach(function(starGroup) {
                this.game.physics.arcade.overlap(this.bird, starGroup, this.collectStar, null, this);
            }, this);
        }
      },
      shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        this.pipes.destroy();
        this.scoreboard.destroy();
      },
      startGame: function() {
        if(!this.bird.alive && !this.gameover) {
            this.bird.body.allowGravity = true;
            this.bird.alive = true;
            // add a timer
            //this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
            this.pipeGenerator = this.game.time.events.add(Phaser.Timer.SECOND*2.5, this.generatePipes, this);
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
      deathHandler: function(bird, enemy) {
        if (enemy instanceof Pipe){
            this.pipeHitSound.play();
            this.scoreboard = new Scoreboard(this.game, false);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);

            this.gameover = true;
            this.bird.kill();
            this.pipes.callAll('stop');
            this.pipeGenerator.timer.stop();
            this.ground.stopScroll();
            this.game.physics.arcade.gravity.y = 1200;
        }
      },
      levelCompleted: function() {
            this.scoreboard = new Scoreboard(this.game, true);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);

            this.gameover = true;
            this.bird.kill();
            this.pipes.callAll('stop');
            this.pipeGenerator.timer.stop();
            this.ground.stopScroll();
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
        var starY = this.game.rnd.integerInRange(this.game.height/10, this.game.height*9/10);
        var pipeSpace = delay/1000*200;
        var starX = pipeSpace + this.game.rnd.integerInRange(pipeSpace*2/10, pipeSpace*7/10);
        var starGroup = this.stars.getFirstExists(false);
        if (!starGroup) {
            starGroup = new StarGroup(this.game, this.stars);
        }
        starGroup.reset(starX, starY);
        
        pipeGroup.reset(this.game.width, pipeY);
        this.pipeCount++;
        this.pipeGenerator = this.game.time.events.add(delay, this.generatePipes, this);
      }
    };
    return Level;
});