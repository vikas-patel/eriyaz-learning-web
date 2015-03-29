var express = require('express');
var path = require('path');
var studentDao = require('./dao/studentDao.js');
var exerciseDao = require('./dao/exerciseDao.js');
// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// STATIC FALLBACK ROUTE ===============
	// =====================================
	// app.use('/static',isLoggedIn);
	// app.use('/:var', isLoggedIn);
	// app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use('/protected', isLoggedIn, express.static(path.join(__dirname, '..', 'protected')));

	if ('development' == app.get('env')) {
		app.use(express.static(path.join(__dirname, '..', 'client', 'public', 'src')));
		app.use('/dist',express.static(path.join(__dirname, '..', 'client', 'public', 'dist')));
	} else {
		// app.use('/dev',express.static(path.join(__dirname, '..', 'client', 'public', 'src')));
		app.use(express.static(path.join(__dirname, '..', 'client', 'public', 'dist')));
	}


	// process the login form
	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			customJsonCalback(req, res, next, err, user, info);
		})(req, res, next);
	});


	// process the signup form
	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			customJsonCalback(req, res, next, err, user, info);
		})(req, res, next);
	});

	app.post('/students', studentDao.save);
	app.put('/students/:id', studentDao.update);
	app.get('/assignExercise', studentDao.assignExercise);
	app.get('/students', studentDao.findAll);
	app.get('/students/:id', studentDao.find);
	app.delete('/students/:id', studentDao.remove);

	app.post('/students/score', studentDao.saveScore);
	app.get('/students/score/:id', studentDao.findAllScores);

	app.get('/teachers', studentDao.findAllTeachers);
	app.get('/teachers/students/:id', studentDao.findAllStudentsByTeacher);

	function customJsonCalback(req, res, next, err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.json({
				status: 'fail',
				info: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.json({
				status: 'success',
				user: user
			});
		});
	}

	// route middleware to make sure
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
	}
};