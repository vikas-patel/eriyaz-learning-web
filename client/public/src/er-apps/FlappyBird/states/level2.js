define(['./level', '../prefabs/PipeGroup', '../prefabs/starGroup'], function (Level, PipeGroup, StarGroup) {

	function Level2() {
	}

	Level2.prototype = Object.create(Level.prototype);
	Level2.prototype.constructor = Level;

    Level2.prototype.postCreate = function() {
    };

	return Level2;
});

