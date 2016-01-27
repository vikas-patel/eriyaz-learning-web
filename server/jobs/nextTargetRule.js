var notifier = require('../email/notifier');
var Score = require('../model/score.js');
var Rule = {};

// not loggeed-in for 24hrs to 48hrs
// email next target
Rule.execute = function() {
  console.log("next target rule executed.");
  var start = new Date();
  start.setMonth(start.getMonth() -2);
  var end = new Date();
  end.setMonth(end.getMonth() -1);
  //findPracticedUser(start, end);
};

// User practiced between 24hrs-48hrs
function findPracticedUser(start, end) {
  Score.aggregate([
    {
        $match: {
            completionTime: {"$gte": start}
        }
    },
    { $sort: { completionTime: -1 } },
    {
        $group: {
            _id: "$user",
            completionTime: { $first: "$completionTime" }
        }
    },
    {
        $match: {
            completionTime: {"$lt": end}
        }
    }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            console.log(result[0]);
        }
    });
};

module.exports = Rule;