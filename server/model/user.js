var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  	name: String,
    dob:Date,
    gender:String,
    phone: String,
	local            : {
        email        : String,
        password     : String,
    },
	join_date: { type : Date, default : Date.now },
    settings : {
        rootNote: Number,
        isPlayInstrument: Boolean,
        isPlayTanpura: Boolean
    }
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

//TODO:
    // facebook         : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
    // google           : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // }