define([], function () {
    function Levels() {}
    Levels.prototype = {
      preload: function() {
      },
      create: function() {

        var totalLevels = 10;
        if (this.game.starArray.length == 0) {
            // default level 1 is unlocked
            this.game.starArray.push({
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": this.game.starArray.length+1,
                    "score": 0,
                    "medal": 0
            });
        } else if (this.game.starArray.length < totalLevels && this.game.starArray[this.game.starArray.length-1].medal > 0) {
            // unlock next level
            this.game.starArray.push({
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": this.game.starArray.length+1,
                    "score": 0,
                    "medal": 0
            });
        }
        this.title = this.game.add.sprite(this.game.width/2, this.game.height/10,'title');
        this.title.anchor.setTo(0.5, 0.5);
        // creation of the thumbails group
        this.levelThumbsGroup = this.game.add.group();
        // number of thumbnail cololumns
        var thumbCols = 4;
        // width of a thumbnail, in pixels
        this.thumbWidth = 64*2;
        // height of a thumbnail, in pixels
        this.thumbHeight = 64*2;
        // space among thumbnails, in pixels
        var thumbSpacing = 8;
        var i = 0;
        var l = 0;
        var thumbRows = 3;
        var offsetX = (this.game.width - thumbCols*(this.thumbWidth + thumbSpacing))/2;
        var offsetY = 20 + this.game.height*0.15;
        for(var i = 0; i < thumbRows; i ++){
            for (var j = 0; j < thumbCols; j++) {
                 // which level does the thumbnail refer?
                var levelNumber = i*thumbCols+j+l*(thumbRows*thumbCols);
                if (levelNumber > totalLevels) break;
                if (levelNumber == 0) {
                    var levelThumb = this.game.add.button(offsetX, offsetY, "setting", this.thumbClicked, this);
                    levelThumb.frame = 0;
                    levelThumb.levelNumber = levelNumber;
                    levelThumb.scale.setTo(2, 2);
                    // adding the level thumb to the group
                    this.levelThumbsGroup.add(levelThumb);
                    // if the level is playable, also write level number
                    var style = {
                        font: "28px Arial",
                        fill: "#ffffff",
                        wordWrap: true, 
                        wordWrapWidth: this.thumbWidth,
                        align: "center"
                    };
                    var levelText = this.game.add.text(levelThumb.x,levelThumb.y+5,"Set Voice\nRange",style);
                    // levelText.anchor.setTo(0.5, 0);
                    // levelText.width = this.thumbWidth;
                    levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
                    this.levelThumbsGroup.add(levelText);
                    continue;
                }
                // adding the thumbnail, as a button which will call thumbClicked function if clicked           
                var levelThumb = this.game.add.button(offsetX+j*(this.thumbWidth+thumbSpacing), offsetY+i*(this.thumbHeight+thumbSpacing), "levels", this.thumbClicked, this);  
                // shwoing proper frame
                if (levelNumber <= this.game.starArray.length && this.game.upperNote && this.game.lowerNote) {
                    levelThumb.frame = this.game.starArray[levelNumber-1].medal;
                } else {
                    levelThumb.frame = 4;
                }
                // custom attribute 
                levelThumb.levelNumber = levelNumber;
                levelThumb.scale.setTo(2, 2);
                // adding the level thumb to the group
                this.levelThumbsGroup.add(levelThumb);
                // if the level is playable, also write level number
                var style = {
                    font: "28px Arial",
                    fill: "#ffffff"
                };
                var levelText = this.game.add.text(levelThumb.x+5,levelThumb.y+5,levelNumber,style);
                levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
                this.levelThumbsGroup.add(levelText);
            }
        }
      },
      thumbClicked: function(button) {
        // the level is playable, then play the level!!
        if(button.frame < 4){
            this.game.level = button.levelNumber;
            this.game.state.start('level' + button.levelNumber);
        }
        // else, let's shake the locked levels
        else{
            var buttonTween = this.game.add.tween(button)
            buttonTween.to({
                x: button.x+this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x-this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x+this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x-this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                x: button.x
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.start();
        }
      }
    };
    return Levels;
});