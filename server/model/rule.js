var mongoose = require('mongoose');

var RuleSchema = mongoose.Schema({
    name: String,
    frequency: { type: String, enum: ['hour', 'day', 'week', 'month'] },
    description: String,
    isEnabled: { type : Boolean, default: false},
    lastRunTime: { type : Date, default : Date.now }
});
module.exports = mongoose.model('Rule', RuleSchema);