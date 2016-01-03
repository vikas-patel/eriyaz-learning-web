define([], function () {

	function Boot() {
	}

	Boot.prototype = {
	  preload: function() {
	    this.load.image('preloader', 'er-apps/FlappyBird/assets/preloader.gif');

	  },
	  create: function() {
	    this.game.input.maxPointers = 1;
	    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = this.game.width/2
        this.scale.minHeight = this.game.height/2;
        this.scale.maxWidth = 1.25*this.game.width;
        this.scale.maxHeight = 1.25*this.game.width;
	    this.game.state.start('preload');
	  }
	};

	return Boot;
});

