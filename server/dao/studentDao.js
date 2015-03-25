var Student = require('../model/student.js');
var Score = require('../model/alankar-score.js');

//TODO:
// Test Update and Delete

exports.save = function(req, res) {
    new Student(request.body).save();
    res.send(200);
    //TO DO: Exception
    //res.send(400);
}

exports.update = function(req, res) {
	var student = request.body;
	student._id = req.params.id;
    new Student(student).save();
    res.send(200);
}

exports.find = function(req, res) {
	Student
		.findOne({_id: req.params.id})
		.populate('activeExercises')
		.exec(function(err, student) {
		    if (err) res.send(err);
	    	res.json(student);
	});
}

exports.findAll = function(req, res) {
	Student
		.find()
		.populate('activeExercises')
		.exec(function(err, students) {
		    if (err) res.send(err);
	    	res.json(students);
	});
}

exports.findAllExercises = function(req, res) {
	Student
		.findOne({_id: req.params.id})
		.populate('allExercises')
		.exec(function(err, student) {
		    if (err) res.send(err);
	    	res.json(student.allExercises);
	});
}

exports.findActiveExercises = function(req, res) {
	Student
		.findOne({_id: req.params.id})
		.populate('activeExercises')
		.exec(function(err, student) {
		    if (err) res.send(err);
	    	res.json(student.activeExercises);
	});
}

exports.remove = function(req, res) {
	Student.remove({_id: req.params.id}).exec();
	res.send(200);
}

exports.removeAll = function(req, res) {
	Student.remove().exec();
	res.send(200);
}

exports.assignExercise = function(req, res) {
	Student.findOne({_id: req.query.studentId})
		.exec(function(err, student) {
		    if (err) res.send(err);
		    student.activeExercises.push(req.query.exerciseId);
		    student.save();
	    	res.send(200);
	});
}

exports.saveScore = function(req, res) {
	new Score(req.body).save();
	res.send(200);
}

exports.findAllScores = function(req, res) {
	Score.find({student: req.params.id})
		.exec(function(err, scores) {
			if(err) res.send(err);
			res.json(scores);
		});
}