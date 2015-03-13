var Exercise = require('./db/exercise.js');

var exercise1 = {
	"name" : "Test1",
	"desc" : "Test1",
	"notes" : [{"pitch": "0", "duration": "1000"}, {"pitch": "2", "duration": "1000"},
				{"pitch": "4", "duration": "1000"}],
	"duration" : "3000"
};

exports.createExercise = function(req, res) {
	//TODO:
    new Exercise(exercise1).save();
    res.send("successful");
}

exports.listExercise = function(req, res) {
	Exercise.find(function(err, exercises) {
		if (err) res.send(err);
    	res.send(exercises);
    	//res.send("Hello World.");
  });
}
