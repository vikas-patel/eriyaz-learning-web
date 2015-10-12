var mongoose = require('mongoose');

var JournalSchema = mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId,
    	ref: 'User'},
    message: String,
    date: { type : Date, default : Date.now }
});
module.exports = mongoose.model('Journal', JournalSchema);