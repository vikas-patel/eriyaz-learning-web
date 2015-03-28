var mongoose = require('mongoose');

var ScoreSchema = mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'User'},
    appName: String,
    exercise: String,
    score: Number,
    completionTime: { type : Date, default : Date.now }
});
module.exports = mongoose.model('Score', ScoreSchema);