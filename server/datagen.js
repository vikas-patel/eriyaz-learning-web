var config = require('./env').config();
var mongoose = require('mongoose');
var async = require('async');

var User = require('./model/user.js');
var Score = require('./model/score.js');

var generateHash = new User().generateHash;


var teachers = [];
for (var i = 0; i < 3; i++) {
	var teacher = new User({
		name: "teacher" + i,
		dob: new Date(),
		local: {
			email: "teacher" + i + "@xyz.com",
			password: generateHash("teacher" + i)
		},
		isTeacher: true
	});
	teachers.push(teacher);
}

mongoose.connect(config.dburl); // connect to our database
var saveObj = function(obj, doneCallback) {
	obj.save(function(err, data) {
		return doneCallback(null);
	});
};

async.each(teachers, saveObj, function(err) {
	console.log('saved teachers');
	var students = [];
	for (var i = 0; i < teachers.length; i++) {
		for (var j = 0; j < 10; j++) {
			var t = i * 10 + j;
			var student = new User({
				name: "student" + t,
				dob: new Date(),
				local: {
					email: "student" + t + "@xyz.com",
					password: generateHash("student" + t)
				},
				teacher: teachers[i].id
			});
			students.push(student);
		}
	}

	//add guest account
	var guest = new User({
		name: "guest",
		dob: new Date(),
		local: {
			email: "guest",
			password: generateHash("guest")
		},
	});
	students.push(guest);

	async.each(students, saveObj, function(err) {
		console.log('saved students');

		var users = teachers.concat(students);
		var scores = [];
		for (var i = 0; i < users.length; i++) {
			var date = new Date();
			for (var d = 0; d < 7; d++) {
				(function(date1) {
					for (var e = 0; e < 5; e++) {
						scores.push(new Score({
							user: users[i].id,
							appName: 'Alankars',
							exercise: 'Alankar' + e,
							score: Math.random(),
							completionTime: new Date(date1)
						}));
						scores.push(new Score({
							user: users[i].id,
							appName: 'Alankars',
							exercise: 'Alankar' + e,
							score: Math.random(),
							completionTime: date1
						}));
					}
				})(date);
				date.setDate(date.getDate() - 1);
			}
		}

		async.each(scores, saveObj, function(err) {
			console.log('saved scores');
			for (var i = 0; i < scores.length; i++) {
				console.log(scores[i].completionTime);
			}
			mongoose.disconnect();
		});

	});
});