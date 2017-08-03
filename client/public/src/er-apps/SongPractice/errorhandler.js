define([], function() {
	var ErrorHandler = function() {


		this.correctPitchesUsingOriginal = function(aReference,aUser) {
			stretchFactor = aUser.length/aReference.length;
			for (var i=0;i<aUser.length;i++) {
				refIndex = Math.round(i/stretchFactor);
				if(aReference[refIndex] > -24)
					refPitch = aReference[refIndex];
				else {
					var j =0;
					while (aReference[refIndex-j] <= -24)
						j++;
					refPitch = aReference[refIndex - j -1];
				}
				aUser[i] = aUser[i] + this.closestCorrection(aUser[i],refPitch);
			}
			return aUser;
		}

		this.closestCorrection = function(pUser,pReference) {
			var correction = 0;
			if(Math.abs(pUser-12 - pReference) < Math.abs(pUser - pReference)) {
				correction = -12;
				if(Math.abs(pUser-19 - pReference) < Math.abs(pUser-12 - pReference))
					correction = - 19;
			}
			return correction;
		}

		this.detectSilences = function(aUser) {
			for (var i = 0; i< aUser.length;i++) {
				if(aUser[i] == -100) 
					aUser[i] = -10;
				else if (aUser[i]== -200)
					aUser[i] = 10;
				else aUser[i] = 0;
			}
			return aUser;
		}
		this.detectContinuousContours = function(aUser) {
			var maxChange = 1;
			var contours = [];

			contours.push([]);
			var countourNumber = 0;
			pOld = aUser[0];

			for (var i=0;i<aUser.length;i++) {
				if(Math.abs(aUser[i] - pOld) < maxChange) {
					contours[countourNumber].push(aUser[i]);
					pOld = aUser[i];
				} else {
					contours.push([]);
					countourNumber++;
					contours[countourNumber].push(aUser[i]);
					pOld = aUser[i]
				}
			}

			return contours;
		}

	
		this.formPitchContours = function(aUser,aReference, delay) {
			stretchFactor = aUser.length/aReference.length;

			var maxChange = 1;
			var contours = [];

			contours.push([]);
			var cNum = 0;
			pOld = aUser[0];

			for (var i=0;i<aUser.length;i++) {
				correction = this.findContinuityCorrectionFactor(pOld,aUser[i],maxChange);
				if(correction != -100) {
					aUser[i] = aUser[i] + correction;
					contours[cNum].push(aUser[i]);
					pOld = aUser[i];
				} else {
					contours.push([]);
					cNum++;
					contours[cNum].push(aUser[i]);
					pOld = aUser[i]
				}
			}

            // index = 0;
            // for (var j = 0;j<contours.length;j++) {
            //     if(contours[j][0] != -100) {
            //         var refIndex = Math.round((index+ contours[j].length/2)/stretchFactor);
            //         if(aReference[refIndex] > -24)
            //         refPitch = aReference[refIndex];
            //     else {
            //         var p =0;
            //         while (aReference[refIndex-p] <= -24)
            //             p++;
            //         refPitch = aReference[refIndex - p -1];
            //     }
            //         correction = closestCorrection(contours[j][Math.abs(contours[j].length/2)], aReference[refIndex])
            //         for (var k =0;k<contours[j].length;k++) {
            //             contours[j][k] = contours[j][k] + correction;
            //         }
            //     }
            //     index = index + contours[j].length;
            // }
            return [].concat.apply([], contours);
        }

        this.findContinuityCorrectionFactor = function(pOld,pNew, maxChange) {
        	var pitchDiff = pNew - pOld;
        	if (Math.abs(pitchDiff) < maxChange) {
        		return 0;
        	} else   if (Math.abs(pitchDiff-12) < maxChange) {
        		return -12;
        	} else  if (Math.abs(pitchDiff + 12) < maxChange) {
        		return 12;
        	} else {
        		return -100;
        	}
        }

    };
    return new ErrorHandler();

});