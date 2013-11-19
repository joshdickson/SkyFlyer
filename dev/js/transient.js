// transient.js
// 2013 Joshua Dickson

var Transients = {

	getBasicTransient: function(x) {
		return 1 - (Math.pow(Math.E, -6 * x) * Math.cos(16 * x));
	}
	


}

function easeToFinalLocation(obj, currentPosition, finalPosition) {

	var travelDistance = Math.abs(finalPosition - currentPosition);

	// console.log(travelDistance);

	var time = 1000;

	var numberOfIter = 65;
	var timeoutLength = time / numberOfIter;

	for(var i = 0, j = 0; i < travelDistance; i += travelDistance/numberOfIter, j++ ) {

		// var transitiveEffects = (getTransient((j + 1) / numberOfIter) * travelDistance);
		// console.log(transitiveEffects);

		if(currentPosition < finalPosition) 
			setTimeout(function(avar) { obj.offset({ top: avar }) }, timeoutLength*j, currentPosition + (Transients.getBasicTransient((j + 1) / numberOfIter) * travelDistance));
		else 
			setTimeout(function(avar) { obj.offset({ top: avar }) }, timeoutLength*j, currentPosition - (Transients.getBasicTransient((j + 1) / numberOfIter) * travelDistance));

	}


	// finally, set manually to the exact amount
	setTimeout(function(loc) { obj.offset({top: loc})  }, numberOfIter * timeoutLength, finalPosition);
	
};

