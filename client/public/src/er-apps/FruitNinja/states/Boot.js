define([], function () {

    function Boot () {
        "use strict";
        Phaser.State.call(this);
    };

    Boot.prototype = Object.create(Phaser.State.prototype);
    Boot.prototype.constructor = Boot;

    Boot.prototype.init = function (level_file, next_state, showLevels) {
        "use strict";
        this.level_file = level_file;
        this.next_state = next_state;
        this.showLevels = showLevels;
    };

    Boot.prototype.preload = function () {
        "use strict";
        this.load.image('preloader', 'er-apps/FruitNinja/assets/images/preloader.gif');
        this.load.text("level1", this.level_file);
    };

    Boot.prototype.create = function () {
        "use strict";
        var level_text, level_data;
        level_text = this.game.cache.getText("level1");
        level_data = JSON.parse(level_text);
        this.game.state.start("Loading", true, false, level_data, this.next_state, this.showLevels);
    };

    return Boot;
});