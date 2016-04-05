define([], function () {
    function Levels() {}
    Levels.prototype = {
      preload: function() {
      },
      create: function() {

        var totalLevels = 13;
        var voiceLevel = 0;
        var rangeLevel = 3;
        var keys = _.keys(this.game.starArray);
        
        var keysVoice = _.filter(keys, function(num){ return num<rangeLevel });
        var maxKeyVoice = parseInt(_.max(keysVoice));

        var keysRange = _.filter(keys, function(num){ return num<totalLevels+1});
        var maxKeyRange = parseInt(_.max(keysRange));

        if (this.game.rootNote){
            if (!this.game.starArray[voiceLevel+1]) {
                this.game.starArray[voiceLevel+1] = {
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": voiceLevel+1,
                    "score": 0,
                    "medal": 0
                }
            } else if (maxKeyVoice < rangeLevel -1 && this.game.starArray[maxKeyVoice].medal > 0) {
                this.game.starArray[maxKeyVoice+1] = {
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": maxKeyVoice+1,
                    "score": 0,
                    "medal": 0
                }
            }
        }
        if (this.game.upperNote && this.game.lowerNote){
            if (!this.game.starArray[rangeLevel+1]) {
                this.game.starArray[rangeLevel+1] = {
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": rangeLevel+1,
                    "score": 0,
                    "medal": 0
                }
            } else if (maxKeyRange < totalLevels-1 && this.game.starArray[maxKeyRange].medal > 0) {
                this.game.starArray[maxKeyRange+1] = {
                    "user": localStorage.userId,
                    "appName": "flappybird",
                    "level": maxKeyRange+1,
                    "score": 0,
                    "medal": 0
                }
            }
        }
        
        this.title = this.game.add.sprite(this.game.width/2, this.game.height/10,'title');
        this.title.anchor.setTo(0.5, 0.5);
        // creation of the thumbails group
        this.levelThumbsGroup = this.game.add.group();
        // number of thumbnail cololumns
        var thumbCols = 5;
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
                if (levelNumber == 3) {
                    var levelThumb = this.game.add.button(offsetX+j*(this.thumbWidth+thumbSpacing), offsetY+i*(this.thumbHeight+thumbSpacing), "setting", this.thumbClicked, this);
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
                    var levelText = this.game.add.text(levelThumb.x+ this.thumbWidth/2,levelThumb.y+5,"Set\nRange",style);
                    levelText.anchor.setTo(0.5, 0);
                    // levelText.width = this.thumbWidth;
                    levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
                    this.levelThumbsGroup.add(levelText);
                    continue;
                }

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
                    var levelText = this.game.add.text(levelThumb.x+ this.thumbWidth/2,levelThumb.y+5,"Set\nVoice",style);
                    levelText.anchor.setTo(0.5, 0);
                    // levelText.width = this.thumbWidth;
                    levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
                    this.levelThumbsGroup.add(levelText);
                    continue;
                }
                // adding the thumbnail, as a button which will call thumbClicked function if clicked           
                var levelThumb = this.game.add.button(offsetX+j*(this.thumbWidth+thumbSpacing), offsetY+i*(this.thumbHeight+thumbSpacing), "levels", this.thumbClicked, this);  
                // shwoing proper frame
                var isVoiceSet = false;
                if (levelNumber < 3) {
                    isVoiceSet = this.game.rootNote ? true: false;
                } else {
                    isVoiceSet = this.game.upperNote && this.game.lowerNote ? true: false;
                }
                if (this.game.starArray[levelNumber] && isVoiceSet) {
                    levelThumb.frame = this.game.starArray[levelNumber].medal;
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