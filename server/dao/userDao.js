var User = require('../model/user.js');
var Score = require('../model/score.js');
var UserTime = require('../model/user-time.js');
var Journal = require('../model/journal.js');
var Rule = require('../model/rule.js');
var Medal = require('../model/medal.js');
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
		// {new:true} option to return modified object.
	}, {new: true}, function(err, user) {
		if (err) return handleError(err);
		res.send(user);
	});
}

exports.activate = function(req, res) {
	User.findById(req.params.id,function(err, user) {
		if (err) return handleError(err);
		if(!user.isActive)
		{
			require("../email/notifier.js").SendActivationEmail(user.local.email,user.name);
			user.isActive = true;
			user.save();
		}
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

exports.addTime = function(req, res) {
	new UserTime(req.body).save();
	res.send(200);
}

exports.findTime = function(req, res) {
	UserTime
		.find({
			user: new mongoose.Types.ObjectId(req.params.id)
		})
		.exec(function(err, userTimes) {
			if (err) res.send(err);
			res.json(userTimes);
		});
}
// Find all medals by user and app name.
exports.findAllMedalByApp = function(req, res) {
	Medal.find({
		user: new mongoose.Types.ObjectId(req.params.id),
		appName: req.params.appName
	}).sort({level:1})
	.select('-time')
	.exec(function(err, medals) {
		if (err) res.send(err);
		res.json(medals);
	});
}

// Insert or Update level medal tally.
// Check don't allow to decrement top score or medal tally.
exports.updateMedal = function(req, res) {
	var obj = req.body;
	Medal.findById(obj._id, function(err, data){
	    if (!data){
	    	console.log("obj id not found." + req.body);
	        new Medal(obj).save(function(err, data){
	        	if (err) return res.send(err);
	  			res.json(data);
	        });
	    } else {
	    	console.log("obj id found." + req.body);
	    	if (obj.medal < data.medal) obj.medal = data.medal;
	    	if (obj.score < data.score) obj.score = data.score;
	        Medal.findByIdAndUpdate(obj._id, obj, {new: true}, function(err, data){
	            if (err) return res.send(err);
	  			res.json(data);
	        });
	    }
	});
}

exports.addJournal = function(req, res) {
	new Journal(req.body).save(function (err, journal) {
	  	if (err) return res.send(err);
	  	res.json(journal);
	});
}

exports.findAllJournal = function(req, res) {
	Journal
		.find({
			user: new mongoose.Types.ObjectId(req.params.id)
		})
		.exec(function(err, journals) {
			if (err) res.send(err);
			res.json(journals);
		});
}

exports.addRule = function(req, res) {
	new Rule(req.body).save(function (err, rule) {
	  	if (err) return res.send(err);
	  	res.json(rule);
	});
}

exports.findAllRule = function(req, res) {
	Rule.find()
		.exec(function(err, rules) {
			if (err) res.send(err);
			res.json(rules);
		});
}

exports.updateRule = function(req, res) {
	Rule.findByIdAndUpdate(req.params.id, {
		$set: req.body
		// {new:true} option to return modified object.
	}, {new: true}, function(err, rule) {
		if (err) return handleError(err);
		res.send(rule);
	});
}

exports.findAllScores = function(req, res) {
	Score
		.find({
			user: new mongoose.Types.ObjectId(req.params.id)
		})
		.sort({completionTime: -1})
		.exec(function(err, scores) {
			if (err) res.send(err);
			UserTime
				.find({
					user: new mongoose.Types.ObjectId(req.params.id)
				})
				.sort({endTime: -1})
				.exec(function(err, times) {
					if (err) res.send(err);
					var groupedScoresObj = _.groupBy(scores, function(score) {
						return new Date(score.completionTime.getFullYear(),
							score.completionTime.getMonth(),
							score.completionTime.getDate());
					});
					var groupedTimesObj = _.groupBy(times, function(time) {
						return new Date(time.endTime.getFullYear(),
							time.endTime.getMonth(),
							time.endTime.getDate());
					});
					var timeKeys = _.keys(groupedTimesObj);
					var scoreKeys = _.keys(groupedScoresObj);
					var keys = _.union(scoreKeys, timeKeys);
					keys = _.sortBy(keys, function(key){ return new Date(key)});
					keys.reverse();
					var groupedScoresArray = [];
					for (var i = 0; i < keys.length; i++) {
						groupedScoresArray.push({
							completionTime: new Date(keys[i]),
							scores: groupedScoresObj[keys[i]],
							times:groupedTimesObj[keys[i]]
						});
					}
					res.json(groupedScoresArray);
				});
		});
}

exports.findTopScoresByDate = function(req, res) {
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
					appName: '$appName',
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
				appName: "$_id.appName",
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
			userType: "teacher"
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

exports.updateLastLogin = function(email) {
	User
		.update({
			'local.email': email
		},{$set:{'last_login':new Date()}})
		.exec(function(err, cnt) {
			if (err) console.log("Error while updating last_login");
		});
}

exports.updateSubscriptionDate = function(email, start_date, end_date) {
	User
		.update({
			'local.email': email
		},{$set:{'subscription_start_date':start_date, 'subscription_end_date':end_date}})
		.exec(function(err, cnt) {
			if (err) console.log("Error while updating subscription dates");
		});
}