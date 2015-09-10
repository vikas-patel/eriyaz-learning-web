define([], function() {
	return {
		getMelody: function(volumeArray, pitchArray, numOfNotes, minSpan) {
			// peak or bottom points
			var maxMinArray = [];
          	var lastValue = 0;
          	for (var i=20; i< volumeArray.length; i=i+10) {
              if (volumeArray[i] > volumeArray[i-10] && volumeArray[i] > volumeArray[i+10]) {
                maxMinArray.push({index:i, value: volumeArray[i], jump: volumeArray[i]-lastValue});
                lastValue = volumeArray[i];
              }
              if (volumeArray[i] < volumeArray[i-10] && volumeArray[i] < volumeArray[i+10]) {
                maxMinArray.push({index:i, value: volumeArray[i], jump:volumeArray[i]-lastValue});
                lastValue = volumeArray[i];
              }
          
			     }          
			     var sortArray = _.sortBy(maxMinArray, function(num){ return -num.jump; });
          	var maxAttempts = 5;
          	var returnArray = [];
          	for (var attempt = 0; attempt < maxAttempts; attempt++) {
              if (returnArray.length == numOfNotes) break;
              returnArray = [];
              var topArray = sortArray.slice(0, numOfNotes+attempt);
              topArray = _.sortBy(topArray, function(num) {return num.index;});
              for (var i=0; i<topArray.length; i++) {
                  if (returnArray.length >= numOfNotes) {
                    break;
                  }
                  var start = topArray[i].index;
                  var end;
                  if (i == topArray.length - 1) {
                    end = start + returnArray[0].span;
                    if (end > pitchArray.length) end = pitchArray.length -1;
                  } else {
                    end = (topArray[i].index + topArray[i+1].index)/2;
                  }
                  var copyArray = pitchArray.slice(start, end);
                  var pitch = _.chain(copyArray).countBy().pairs().max(_.last).head().value();
                  topArray[i].pitch = pitch;
                  topArray[i].span = end - start;
                  if (!Number.isNaN(pitch) && pitch != "NaN" && (end-start > minSpan)) {
                      returnArray.push(topArray[i]);
                  }
              }
          }
          return returnArray;
		}
	};
});