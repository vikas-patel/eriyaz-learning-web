var Student = require('../model/student.js');

var student1 = {
	"name" : "Milap Rane",
	"mobile": "123",
	"email" : "123@gmail.com",
	"join_date" : new Date(),
	"activeExercises" : []
};

//TODO:

// Create Teacher

// Show Teacher's Exercises

// Show Student's Exercises

// Remove Exercise by Id.

exports.createStudent = function(req, res) {
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

exports.findStudent = function(req, res) {
	Student
		.findOne({_id: req.params.id})
		.populate('activeExercises')
		.exec(function(err, student) {
			console.log(student);
		    if (err) res.send(err);
	    	res.json(student);
	});
}

exports.findAllStudent = function(req, res) {
	Student
		.find()
		.populate('activeExercises')
		.exec(function(err, students) {
		    if (err) res.send(err);
	    	res.json(students);
	});
}

exports.removeAllStudents = function(req, res) {
	Student.remove().exec();
	res.send("successful");
}

