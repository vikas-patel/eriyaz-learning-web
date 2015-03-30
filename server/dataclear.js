var config = require('./env').config();
var mongoose = require('mongoose');
var async = require('async');

var User = require('./model/user.js');
var Score = require('./model/score.js');


mongoose.connect(config.dburl);
User.remove({},function(err) {
	console.log('remove users');
	Score.remove({},function(err) {
		console.log('remove scores');
		mongoose.disconnect();
	});
});

