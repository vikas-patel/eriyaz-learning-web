var User = require('../model/user.js');
var Score = require('../model/score.js');
var mongoose = require('mongoose');
var _ = require('underscore');
//TODO:
// Test Update and Delete

exports.save = function(req, res) {
	new User(req.body).save();
	res.send(200);
	//TO DO: Exception
	//res.send(400);
}

exports.update = function(req, res) {
	User.findByIdAndUpdate(req.params.id, {
		$set: req.body
	}, function(err, user) {
		if (err) return handleError(err);
		res.send(user);
	});
}

exports.find = function(req, res) {
	User
		.findOne({
			_id: req.params.id
		})
		//.populate('activeExercises')
		.exec(function(err, user) {
			if (err) res.send(err);
			res.json(user);
		});
}

exports.findAll = function(req, res) {
	User
		.find()
		//.populate('activeExercises')
		.exec(function(err, users) {
			if (err) res.send(err);
			res.json(users);
		});
}

exports.remove = function(req, res) {
	User.remove({
		_id: req.params.id
	}).exec();
	res.send(200);
}

exports.removeAll = function(req, res) {
	User.remove().exec();
	res.send(200);
}

exports.assignExercise = function(req, res) {
	User.findOne({
			_id: req.query.userId
		})
		.exec(function(err, user) {
			if (err) res.send(err);
			//user.activeExercises.push(req.query.exerciseId);
			user.save();
			res.send(200);
		});
}

exports.saveScore = function(req, res) {
	new Score(req.body).save();
	res.send(200);
}

exports.findAllScores = function(req, res) {
	Score.aggregate([{
			$match: {
				user: new mongoose.Types.ObjectId(req.params.id)
			}
		}, {
			$group: {
				_id: {
					day: {
						$dayOfMonth: "$completionTime"
					},
					month: {
						$month: "$completionTime"
					},
					year: {
						$year: "$completionTime"
					},
					exercise: '$exercise'
				},
				score: {
					$max: '$score'
				}
			}
		}, {
			$project: {
				_id: 0,
				year: "$_id.year",
				month: "$_id.month",
				day: "$_id.day",
				score: 1,
				exercise: "$_id.exercise"
			}
		}, {
			$sort: {
				year: -1,
				month: -1,
				day: -1,
				score: -1
			}
		}],
		function(err, scores) {
			if (err) return handleError(err);
			scores.forEach(function(score) {
				score.completionTime = new Date(score.year, score.month-1, score.day);
				delete score.day;
				delete score.month;
				delete score.year;
			});

			//group by time(day)
			var groupedScoresObj = _.groupBy(scores, 'completionTime');
			var groupedScoresArray = [];
			for (var key in groupedScoresObj) {
				groupedScoresArray.push({
					completionTime: new Date(key),
					scores: groupedScoresObj[key]
				});
			}
			res.json(groupedScoresArray);
		});
}

exports.findAllTeachers = function(req, res) {
	User
		.find({
			isTeacher: true
		})
		.exec(function(err, teachers) {
			if (err) res.send(err);
			res.json(teachers);
		});
}

exports.findAllStudentsByTeacher = function(req, res) {
	User
		.find({
			teacher: req.params.id
		})
		.exec(function(err, students) {
			if (err) res.send(err);
			res.json(students);
		});
}