/**
 * canvas.js
 * Joshua Dickson
 */





 /**
  * Utilities for working with HTML5 canvas elements in the SkyFlyer game
  */
function CanvasDrawingManager() {
	var _statics = [];
	var _dynamics = [];
	var _newUnitDrawing = false;

	var _transitionTime = 800;
	var _numberOfIterations = 50;

	this.addStatic = function(aStatic) {
		_statics.push(aStatic);
	}

	this.addDynamic = function(aDynamic) {
		_dynamics.push(aDynamic);
	}
	this.getStatics = function() {
		return _statics;
	}

	this.setNewUnit = function() {
		_newUnitDrawing = true;
	}

	this.draw = function() {

		// set the timeout for each drawing period
		var timeoutLength = _transitionTime / _numberOfIterations;

		// build the static drawable list for each draw call
		var drawables = [];
		for(var iteration = 0; iteration < _numberOfIterations; iteration++) {
			var draw = [];
			_.each(_statics, function(staticDrawable) {
				draw.push(staticDrawable);
			});
			drawables.push(draw);
		}

		// build the dynamic draw for each draw call
		_.each(_dynamics, function(dynPos) {
			var travelDistance = Math.pow((Math.pow((dynPos.x1 - dynPos.x0), 2) + Math.pow((dynPos.y1 - dynPos.y0), 2)), 1/2);
			var passed = false;

			for(var i = 0, j = 0; i < travelDistance, j < _numberOfIterations; i += travelDistance/_numberOfIterations, j++ ) {

				// get the effects of the transitive function at this interval
				var transitiveEffects = (Transients.getEasedTransient(((j + 1) / _numberOfIterations), 5.25, 12) * travelDistance);

				// set the flag that a dynamic element has eclipsed its parent
				if(!passed && transitiveEffects > travelDistance) passed = true;
				
				// if the flag is set, remove the last static drawable which is being overwritten
				if(passed && !_newUnitDrawing) drawables[j].pop();
					
				// get the horizontal (x) and vertical (y) offsets caused by the transient
				var xEffects = transitiveEffects * Math.cos(Math.atan2((dynPos.y1 - dynPos.y0) , (dynPos.x1 - dynPos.x0)));
				var yEffects = transitiveEffects * Math.sin(Math.atan2((dynPos.y1 - dynPos.y0) , (dynPos.x1 - dynPos.x0)));

				// set the drawable object for the dynamic element
				var pos = {};
				pos.x = dynPos.x0 + xEffects;
				pos.y = dynPos.y0 + yEffects;
				pos.color = dynPos.color;
				pos.imageSrc = dynPos.imageSrc;
				pos.count = dynPos.count;

				// add this version of the dynamic position to the list of items that will be drawn
				drawables[j].push(pos);

			}

		});

		// clear any existing timeouts to avoid flickering w/ moves in close succession
		_.each(inventoryCanvasTimeouts, function(timeout) {
			clearTimeout(timeout);
		});
		inventoryCanvasTimeouts.length = 0;

		// set the timeout events for all of the drawables
		for(var j = 0; j < drawables.length; j++ ) {

			var drawFunction = this.drawInventoryMarker;

			inventoryCanvasTimeouts.push(setTimeout(function(drawArray) {
				// set the context and clear it entirely
				var drawingContext = $('#attack-unit-canvas')[0].getContext("2d");
				drawingContext.clearRect(0, 0, 320, 658);

				// set the drawable for each item
				_.each(drawArray, function(coord) {
					drawFunction(coord, drawingContext);
				})}, 

				// set the delay length and the draw object
				timeoutLength*j, drawables[j]));
		}
	}

	/**
	 * Draw an inventory marker
	 */
	this.drawInventoryMarker = function(coord, drawingContext) {
		// draw the background circle
		drawingContext.beginPath();
	    drawingContext.fillStyle = '#' + coord.color;
	    drawingContext.arc(coord.x, coord.y, 30, 0, 2 * Math.PI, false);
	    drawingContext.fill();

	    // draw the unit image, stored in a pre-loaded array
	    _.each(smallImages, function(image) {
	    	if((image.src).indexOf((coord.imageSrc).toLowerCase()) > -1) 
	    		drawingContext.drawImage(image, coord.x - 18, coord.y - 22, 36, 36);
	    });
	    
	    // draw the count marker
	    drawingContext.fillStyle = 'white';
	    drawingContext.textAlign = 'center'
	    drawingContext.font = "16px Lato";
	    drawingContext.fillText(coord.count, coord.x, coord.y + 20);
	}
}

