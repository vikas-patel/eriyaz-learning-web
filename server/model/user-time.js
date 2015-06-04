var mongoose = require('mongoose');

var UserTimeSchema = mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'User'},
    appName: String,
    time: Number,
    startTime: { type : Date },
    endTime: { type : Date, default : Date.now }
});
module.exports = mongoose.model('UserTime', UserTimeSchema);