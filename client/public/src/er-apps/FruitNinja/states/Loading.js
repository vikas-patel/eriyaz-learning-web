define([], function () {

    function Loading () {
        "use strict";
        Phaser.State.call(this);
    };

    Loading.prototype = Object.create(Phaser.State.prototype);
    Loading.prototype.constructor = Loading;

    Loading.prototype.init = function (level_data, next_state, showLevels) {
        "use strict";
        this.level_data = level_data;
        this.next_state = next_state;
        this.showLevels = showLevels;
    };

    Loading.prototype.preload = function () {
        "use strict";
        var assets, asset_loader, asset_key, asset;
        assets = this.level_data.assets;
        this.preloader = this.add.sprite(0,this.game.height/2, 'preloader');
        this.preloader.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloader);
        for (asset_key in assets) { // load assets according to asset key
            if (assets.hasOwnProperty(asset_key)) {
                asset = assets[asset_key];
                switch (asset.type) {
                case "image":
                    this.load.image(asset_key, asset.source);
                    break;
                case "spritesheet":
                    this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                    break;
                case "audio":
                    this.load.audio(asset_key, asset.source);
                    break;
                }
            }
        }
    };

    Loading.prototype.create = function () {
        "use strict";
        if (this.showLevels) {
            this.game.state.start("Levels", true, false, this.level_data, this.next_state);
        } else {
            this.game.state.start(this.next_state, true, false, this.level_data);
        }        
    };

    return Loading;
});