var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
	name: String,
	desc: String,
	duration: Number,
	notes: [{pitch: Number, duration: Number}]
});
module.exports = mongoose.model('Exercise', exerciseSchema);