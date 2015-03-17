var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  	name: String,
	mobile: String,
	local            : {
        email        : String,
        password     : String,
    },
	join_date: { type : Date, default : Date.now }
}, { collection : 'user', discriminatorKey : 'type' });

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = UserSchema;