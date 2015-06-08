define([], function() {
	var errorMargin = 0.1;
	var OctaveError = {
		fix: function(actualFreq, expFreq) {
			if (actualFreq > expFreq * 2 *(1-errorMargin)) {
				return actualFreq/Math.round(actualFreq/expFreq);
			}
			return actualFreq;
		}
	};
	return OctaveError;
});