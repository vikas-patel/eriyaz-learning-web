define(['./MenuItem'], function (MenuItem) {


var StartGameItem = function (game_state, name, position, properties) {
    "use strict";
    MenuItem.call(this, game_state, name, position, properties);
    
    this.level_file = properties.level_file;
    this.state_name = properties.state_name;
};

StartGameItem.prototype = Object.create(MenuItem.prototype);
StartGameItem.prototype.constructor = StartGameItem;

StartGameItem.prototype.select = function () {
    "use strict";
    // starts game state
    this.game_state.state.start("Boot", true, false, this.level_file, this.state_name);
};
return StartGameItem;
});