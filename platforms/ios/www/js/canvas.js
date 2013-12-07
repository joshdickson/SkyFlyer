/**
 * canvas.js
 * Joshua Dickson
 */

$('#game-container-canvas-wrapper').empty();
for(var k = 0; k < 9; k++) {
	$('#game-container-canvas-wrapper').append('<div class="drawing-icon"><img class="fl drawing-icon-image" src="img/mustang-small.png" /><p class="cb drawing-icon-count">5</p></div>');
}


 /**
 * Utility for working with the opponent score canvas which has a moving gear
 */
function OpponentScoreDrawingManager() {
	var _rotationPerMinute = 4;
	var TO_RADIANS = Math.PI/180;
	var that = this;
	var _rotation = 0;
	var _isDrawing = true;




	var canvas = $('#opponent-score-drawing-canvas')[0];
	var context2d = $('#opponent-score-drawing-canvas')[0].getContext("2d");
	var context = context2d;

	var oldWidth = 20;
    var oldHeight = 20;

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    context.scale(ratio, ratio);

	this.stop = function() {
		_isDrawing = false;
	},

	this.setRotationPerMinute = function(newRotation) {
		_rotationPerMinute = newRotation;
	},

	this.drawRotatedImage = function() {

		var image = gearImage;
		var x = 10;
		var y = 10;
		var angle = 0;
        
		context2d.clearRect(0, 0, 20, 20);

		if(_isDrawing) {
			context2d.save(); 
	 
			// move to the middle of where we want to draw our image
			context2d.translate(x, y);
		 
			// rotate around that point, converting our 
			// angle from degrees to radians 
			context2d.rotate(_rotation * TO_RADIANS);
			var oppStrength = GameModel.get('gameState').get('opponentStrength');

			// console.log(oppStrength);
			// console.log(gearImage);
			// console.log($('#opponent-score-drawing-canvas').attr('height'));

			_rotation += (.15 + (oppStrength / 62));
			if(_rotation > 360) _rotation -= 360;
		 
			// draw it up and to the left by half the width
			// and height of the image 
			// console.log(image);
			context2d.drawImage(image, -8, -8, 16, 16);

			// context2d.drawImage(image, 0, 0, 36, 36);
		 
			// and restore the co-ords to how they were when we began
			context2d.restore(); 

			setTimeout(that.drawRotatedImage, 25);
		}


		
	}

	setTimeout(this.drawRotatedImage, 25);


};


 /**
  * Utilities for working with HTML5 canvas elements in the SkyFlyer game
  */
