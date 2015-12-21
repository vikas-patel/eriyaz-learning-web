var express = require('express');
var request = require('request');
var path = require('path');
var userDao = require('./dao/userDao.js');
var exerciseDao = require('./dao/exerciseDao.js');
var userSchema  = require('./model/user.js');
var mongoose = require('mongoose');
var User = mongoose.model('User', userSchema);
var async = require('async');
var crypto = require('crypto');
var notifier = require("./email/notifier")

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// STATIC FALLBACK ROUTE ===============
	// =====================================
	// app.use('/static',isLoggedIn);
	// app.use('/:var', isLoggedIn);
	// app.use(express.static(path.join(__dirname, '..', 'public')));
	
	if ('development' != app.get('env')) {
		app.use(function(req, res, next) {
		    if (req.headers['x-forwarded-proto'] != 'https') {
		        res.redirect('https://' + req.headers.host + req.path);
		    }
		    else {
		        return next();
		    }
		});
	}
	
	app.get('/', function(req, res, next){
		if (!req.isAuthenticated()) {
			res.redirect("/landing/main.html");
		} else {
			next();
		}
	});
	
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

	app.post('/register', function(req, res, next) {
		request.post(
			// Google Form: Learn to Sing (Web)
		    'https://docs.google.com/forms/d/1vr-vtuEDsbKB5H6mn-b6LAtTZe5PSEL3Mj2ZnrLeDMs/formResponse',
		    {form:req.body},
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		        	var json_resp = {"info":"Thank you for registering. We will contact you in two days time."};
	    			res.json(json_resp);
		        } else {
		        	var json_resp = {};
		        	res.statusCode = 400;
	    			res.json(json_resp);
		        }
		    }
		);
	    
	});
	
	app.post('/users', isLoggedIn, userDao.save);
	app.put('/users/:id', userDao.update);
	app.post('/activate/:id', userDao.activate);
	app.get('/assignExercise', isLoggedIn, userDao.assignExercise);
	app.get('/users', isLoggedIn, userDao.findAll);
	app.get('/users/:id', isLoggedIn, userDao.find);
	app.delete('/users/:id', userDao.remove);

	app.post('/users/score', isLoggedIn, userDao.saveScore);
	app.get('/users/topScore/:id', isLoggedIn, userDao.findTopScoresByDate);
	app.get('/users/score/:id', isLoggedIn, userDao.findAllScores);

	app.post('/users/time', isLoggedIn, userDao.addTime);
	app.get('/users/time/:id', isLoggedIn, userDao.findTime);

	app.post('/journal', userDao.addJournal);
	app.get('/journal/:id', userDao.findAllJournal);

	app.post('/medal', userDao.updateMedal);
	app.get('/medal/:id/:appName', userDao.findAllMedalByApp);

	app.get('/teachers', isLoggedIn, userDao.findAllTeachers);
	app.get('/teachers/students/:id', isLoggedIn, userDao.findAllStudentsByTeacher);

	app.post('/reset/:token', function(req, res) {
	  async.waterfall([
	    function(done) {
	      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	          return res.status(404).send('Password reset token is invalid or has expired.');
	        }
	        user.local.password = user.generateHash(req.body.password);
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;

	        user.save(function(err) {
	          req.logIn(user, function(err) {
	            done(err, user);
	          });
	        });
	      });
	    }
	  ], function(err) {
	  	if (err) return next(err);
	  	res.status(200).send("Password updated successfully.");
	  });
	});

	app.post('/forgot', function(req, res, next) {
	  async.waterfall([
	    function(done) {
	      crypto.randomBytes(20, function(err, buf) {
	        var token = buf.toString('hex');
	        done(err, token);
	      });
	    },
	    function(token, done) {
	      User.findOne({ 'local.email': req.body.email }, function(err, user) {
	        if (!user) {
	          return res.status(404).send('No account with that email address exists.');
	        }

	        user.resetPasswordToken = token;
	        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        user.save(function(err) {
	          done(err, token, user);
	        });
	      });
	    },
	    function(token, user, done) {
	      notifier.ResetPasswordEmail(user.local.email, req, token);
	      res.send('Password reset link has been mailed to : ' + req.body.email);
	    }
	  ], function(err) {
	    if (err) return next(err);
	    res.status(500).send("Internal error while resetting password");
	  });
	});

	function customJsonCalback(req, res, next, err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user || !user.isActive) {
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
		{
			//update last_login every time server is accessed
			userDao.updateLastLogin(req.user.local.email);
			return next();
		}
		// Unauthorized
		res.statusCode = 401;
	    var json_resp = {};
	    res.json(json_resp);
	}
};