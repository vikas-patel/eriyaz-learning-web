var Rule = require('../model/rule.js');
var nextTargetRule = require('./nextTargetRule.js');
var levelCompletionRule = require('./levelCompletionRule.js');


var RuleEngine = {};

var ruleNameSpace = {};
ruleNameSpace.nextTargetRule = nextTargetRule;
ruleNameSpace.levelCompletionRule = levelCompletionRule;

RuleEngine.run = function() {
	var now = new Date();
	var yesterday = new Date().setDate(now.getDate() - 1);
	var hourBefore = new Date().setHours(now.getHours() - 1);
	var monthBefore = new Date().setMonth(now.getMonth() - 1);
	var weekBefore = new Date().setDate(now.getDate() - 7);
	// Get all rules
	Rule.find()
		.exec(function(err, rules) {
			rules.forEach(function(rule) {
				if (!rule.isEnabled) return;
				switch (rule.frequency) {
				  case "hour":
				  	if (rule.lastRunTime.getTime() > hourBefore) return;
				  	ruleNameSpace[rule.name].execute();
				  	break;
				  case "day":
				  	console.log("rule name:"+rule.name);
				  	if (rule.lastRunTime.getTime() > yesterday) return;
				  	ruleNameSpace[rule.name].execute();
				    break;
				  case "week":
				  	if (rule.lastRunTime.getTime() > weekBefore) return;
				  	ruleNameSpace[rule.name].execute();
				    break;
				  case "month":
				  	if (rule.lastRunTime.getTime() > monthBefore) return;
				  	ruleNameSpace[rule.name].execute();
				    break;
				}
			});
		});
};
RuleEngine.run();
//setInterval(function() { console.log("setInterval: It's been one minute!"); RuleEngine.run(); }, 1000*60);