function CanvasDrawingManager() {
	var _statics = [];
	var _dynamics = [];
	var _newUnitDrawing = false;

	var _transitionTime = 800;
	var _numberOfIterations = Math.floor(_transitionTime / 1000 * 40);


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

	this.draw = function(clearFinal) {

		// set the timeout for each drawing period
		var timeoutLength = _transitionTime / _numberOfIterations;

		// build the static drawable list for each draw call
		var drawables = [];
		var dynamicBuilder = [];
		for(var iteration = 0; iteration < _numberOfIterations; iteration++) {
			var draw = [];
			_.each(_statics, function(staticDrawable) {
				// only push for first one
				// if(iteration == 0) {
					draw.push(staticDrawable);
				// }
				
			});
			drawables.push(draw);
			dynamicBuilder.push([]);
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
				dynamicBuilder[j].push(pos);
			}

		});

		// clear any existing timeouts to avoid flickering w/ moves in close succession
		_.each(inventoryCanvasTimeouts, function(timeout) {
			clearTimeout(timeout);
		});
		inventoryCanvasTimeouts.length = 0;

		_.each(divTimeouts, function(timeout) {
			clearTimeout(timeout);
		});
		divTimeouts.length = 0;

		var children = $('#game-container-canvas-wrapper').children();

		for(var i = 0; i < drawables[0].length; i++) {
				// if($($(children[i]).find('.drawing-icon-image')).attr('src').indexOf(drawables[0][i].imageSrc) == -1) {
					

					var div = $(children[i]).css('background-color', ('#' + drawables[0][i].color));


					var image = $($(children[i]).find('.drawing-icon-image'));
					// $($(children[i]).find('.drawing-icon-image')).attr('src', ('img/' + drawables[0][i].imageSrc + '-small.png'));
				
					var imageSrc = $(image).attr('src', 'img/' + drawables[0][i].imageSrc + '-small.png');
					var imageSrc = $(image).attr('src', $(image).attr('src').toLowerCase());

				// }
				// if($($(children[i]).find('.drawing-icon-count')).text() !== drawables[0][i].count) {
					$($(children[i]).find('.drawing-icon-count')).text(drawables[0][i].count);
				// }
			}

			// move the statics right away, clear the rest
			for(var i = 0; i < _statics.length; i++) {
				$(children[i]).offset({top: _statics[i].y - 132,left: _statics[i].x - 30});
			}
			for(var i = _statics.length; i < 9; i++) {
				$(children[i]).offset({top: -1000, left: -1000});
			}

		var poisonPill = false;
		var poisonPillAdded = false;

		// set the timeout events for all of the drawables
		for(var k = 0; k < dynamicBuilder.length; k++) {

			// get the distance traveled by this element
			if(!poisonPill && !poisonPillAdded && clearFinal) {
				var x0 = dynamicBuilder[0][0].x;
				var y0 = dynamicBuilder[0][0].y;
				var x1 = dynamicBuilder[k][0].x;
				var y1 = dynamicBuilder[k][0].y;
				
				// console.log(dynamicBuilder[0]);
				var traveled = Math.pow(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2), 0.5);

				// get the actual distance traveled
				x0 = dynamicBuilder[0][0].x;
				y0 = dynamicBuilder[0][0].y;

				x1 = dynamicBuilder[dynamicBuilder.length - 1][0].x;
				y1 = dynamicBuilder[dynamicBuilder.length - 1][0].y;

				var scheduled = Math.pow(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2), 0.5);

				// console.log(traveled + "," + scheduled);

				if(traveled > scheduled) {
					poisonPill = true;
				}
			}


			var drawFunction = this.drawDiv;

			var arg = {};
			arg.drawables = dynamicBuilder[k];
			arg.offset = _statics.length;
			arg.poisonPill = poisonPill;

			if(poisonPill) {
				poisonPillAdded = true;
				poisonPill = false;
			}

			divTimeouts.push(setTimeout(function(drawArray) {
				var children = $('#game-container-canvas-wrapper').children();

				if(drawArray.poisonPill) {
					console.log("clearing poison pill at loc: " + drawArray.offset);
					// clear the last element
					$(children[drawArray.offset-1]).offset({top: -1000,left: -1000});
				}

				for(var i = 0; i < drawArray.drawables.length; i++) {
					// console.log(drawArray.drawables[i]);
					$(children[i + drawArray.offset]).offset({top: drawArray.drawables[i].y - 132,left: drawArray.drawables[i].x - 30});
				}
				// hide the unused elements
				// for(var i = drawArray.drawables.length; i < 9; i++) {
				// 	$(children[i]).offset({top: -1000, left: -1000});
				// }

			}, timeoutLength*k, arg));
		}




		// set the timeout events for all of the drawables
		// for(var j = 0; j < drawables.length; j++ ) {

		// 	var drawFunction = this.drawInventoryMarker;

		// 	inventoryCanvasTimeouts.push(setTimeout(function(drawArray) {
		// 		// set the context and clear it entirely
		// 		var drawingContext = $('#attack-unit-canvas')[0].getContext("2d");
		// 		drawingContext.clearRect(0, 0, 320, 658);

		// 		// set the drawable for each item
		// 		_.each(drawArray, function(coord) {
		// 			drawFunction(coord, drawingContext);
		// 		})}, 

		// 		// set the delay length and the draw object
		// 		timeoutLength*j, drawables[j]));
		// };

	}

	/**
	 * Draw an inventory marker
	 */
	// this.drawInventoryMarker = function(coord, drawingContext) {
	// 	// draw the background circle
	// 	drawingContext.beginPath();
	//     drawingContext.fillStyle = '#' + coord.color;
	//     drawingContext.arc(coord.x, coord.y, 30, 0, 2 * Math.PI, false);
	//     drawingContext.fill();

	//     // draw the unit image, stored in a pre-loaded array
	//     _.each(smallImages, function(image) {
	//     	if((image.src).indexOf((coord.imageSrc).toLowerCase()) > -1) 
	//     		drawingContext.drawImage(image, coord.x - 18, coord.y - 22, 36, 36);
	//     });
	    
	//     // draw the count marker
	//     drawingContext.fillStyle = 'white';
	//     drawingContext.textAlign = 'center'
	//     drawingContext.font = "16px Lato";
	//     drawingContext.fillText(coord.count, coord.x, coord.y + 20);
	// }
}

