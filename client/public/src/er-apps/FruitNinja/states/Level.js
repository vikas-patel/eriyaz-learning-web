define(['./JSONLevel', '../prefabs/HUD/Score', '../prefabs/Cuttables/Cut', '../prefabs/HUD/GameOverPanel', '../problem'], 
    function (JSONLevel, Score, Cut, GameOverPanel, ProblemFactory) {

var Level = function () {
    "use strict";
    JSONLevel.call(this);
    
    this.prefab_classes = {
        
    };
};

Level.prototype = Object.create(JSONLevel.prototype);
Level.prototype.constructor = Level;

Level.prototype.init = function (level_data) {
    "use strict";
    JSONLevel.prototype.init.call(this, level_data);
    // start physics system
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //this.game.physics.arcade.gravity.y = 1000;
    
    this.MINIMUM_SWIPE_LENGTH = 50;
    
    this.score = 0;
};

Level.prototype.create = function () {
    "use strict";
    JSONLevel.prototype.create.call(this);
    this.slashes = this.game.add.graphics(0, 0);
    this.points = [];
    this.init_hud();
};

Level.prototype.update = function() {
    this.points.push({
        x: this.game.input.x,
        y: this.game.input.y
    });
    this.points = this.points.splice(this.points.length-10, this.points.length);
    //game.add.sprite(game.input.x, game.input.y, 'hit');

    if (this.points.length >= 1 && this.points[0].x>0) {
        this.slashes.clear();
        this.slashes.beginFill(0xFFFFFF);
        this.slashes.lineStyle(2, 0x00FF00, 1);
        this.slashes.alpha = .5;
        this.slashes.moveTo(this.points[0].x, this.points[0].y);
        for (var i=1; i<this.points.length; i++) {
            this.slashes.lineTo(this.points[i].x, this.points[i].y);
        } 
        this.slashes.endFill();
    }
};

Level.prototype.init_hud = function () {
    "use strict";
    var score_position, score_style, score;
    // create score prefab
    score_position = new Phaser.Point(20, 20);
    score_style = {font: "32px Shojumaru", fill: "#fff"};
    score = new Score(this, "score", score_position, {text: "Fruits: ", style: score_style, group: "hud"});
};

Level.prototype.game_over = function () {
    "use strict";
    var game_over_panel, game_over_position, game_over_bitmap, panel_text_style;
    // if current score is higher than highest score, update it
    if (!localStorage[this.highest_score] || this.score > localStorage[this.highest_score]) {
        localStorage[this.highest_score] = this.score;
    }
    
    // create a bitmap do show the game over panel
    game_over_position = new Phaser.Point(0, this.game.world.height);
    game_over_bitmap = this.add.bitmapData(this.game.world.width, this.game.world.height);
    game_over_bitmap.ctx.fillStyle = "#000";
    game_over_bitmap.ctx.fillRect(0, 0, this.game.world.width, this.game.world.height);
    panel_text_style = {game_over: {font: "32px Shojumaru", fill: "#FFF"},
                       current_score: {font: "20px Shojumaru", fill: "#FFF"},
                       highest_score: {font: "18px Shojumaru", fill: "#FFF"}};
    // create the game over panel
    game_over_panel = new GameOverPanel(this, "game_over_panel", game_over_position, {texture: game_over_bitmap, group: "hud", text_style: panel_text_style, animation_time: 500});
    this.groups.hud.add(game_over_panel);
};

Level.prototype.restart_level = function () {
    "use strict";
    this.game.state.restart(true, false, this.level_data);
};
return Level;
});