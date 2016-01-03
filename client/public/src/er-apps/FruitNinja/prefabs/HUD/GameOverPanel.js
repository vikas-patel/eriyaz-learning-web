define(['../Prefab'], function (Prefab) {


var GameOverPanel = function (game_state, name, position, properties) {
    "use strict";
    var movement_animation;
    Prefab.call(this, game_state, name, position, properties);
    
    this.text_style = properties.text_style;
    
    this.alpha = 0.5;
    // create a tween animation to show the game over panel
    movement_animation = this.game_state.game.add.tween(this);
    movement_animation.to({y: 0}, properties.animation_time);
    movement_animation.onComplete.add(this.show_game_over, this);
    movement_animation.start();
};

GameOverPanel.prototype = Object.create(Prefab.prototype);
GameOverPanel.prototype.constructor = GameOverPanel;

GameOverPanel.prototype.show_game_over = function () {
    "use strict";
    var game_over_text, current_score_text, medals, medal_text, highest_score_text;
    // add game over text
    game_over_text = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.4, "Game Over", this.text_style.game_over);
    game_over_text.anchor.setTo(0.5);
    this.game_state.groups.hud.add(game_over_text);
    
    // add current score text
    var score = this.game_state.score;
    current_score_text = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.5, "Score: ", this.text_style.current_score);
    current_score_text.anchor.setTo(1.0, 0.5);
    this.game_state.groups.hud.add(current_score_text);
    var current_score = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.5, score, this.text_style.current_score);
    current_score.anchor.setTo(0, 0.5);
    this.game_state.groups.hud.add(current_score);
    // add medals

    medal_text = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.6, "Medals: ", this.text_style.highest_score);
    medal_text.anchor.setTo(1.0, 0.5);
    this.game_state.groups.hud.add(medal_text);

    if(score >= 30 && score < 40) {
      medals = this.game_state.game.add.sprite(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.6,'medals', 1);
      this.totalStars = 1;
    } else if(score >= 40 && score < 50) {
      medals = this.game_state.game.add.sprite(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.6,'medals', 2);
      this.totalStars = 2;
    } else if (score >= 50) {
      medals = this.game_state.game.add.sprite(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.6,'medals', 3);
      this.totalStars = 3;
    }

    if (medals) {
        medals.anchor.setTo(0, 0.8);
        this.game_state.groups.hud.add(medals);
    }
    
    // add highest score text
    highest_score_text = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.7, "Highest score: ", this.text_style.highest_score);
    highest_score_text.anchor.setTo(1.0, 0.5);
    this.game_state.groups.hud.add(highest_score_text);
    var bestScore = this.game_state.game.starArray[this.game.level-1].score;
    if(!bestScore || bestScore < score) {
      bestScore = score;
    }
    var highest_score = this.game_state.game.add.text(this.game_state.game.world.width / 2, this.game_state.game.world.height * 0.7, bestScore, this.text_style.highest_score);
    highest_score.anchor.setTo(0, 0.5);
    this.game_state.groups.hud.add(highest_score);
    
    // add event to restart level
    this.inputEnabled = true;
    this.events.onInputDown.add(this.game_state.restart_level, this.game_state);

    this.game.events.onLevelCompleted.dispatch(this.game.level, this.totalStars, score);
    this.game_state.prefabs.fruit_spawner.stop();
};
return GameOverPanel;
});