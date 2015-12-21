var mongoose = require('mongoose');

var MedalSchema = mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'User'},
    appName: String,
    level: Number,
    score: Number,
    medal: Number,
    time: { type : Date, default : Date.now }
});
MedalSchema.index({ user: 1, appName: 1, level: -1}, {unique: true});
module.exports = mongoose.model('Medal', MedalSchema);