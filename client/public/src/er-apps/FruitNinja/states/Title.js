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
    title_position = new Phaser.Point(0.6 * this.game.world.width, 0.4 * this.game.world.height);
    title_style = {font: "24px Shojumaru", fill: "#FFF"};
    title = new TextPrefab(this, "title", title_position, {text: "Strike Right", style: title_style, group: "hud"});
    title.anchor.setTo(0.5);

    var readyTextPosition = new Phaser.Point(0.5 * this.game.world.width, 0.10 * this.game.world.height);
    var ready_style = {font: "42px Shojumaru", fill: "#FFF"};
    var readyText = new TextPrefab(this, "title", readyTextPosition, {text: "Get Ready", style: ready_style, group: "hud"});
    readyText.anchor.setTo(0.5);

    var highTextPosition = new Phaser.Point(0.7 * this.game.world.width, 0.30 * this.game.world.height);
    var highText = new TextPrefab(this, "title", highTextPosition, {text: "High Pitch", style: title_style, group: "hud"});
    highText.anchor.setTo(0.5);

    var blade = new Phaser.Sprite(this.game, 0.6 * this.game.world.width, 0.35 * this.game.world.height, "blade_image");
    blade.anchor.setTo(0.5);
    this.groups.hud.add(blade);

    var lowTextPosition = new Phaser.Point(0.4 * this.game.world.width, 0.50 * this.game.world.height);
    var lowText = new TextPrefab(this, "title", lowTextPosition, {text: "Low Pitch", style: title_style, group: "hud"});
    lowText.anchor.setTo(0.5);

    var leftTextPosition = new Phaser.Point(0.3 * this.game.world.width, 0.60 * this.game.world.height);
    var leftText = new TextPrefab(this, "title", leftTextPosition, {text: "Strike Left", style: title_style, group: "hud"});
    leftText.anchor.setTo(0.5);

    var bladeLeft = new Phaser.Sprite(this.game, 0.4 * this.game.world.width, 0.55 * this.game.world.height, "blade_image");
    bladeLeft.anchor.setTo(0.5, 0.5);
    bladeLeft.angle += 180;
    this.groups.hud.add(bladeLeft);
    
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