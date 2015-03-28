var Student = require('../model/user.js');
var Score = require('../model/alankar-score.js');
var mongoose = require('mongoose');

//TODO:
// Test Update and Delete

exports.save = function(req, res) {
    new Student(req.body).save();
    res.send(200);
    //TO DO: Exception
    //res.send(400);
}

exports.update = function(req, res) {
    Student.findByIdAndUpdate(req.params.id, { $set: req.body}, function (err, student) {
	  if (err) return handleError(err);
	  res.send(student);
	});
}

exports.find = function(req, res) {
	Student
		.findOne({_id: req.params.id})
		//.populate('activeExercises')
		.exec(function(err, student) {
		    if (err) res.send(err);
	    	res.json(student);
	});
}

exports.findAll = function(req, res) {
	Student
		.find()
		//.populate('activeExercises')
		.exec(function(err, students) {
		    if (err) res.send(err);
	    	res.json(students);
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
		    //student.activeExercises.push(req.query.exerciseId);
		    student.save();
	    	res.send(200);
	});
}

exports.saveScore = function(req, res) {
	new Score(req.body).save();
	res.send(200);
}

exports.findAllScores = function(req, res) {
	Score.aggregate([
		{ $match : { student : new mongoose.Types.ObjectId(req.params.id) }},
    	 { $group: { _id: {day: { $dayOfMonth: "$completionTime" }, month: { $month: "$completionTime" }, 
    	 			year: { $year: "$completionTime" }, exercise:'$exercise'}, maxScore: { $max: '$score' }}},
    	 { $project: { _id: 0, year:"$_id.year", month:"$_id.month", day:"$_id.day", maxScore: 1, exercise: "$_id.exercise" } },
    	 { $sort : { year: -1, month: -1, day: -1, maxScore: -1} }
    	],
  		function (err, scores) {
			  if (err) return handleError(err);
			  res.json(scores);3
		});
}