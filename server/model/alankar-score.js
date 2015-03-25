var mongoose = require('mongoose');

var alankarScoreSchema = mongoose.Schema({
	student: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'Student'},
    exercise: String,
    score: Number,
    completionTime: { type : Date, default : Date.now }
});
module.exports = mongoose.model('AlankarScore', alankarScoreSchema);