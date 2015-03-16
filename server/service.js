var Exercise = require('./db/exercise.js');

var Student = require('./db/student.js');

var exercise1 = {
	"name" : "Test1",
	"desc" : "Test1",
	"notes" : [{"pitch": "0", "duration": "1000"}, {"pitch": "2", "duration": "1000"},
				{"pitch": "4", "duration": "1000"}],
	"duration" : "3000"
};

var student1 = {
	"name" : "Milap Rane",
	"mobile": "123",
	"email" : "123@gmail.com",
	"join_date" : new Date(),
	"activeExercises" : []
};

exports.createStudent = function(req, res) {
	//TODO:
    new Student(student1).save();
    res.send("successful");
}

exports.assignExercise = function(req, res) {
	Student.findOne({_id: req.query.studentId})
		.exec(function(err, student) {
		    if (err) res.send(err);
		    student.activeExercises.push(req.query.exerciseId);
		    student.save();
	    	res.send(student);
	});
}

exports.listStudent = function(req, res) {
	Student
		.find()
		.populate('activeExercises')
		.exec(function(err, students) {
		    if (err) res.send(err);
	    	res.send(students);
	});
}

exports.removeAllStudents = function(req, res) {
	Student.remove().exec();
	res.send("successful");
}

exports.createExercise = function(req, res) {
	//TODO:
    new Exercise(exercise1).save();
    res.send("successful");
}

exports.removeAllExercises = function(req, res) {
	Exercise.remove().exec();
	res.send("successful");
}

exports.listExercise = function(req, res) {
	Exercise.find(function(err, exercises) {
		if (err) res.send(err);
    	res.send(exercises);
  });
}
