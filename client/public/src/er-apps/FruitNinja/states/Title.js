define(['./JSONLevel', '../prefabs/HUD/StartGameItem', '../prefabs/Prefab', '../prefabs/TextPrefab', '../prefabs/HUD/Menu'], function (JSONLevel, StartGameItem, Prefab, TextPrefab, Menu) {

var Title = function () {
    "use strict";
    JSONLevel.call(this);
    
    this.prefab_classes = {
        "start_game_item": StartGameItem.prototype.constructor,
        "background": Prefab.prototype.constructor
    };
};

Title.prototype = Object.create(JSONLevel.prototype);
Title.prototype.constructor = Title;

Title.prototype.create = function () {
    "use strict";
    var title_position, title_style, title, menu_position, menu_items, menu_properties, menu;
    JSONLevel.prototype.create.call(this);
    
    // adding title
    title_position = new Phaser.Point(0.5 * this.game.world.width, 0.3 * this.game.world.height);
    title_style = {font: "72px Shojumaru", fill: "#FFF"};
    title = new TextPrefab(this, "title", title_position, {text: "Fruit Ninja", style: title_style, group: "hud"});
    title.anchor.setTo(0.5);
    
    // adding menu
    menu_position = new Phaser.Point(0, 0);
    menu_items = [];
    this.groups.menu_items.forEach(function (menu_item) {
        menu_items.push(menu_item);
    }, this);
    menu_properties = {texture: "", group: "background", menu_items: menu_items};
    menu = new Menu(this, "menu", menu_position, menu_properties);
};

return Title;
});