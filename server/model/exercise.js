var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
	name: String,
	desc: String,
	duration: Number,
	notes: [{pitch: Number, duration: Number}],
	createdBy: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'Teacher'}
});
module.exports = mongoose.model('Exercise', exerciseSchema);