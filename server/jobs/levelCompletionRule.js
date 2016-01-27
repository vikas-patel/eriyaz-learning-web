var notifier = require('../email/notifier');
var Medal = require('../model/medal.js');
var User = require('../model/user.js');
var Rule = {};


// congratulate for completing level
Rule.execute = function() {
	console.log("LevelCompletion Rule executed");
	var today = new Date();
  	var yesterday = new Date();
  	yesterday.setMonth(yesterday.getMonth() -2);
  	findMedalsCollected(yesterday, today);
};

// Find all medals by user and app name.
function findMedalsCollected(start, end) {
	Medal.aggregate([
    {
        $match: {
            time: {"$gte": start, "$lt": end}
        }
    },
    { $sort: { level: -1 } },
    {
        $group: {
            _id: { user: "$user", appName: "$appName" },
            level: { $first: "$level" }
        }
    }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
        	User.populate(result, {path: "_id.user"}, function(){
        		result.forEach(function(row) {
				console.log(row)
				notifier.SendLevelCompletionEmail(row._id.user.local.email, row._id.user.name, row._id.appName, "Level-"+row.level);
			});
        	});
        }
    });
}

module.exports = Rule;