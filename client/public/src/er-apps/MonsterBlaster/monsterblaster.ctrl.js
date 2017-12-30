define(['./module', 'd3', 'music-calc', 'mic-util', 'pitchdetector','currentaudiocontext', 'audiobuffer', 'stabilitydetector', 'voiceplayer'], 
    function(app, d3, MusicCalc, MicUtil, PitchDetector, CurrentAudioContext, AudioBuffer, StabilityDetector, VoicePlayer) {
        app.controller('MonsterBlasterCtrl', function($scope, User, $window, $http) {
            
            var stabilityDetector = new StabilityDetector(unitStabilityDetected, aggStabilityDetected);
            var game = new Phaser.Game(720, 505, Phaser.CANVAS, 'monsterBlaster');
            var audioContext = CurrentAudioContext.getInstance();
            $scope.rootNote = 48;
            rootFreq = MusicCalc.midiNumToFreq($scope.rootNote);
            //TODO: set user root note
            var detector = PitchDetector.getDetector('wavelet', audioContext.sampleRate);
            voicePlayer = new VoicePlayer(audioContext, 'male');
            var beatDuration = 2000;
            var isPlay = false;

            function unitStabilityDetected(interval) {
              console.log("unit stable", interval);
              var radian = cannonAngle(interval-Number($scope.rootNote));
              local.gun.rotation = -Math.PI/2 + radian;
              if (!isPlay) {
                local.shootBullet();
              }
            }

            function aggStabilityDetected(interval) {
              console.log("agg stable", interval);
              local.shootBullet();
            }

            MicUtil.getMicAudioStream(
              function(stream) {
                micStream = stream;
                buffer = new AudioBuffer(audioContext, stream, 2048);
                buffer.addProcessor(updatePitch);
                $scope.$apply();
              }
            );

            var updatePitch = function(data) {
              var pitch = detector.findPitch(data);
              if (pitch !== 0) {
                currentFreq = pitch;
                currentInterval = MusicCalc.getCents(rootFreq, currentFreq) / 100;
                stabilityDetector.push(currentInterval + $scope.rootNote);
              }
            };

            function cannonAngle(interval) {
                var formula = (interval/18 + 1/3)*local.dmin*local.GRAVITY/(local.BULLET_SPEED*local.BULLET_SPEED);
                console.log(formula, interval);
                radian = Math.asin(formula)/2;
                return radian;
            }

            var GameState = function(game) {
                this.game = game;
                local = this;
            };

            // Load images and sounds
            GameState.prototype.preload = function() {
                this.game.load.image('bullet', 'er-apps/MonsterBlaster/assets/cannon.png');
                this.game.load.image('bullet1', 'er-apps/MonsterBlaster/assets/bullet1.png');
                this.game.load.image('bullet2', 'er-apps/MonsterBlaster/assets/bullet2.png');
                this.game.load.image('ground', 'er-apps/MonsterBlaster/assets/ground.png');
                this.game.load.spritesheet('explosion', 'er-apps/MonsterBlaster/assets/explosion.png', 128, 128);
                this.game.load.spritesheet('monster', 'er-apps/MonsterBlaster/assets/monster.png', 64, 64);
            };

            // Setup the example
            GameState.prototype.create = function() {
                // Set stage background color
                this.game.stage.backgroundColor = 0x4488cc;

                // Define constants
                this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
                this.BULLET_SPEED = 800*Math.sqrt(16/12); // pixels/second
                this.NUMBER_OF_BULLETS = 20;
                this.GRAVITY = 1000; // pixels/second/second
                this.GUN_X0 = 50;

            var labelsData = ["S", "", "R", "", "G", "m", "", "P", "", "D", "", "N"];
            this.dmin = (this.game.width-this.GUN_X0);
            this.xScale = d3.scale.linear()
                            .domain([0, 12])
                            .range([this.dmin/3, this.dmin]);
            this.monsters = [];
            this.monsterGroup = this.game.add.group();
            for (var i = 0; i <= 11; i++) {
                if(!labelsData[i]) continue;
                var monster = this.game.add.sprite(this.xScale(i)+50, this.game.height-64, 'monster');
                this.game.physics.enable(monster, Phaser.Physics.ARCADE);
                monster.body.immovable = true;
                monster.body.allowGravity = false;
                monster.anchor.setTo(0.5, 0.5);
                monster.frame = 1;
                monster.animations.add('jump', [9, 10, 11, 12], 10, true);
                var animation = monster.animations.add('death', [25, 26, 27, 28, 29, 30, 31, 32]);
                animation.killOnComplete = true;
                this.monsterGroup.add(monster);
            }
                
                // Create an object pool of bullets
                this.bulletPool = this.game.add.group();
                for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
                    // Create each bullet and add it to the group.
                    var bullet = this.game.add.sprite(0, 0, 'bullet2');
                    this.bulletPool.add(bullet);

                    // Set its pivot point to the center of the bullet
                    bullet.anchor.setTo(0.5, 0.5);

                    // Enable physics on the bullet
                    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

                    // Set its initial state to "dead".
                    bullet.kill();
                }

                // Create an object representing our gun
                this.gun = this.game.add.sprite(this.GUN_X0, this.game.height - 64, 'bullet');

                // Set the pivot point to the center of the gun
                this.gun.anchor.setTo(0.5, 0.5);

                // Turn on gravity
                game.physics.arcade.gravity.y = this.GRAVITY;

                // Create some ground
                this.ground = this.game.add.group();
                for(var x = 0; x < this.game.width; x += 32) {
                    // Add the ground blocks, enable physics on each, make them immovable
                    var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
                    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
                    groundBlock.body.immovable = true;
                    groundBlock.body.allowGravity = false;
                    this.ground.add(groundBlock);
                }

                // Create a group for explosions
                this.explosionGroup = this.game.add.group();

                // Simulate a pointer click/tap input at the center of the stage
                // when the example begins running.
                this.game.input.activePointer.x = this.game.width/2;
                this.game.input.activePointer.y = this.game.height/2 - 100;
            };

            GameState.prototype.shootBullet = function() {
                // Enforce a short delay between shots by recording
                // the time that each bullet is shot and testing if
                // the amount of time since the last shot is more than
                // the required delay.
                if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
                if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
                this.lastBulletShotAt = this.game.time.now;

                // Get a dead bullet from the pool
                var bullet = this.bulletPool.getFirstDead();

                // If there aren't any bullets available then don't shoot
                if (bullet === null || bullet === undefined) return;

                // Revive the bullet
                // This makes the bullet "alive"
                bullet.revive();

                // Bullets should kill themselves when they leave the world.
                // Phaser takes care of this for me by setting this flag
                // but you can do it yourself by killing the bullet if
                // its x,y coordinates are outside of the world.
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;

                // Set the bullet position to the gun position.
                bullet.reset(this.gun.x, this.gun.y);
                bullet.rotation = this.gun.rotation;

                // Shoot it in the right direction
                bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
                bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
            };

            // The update() method is called every frame
            GameState.prototype.update = function() {
                // Check if bullets have collided with the ground
                // this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
                //     // Create an explosion
                //     this.getExplosion(bullet.x, bullet.y);

                //     // Kill the bullet
                //     bullet.kill();
                // }, null, this);

                this.monsterGroup.forEach(function(monster) {
                    this.game.physics.arcade.collide(this.bulletPool, monster, function(sprite, bullet) {
                      // console.log(sprite);
                      // console.log(bullet);
                      isJumping = sprite.animations.getAnimation('jump').isPlaying;
                      if (isJumping) {
                        sprite.animations.play('death');  
                      }
                      
                      bullet.kill();
                    }, null, this);
                }, this);

                // Rotate all living bullets to match their trajectory
                this.bulletPool.forEachAlive(function(bullet) {
                    bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
                }, this);

                // Aim the gun at the pointer.
                // All this function does is calculate the angle using
                // Math.atan2(yPointer-yGun, xPointer-xGun)
                // this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

                // Shoot a bullet
                if (this.game.input.activePointer.isDown) {
                    this.shootBullet();
                }
            };

            // Try to get a used explosion from the explosionGroup.
            // If an explosion isn't available, create a new one and add it to the group.
            // Setup new explosions so that they animate and kill themselves when the
            // animation is complete.
            GameState.prototype.getExplosion = function(x, y) {
                // Get the first dead explosion from the explosionGroup
                var explosion = this.explosionGroup.getFirstDead();

                // If there aren't any available, create a new one
                if (explosion === null) {
                    explosion = this.game.add.sprite(0, 0, 'explosion');
                    explosion.anchor.setTo(0.5, 0.5);

                    // Add an animation for the explosion that kills the sprite when the
                    // animation is complete
                    var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
                    animation.killOnComplete = true;

                    // Add the explosion sprite to the group
                    this.explosionGroup.add(explosion);
                }

                // Revive the explosion (set it's alive property to true)
                // You can also define a onRevived event handler in your explosion objects
                // to do stuff when they are revived.
                explosion.revive();

                // Move the explosion to the given coordinates
                explosion.x = x;
                explosion.y = y;

                // Set rotation of the explosion at random for a little variety
                explosion.angle = this.game.rnd.integerInRange(0, 360);

                // Play the animation
                explosion.animations.play('boom');

                // Return the explosion itself in case we want to do anything else with it
                return explosion;
            };
            // Game States
            game.state.add('game', GameState);
            game.state.start('game');

            $scope.playSa = function() {
                  playNote(0, 0);
              };

              $scope.playRe = function() {
                  playNote(2, 1);
              };

              $scope.playGa= function() {
                  playNote(4, 2);
              };

              $scope.playMa = function() {
                  playNote(5, 3);
              };

              $scope.playPa = function() {
                  playNote(7, 4);
              };

              $scope.playDha= function() {
                  playNote(9, 5);
              };

              $scope.playNi= function() {
                  playNote(11, 6);
              };

              function animateJump(noteIndex) {
                  local.monsterGroup.getAt(noteIndex).animations.play('jump');
              }

              function stopAnimate(noteIndex) {
                  local.monsterGroup.getAt(noteIndex).animations.stop();
              }

              function playNote(noteNum, noteIndex) {
                var midi = Number($scope.rootNote) + noteNum;
                animateJump(noteIndex);
                console.log(midi);
                isPlay = true;
                voicePlayer.play(midi, function(){ setTimeout(function(){isPlay = false;}, 1000); }, beatDuration);
              }
            
        });
    });