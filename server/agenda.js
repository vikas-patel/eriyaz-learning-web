var Agenda = require('agenda');
var config = require('./env').config();

var connectionOpts = {db: { address: config.dburl}};

var agenda = new Agenda(connectionOpts);

var jobTypes = [];
if (config.env == "development" || config.env == "production") {
	jobTypes.push("reminders"); // same as file name
}

jobTypes.forEach(function(type) {
  	require('./jobs/' + type)(agenda);
})

if(jobTypes.length) {
	console.log("starting scheduled job runner");
  	agenda.start();
}

agenda.now('registration email', { userId: "vikaspatel" });
module.exports = agenda;