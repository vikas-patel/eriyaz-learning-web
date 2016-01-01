define(['./JSONLevel', '../prefabs/HUD/StartGameItem', '../prefabs/Prefab', '../prefabs/TextPrefab', '../prefabs/HUD/Menu'], function (JSONLevel, StartGameItem, Prefab, TextPrefab, Menu) {

var Levels = function () {
    "use strict";
    JSONLevel.call(this);
};

Levels.prototype = Object.create(JSONLevel.prototype);
Levels.prototype.constructor = Levels;

Levels.prototype.init = function (level_data, next_state) {
    "use strict";
    this.level_data = level_data;
    this.next_state = next_state;
    console.log("init:"+next_state);
};

Levels.prototype.create = function () {
    var totalLevels = 4;
    if (this.game.starArray.length == 0) {
        // default level 1 is unlocked
        this.game.starArray.push({
                "user": localStorage.userId,
                "appName": "fruitninja",
                "level": this.game.starArray.length+1,
                "score": 0,
                "medal": 0
        });
    } else if (this.game.starArray.length < totalLevels && this.game.starArray[this.game.starArray.length-1].medal > 0) {
        // unlock next level
        this.game.starArray.push({
                "user": localStorage.userId,
                "appName": "fruitninja",
                "level": this.game.starArray.length+1,
                "score": 0,
                "medal": 0
        });
    }
    this.title = this.game.add.sprite(this.game.width/2, this.game.height/4,'logo_image');
    this.title.anchor.setTo(0.5, 0.5);
    // creation of the thumbails group
    this.levelThumbsGroup = this.game.add.group();
    // number of thumbnail cololumns
    var thumbCols = totalLevels;
    // width of a thumbnail, in pixels
    this.thumbWidth = 64*2;
    // height of a thumbnail, in pixels
    this.thumbHeight = 64*2;
    // space among thumbnails, in pixels
    var thumbSpacing = 8;
    var i = 0;
    var l = 0;
    var thumbRows = 1;
    var offsetX = 20;
    var offsetY = 20 + this.game.height/2;
    var count = 0;
    for (var j = 0; j < this.game.starArray.length; j++) {
         // which level does the thumbnail refer?
        var levelNumber = i*thumbCols+j+l*(thumbRows*thumbCols);
        // adding the thumbnail, as a button which will call thumbClicked function if clicked           
        var levelThumb = this.game.add.button(offsetX+j*(this.thumbWidth+thumbSpacing), offsetY+i*(this.thumbHeight+thumbSpacing), "levels_image", this.thumbClicked, this);  
        // shwoing proper frame
        levelThumb.frame = this.game.starArray[levelNumber].medal;
        // custom attribute 
        levelThumb.levelNumber = levelNumber+1;
        levelThumb.scale.setTo(2, 2);
        // adding the level thumb to the group
        this.levelThumbsGroup.add(levelThumb);
        // if the level is playable, also write level number
        var style = {
            font: "28px Arial",
            fill: "#ffffff"
        };
        var levelText = this.game.add.text(levelThumb.x+5,levelThumb.y+5,levelNumber+1,style);
        levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
        this.levelThumbsGroup.add(levelText);
        count++;
        // if(this.game.starArray[levelNumber]<4){
            
        // }
    }
    for(var j = this.game.starArray.length; j < thumbCols; j ++){
        // which level does the thumbnail refer?
        var levelNumber = i*thumbCols+j+l*(thumbRows*thumbCols);
        // adding the thumbnail, as a button which will call thumbClicked function if clicked           
        var levelThumb = this.game.add.button(offsetX+j*(this.thumbWidth+thumbSpacing), offsetY+i*(this.thumbHeight+thumbSpacing), "levels_image", this.thumbClicked, this);  
        // shwoing proper frame
        levelThumb.frame = 4;
        // custom attribute 
        levelThumb.levelNumber = levelNumber+1;
        levelThumb.scale.setTo(2, 2);
        // adding the level thumb to the group
        this.levelThumbsGroup.add(levelThumb);
        count++;
    }
    console.log(count);
};

Levels.prototype.thumbClicked = function (button) {
    if(button.frame < 4){
        this.game.level = button.levelNumber;
        this.game.state.start(this.next_state, true, false, this.level_data);
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

return Levels;
});