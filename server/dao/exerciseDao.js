var Exercise = require('../model/exercise.js');

var exercise1 = {
	"name" : "Test1",
	"desc" : "Test1",
	"notes" : [{"pitch": "0", "duration": "1000"}, {"pitch": "2", "duration": "1000"},
				{"pitch": "4", "duration": "1000"}],
	"duration" : "3000",
};

exports.createExercise = function(req, res) {
	//TODO:
    new Exercise(exercise1).save();
    res.send("successful");
}

exports.save = function(req, res) {
    new Exercise(request.body).save();
    res.send(200);
    //TO DO: Exception
    //res.send(400);
}

exports.update = function(req, res) {
	var exercise = request.body;
	exercise._id = req.params.id;
    new Student(exercise).save();
    res.send(200);
}

exports.find = function(req, res) {
	Exercise
		.findOne({_id: req.params.id})
		.exec(function(err, exercise) {
		    if (err) res.send(err);
	    	res.json(exercise);
	});
}

exports.findByTeacherId = function(req, res) {
	Exercise
		.find({createdBy: req.params.id})
		.exec(function(err, exercises) {
		    if (err) res.send(err);
	    	res.json(exercises);
	});
}

exports.findAll = function(req, res) {
	Exercise
		.find()
		.exec(function(err, exercises) {
		    if (err) res.send(err);
	    	res.json(exercises);
	});
}

exports.remove = function(req, res) {
	Exercise.remove({_id: req.params.id}).exec();
	res.send(200);
}

exports.removeAll = function(req, res) {
	Exercise.remove().exec();
	res.send(200);
}