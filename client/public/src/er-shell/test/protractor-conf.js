// conf.js
exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['spec.js'],
	// capabilities: {
	// 	'browserName': 'firefox'
	// },
	// multiCapabilities: [{
	//   browserName: 'firefox'
	// }, {
	//   browserName: 'chrome'
	// }]
	onPrepare: function() {
		// browser.driver.manage().window().maximize();
		// browser.driver.manage().window().setSize(1280, 1024);
	}
};