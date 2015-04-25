require(
	[
		"underscore"
		// "./soundtouch/core",
		// "./soundtouch/pipe",
		// "./soundtouch/rate-transposer",
		// "./soundtouch/buffer",
		// "./soundtouch/filter",
		// "./soundtouch/stretch",
		// "./soundtouch/soundtouch"
	],
	function() {
		require(['./soundtouch/core'], function() {
			require(['./soundtouch/pipe'], function() {
				require(['./soundtouch/rate-transposer'], function() {
					require(['./soundtouch/buffer'], function() {
						require(['./soundtouch/filter'], function() {
							require(['./soundtouch/stretch'], function() {
								require(['./soundtouch/soundtouch'], function() {

								});
							});
						});
					});
				});
			});
		});
	}
);