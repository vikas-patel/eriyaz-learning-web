define(['../Prefab'], function (Prefab) {


var Lives = function (game_state, name, position, properties) {
    "use strict";
    var live_index, life;
    Prefab.call(this, game_state, name, position, properties);
    
    this.visible = false;
    
    this.lives = properties.lives;
    this.lives_sprites = [];
    // create a sprite for each life
    for (live_index = 0; live_index < this.lives; live_index += 1) {
        life = new Phaser.Sprite(this.game_state.game, position.x + (live_index * properties.lives_spacing), position.y, this.texture);
        this.lives_sprites.push(life);
        this.game_state.groups.hud.add(life);
    }
};

Lives.prototype = Object.create(Prefab.prototype);
Lives.prototype.constructor = Lives;

Lives.prototype.die = function () {
    "use strict";
    if (this.lives === 0) return;
    var life;
    this.lives -= 1;
    // kill the last life
    life = this.lives_sprites.pop();
    life.kill();
    // if there are no more lives, it's game over
    if (this.lives === 0) {
        this.game_state.game_over();
    }
};
return Lives;
});