/**
 * util.js
 * Joshua Dickson
 */

/**
 * Ease an object from one location to another using a basic transient
 */
function easeToFinalLocation(obj, currentPosition, finalPosition) {
	var time = 1000;
    var numberOfIter = 24;
    var timeoutLength = time / numberOfIter;
    var travelDistance = Math.abs(finalPosition - currentPosition);

    for(var i = 0, j = 0; i < travelDistance; i += travelDistance/numberOfIter, j++ ) {
    	var multiplier = -1;
    	if(currentPosition < finalPosition) multiplier = 1;
		setTimeout(function(avar) { obj.offset({ top: avar }) }, timeoutLength*j, 
			currentPosition + (Transients.getBasicTransient((j + 1) / numberOfIter) * multiplier * travelDistance));
    }

    setTimeout(function(loc) { obj.offset({top: loc})  }, numberOfIter * timeoutLength, finalPosition);
}

// load all the small images that are rendered in the attack builder view
var smallImages = [];
var names = ['mustang', 'liberator', 'rocket', 'spitfire'];
for(var i = 0; i < names.length; i++) {
    var imageObj = new Image();
    imageObj.src = 'img/' + names[i] + '-small.png';
    smallImages.push(imageObj);
}

var images = [];
for(var i = 0; i < names.length; i++) {
    var imageObj = new Image();
    imageObj.src = 'img/' + names[i] + '.png';
    images.push(imageObj);
}

var gearImage = new Image();
gearImage.src = 'img/gear.png';