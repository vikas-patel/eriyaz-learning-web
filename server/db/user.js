var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend');
//var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  	name: String,
	mobile: String,
	email: String,
	password: String,
	join_date: { type : Date, default : Date.now }
}, { collection : 'user', discriminatorKey : 'type' });

module.exports = UserSchema;