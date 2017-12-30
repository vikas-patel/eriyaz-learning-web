define([], function() {
	var StabilityDetector = function(unitStabilityCallback, aggStabilityCallback) {
		var unitCacheMax = 15;
		var aggCacheMax = 50;
		var unitCache = [];
		var aggCache = [];
		var stabilityThresh = 80; //80%

		this.push = function(newInterval) {
			unitCache.push(roundInterval(newInterval));
			if (unitCache.length > unitCacheMax) {
				unitCache.shift();
			}
			var unitStable = findStable(unitCache, Math.round(unitCacheMax * stabilityThresh / 100));
			if (unitStable !== null)
				unitStabilityCallback(unitStable);

			aggCache.push(unitStable);
			if (aggCache.length > aggCacheMax) {
				aggCache.shift();
			}
			var aggStable = findStable(aggCache, Math.round(aggCacheMax * stabilityThresh / 100));
			if (aggStable !== null) {
				aggStabilityCallback(aggStable);
				clearCache();
			}
		};

		function clearCache() {
			unitCache = [];
			aggCache = [];
		}

	};

	function roundInterval(interval) {
		return Math.round(interval);
	}

	function findStable(array, minOcc) {
		if (array.length === 0)
			return null;
		var modeMap = {};
		var maxEl = array[0],
			maxCount = 1;
		for (var i = 0; i < array.length; i++) {
			var el = array[i];
			if (modeMap[el] == null)
				modeMap[el] = 1;
			else
				modeMap[el] ++;
			if (modeMap[el] > maxCount) {
				maxEl = el;
				maxCount = modeMap[el];
			}
		}
		if (maxCount >= minOcc)
			return maxEl;
		else return null;
	}

	return StabilityDetector;
});