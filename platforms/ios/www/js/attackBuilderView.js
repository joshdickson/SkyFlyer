/**
 * attackbuilderview.js
 * Joshua Dickson
 */

/**
 * A Backbone JS View for the Attack Builder view (where the attack wave is configured)
 */
var AttackBuilderView = Backbone.View.extend({

	// The native element for this page
	el: $('#home-page'),

	// Bind user interaction events, native mouse necessary because of the draggable
	events: {
		'touchend 		#end-turn-icon' 			: 'endTurn',
		'touchstart 	#attack-inventory-icon'		: '_attacktouchstart',
		'touchmove 		#attack-inventory-icon'		: '_attacktouchmove',
		'touchend 		#attack-inventory-icon'		: '_attacktouchend',
	},

	// Set the mouse down flag
	_attacktouchstart: function(event) {
		// respond to event
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		this._mousedown = true;
		this._attackInventoryTouchStart.startX = touch.pageX;
		this._attackInventoryTouchStart.startY = touch.pageY;
		this._attackInventoryTouchStart.offset = parseFloat(this.$el.offset().top);
	},
	
	// If the mouse is down and moving set the dragging flag
	_attacktouchmove: function(event) {
		if(this._mousedown) this._isDragging = true;
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		var deltaY = touch.pageY - this._attackInventoryTouchStart.startY;
		var deltaX = touch.pageX - this._attackInventoryTouchStart.startX;
                                    
		// see if the position is inside the boundary
		if(deltaY > this._attackInventoryTouchStart.contain[1] && deltaY < this._attackInventoryTouchStart.contain[3]) {
			deltaY += this._attackInventoryTouchStart.offset;
			this.$el.offset({ top: deltaY });
		}	
	},

	// Reset the mouse down and dragging flags if they are set, filter out drag event
	_attacktouchend: function() {
		this._mousedown = undefined;
        if(this._isDragging) {
        	this._isDragging = undefined;
			this.attackInventoryCallback(this.$el);
			this._attackInventoryTouchStart.startX = undefined;
			this._attackInventoryTouchStart.startY = undefined;
        } 
        else this.goToHomeView();
	},

	// Deactivate all of the views owned by this view
	deactivateChildViews: function() {
		if(this._views) {
			_.each(this._views, function(view) {
				view.undelegateEvents();
				if(view.deactivateChildViews) view.deactivateChildViews();
			})
		}
	},

	// Activate all of the views owned by this view
	activateChildViews: function() {
		if(this._views) {
			_.each(this._views, function(view) {
				view.delegateEvents();
				if(view.activateChildViews) view.activateChildViews();
			})
		}
	},

	render: function() {
		_.each(this._views, function(view) {
			view.render();
			view.reset();
		})
	},

	// Initialize this view
	initialize: function(attrs, options) {
		// Set the transition callback
		this._transition = attrs.transition;

		this._attackInventoryTouchStart = {};
        this._attackInventoryTouchStart.contain = [0, 0, 0, 90];

		// Initialize other views managed by the attack builder view
		this._views = [];
		this._views.push(new AttackInventoryEffectsView);

	},

	// Transition to the hole view via a callback request to the view manager
	goToHomeView: function() {
		

		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon.png');
		easeToFinalLocation(this.$el, $('#home-page').offset().top, 0);
		this._transition('gameHome', 900);
	},

	// Set the callback for when the attack inventory draggable is released by the user
	attackInventoryCallback: function(element, resetCallback, callbackObj) {
		var topOffset = $(element).offset().top;
		// the draggabe did not move far enough, so revert back to the base location
		if(topOffset < -70) {
			easeToFinalLocation($(element), topOffset, -90);
		} else {
			$('#attack-inventory-icon').attr('src', 'img/attack-build-icon.png');
			easeToFinalLocation($(element), topOffset, 0);
			this._transition('gameHome', 900);
		}
	},

	// End the turn
	endTurn: function() {

		// we may have to clear the drawing section
		if(GameModel.get('gameState').get('attackForce')) {
			var children = $('#game-container-canvas-wrapper').children();
			_.each(children, function(child) {
				$(child).offset({top: -1000,left: -1000});
			});
		}
		

		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon.png');
		easeToFinalLocation(this.$el, $('#home-page').offset().top, 0);

		var result = GameModel.endTurn();
		this._transition('transition', 0, result);
	},

});

// the view for the game
var AttackInventoryEffectsView = Backbone.View.extend({
  	
	initialize: function() {
		console.log('init called');
		this._renderTimeouts = [];
		this.listenTo(GameModel.get('gameState').get('playerUnitInventory'), 'change', this.render);

		this._views = [];
		var that = this;
		var counter = 0;

		GameModel.get('gameState').get('playerUnitInventory').each(function(inventoryItem) {
			var view = new InventoryUnitView({ 
				model: inventoryItem,
				index: counter,
				addToAttackCallback: that.callbackHandler,
				renderTimeoutLog: that._renderTimeouts
			});
			that._views.push(view);
			counter++;
			this.$('#available-attack-units').append(view.render().el);
		});

		this.render();
	},

	reset: function() {
		this._views = [];
		var that = this;
		var counter = 0;
		$('#available-attack-units').empty();
		GameModel.get('gameState').get('playerUnitInventory').each(function(inventoryItem) {
			var view = new InventoryUnitView({ 
				model: inventoryItem,
				index: counter,
				addToAttackCallback: that.callbackHandler,
				renderTimeoutLog: that._renderTimeouts
			});
			that._views.push(view);
			counter++;
			this.$('#available-attack-units').append(view.render().el);
		});

	},

	// Deactivate all of the views owned by this view
	deactivateChildViews: function() {
		if(this._views) {
			_.each(this._views, function(view) {
				view.undelegateEvents();
				if(view.deactivateChildViews) view.deactivateChildViews();
			})
		}
	},

	// Activate all of the views owned by this view
	activateChildViews: function() {
		if(this._views) {
			_.each(this._views, function(view) {
				view.delegateEvents();
				if(view.activateChildViews) view.activateChildViews();
			})
		}
	},

	render: function() {
		return this;
	},

	callbackHandler: function(event, storageArray) {
		// record whether or not a move will be made (there is avail unit)
		var doMove = false;
		var preWaveLength;
		if(this.model.get('count') > 0) {
			doMove = true;
			preWaveLength = GameModel.get('gameState').get('attackForce').length;
		}

		// do the change on the model
		var moveSuccess = GameModel.addToAttack(this.model);

		if(doMove && moveSuccess) {

			var colors = ['AD3939', '39AD8E', '6A39AD', '3962AD', 'ad399b', '39a1ad', 'ad6239', 'ad3962'].reverse();

			var yPos = 265;
			var yPosExpanded = [231, 299];
			var xOffset = 68;

			// get the post wave
			var postWave = GameModel.get('gameState').get('attackForce');
			var horSize = (postWave.length - 1) * xOffset;

			var finalPositions = [];

			for(var i = 0; i < postWave.length; i++) {

				var fianlPosition = {};
				fianlPosition.imageSrc = GameModel.get('gameState').get('attackForce').models[i].get('unit').get('pieceName');
				fianlPosition.count = GameModel.get('gameState').get('attackForce').models[i].get('count');
				if(postWave.length < 5) {
					fianlPosition.y = yPos;
					fianlPosition.x = ((320-horSize)/2) + (i * xOffset);
				} else {
					if(i < 4) {
						fianlPosition.y = yPosExpanded[0];
						fianlPosition.x = ((320-(3*68))/2) + (i * xOffset);
					} else  {
						fianlPosition.y = yPosExpanded[1];
						fianlPosition.x = ((320-((postWave.length - 5) * xOffset))/2) + ((i-4) * xOffset);
					}
				}
				finalPositions.push(fianlPosition);
			}

			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

			var canvasManager = new CanvasDrawingManager();

			if(postWave.length == preWaveLength) {

				

				// first, we assume that below has been triggered already for one unit. in this case,
				// we simply leave and do not move any of the elements directly

				for(var i = 0; i < finalPositions.length; i++) {
					var statPos = {};
					statPos.x = finalPositions[i].x;
					statPos.y = finalPositions[i].y;
					statPos.color = colors.pop();
					statPos.imageSrc = finalPositions[i].imageSrc;
					statPos.count = finalPositions[i].count;
					canvasManager.addStatic(statPos);
				}

				var finalPosition = _.last(finalPositions);

				var dynPos = {};
				dynPos.x0 = touch.pageX;
				dynPos.y0 = touch.pageY + 90;
				dynPos.x1 = finalPosition.x;
				dynPos.y1 = finalPosition.y;
				dynPos.color = _.last(canvasManager.getStatics()).color;
				dynPos.imageSrc = _.last(canvasManager.getStatics()).imageSrc;
				dynPos.count = _.last(canvasManager.getStatics()).count;

				canvasManager.addDynamic(dynPos);

				canvasManager.draw(true);
				


			} else {

				// var canvasManager = new CanvasDrawingManager();

				for(var i = 0; i < finalPositions.length - 1; i++) {
					var statPos = {};
					statPos.x = finalPositions[i].x;
					statPos.y = finalPositions[i].y;
					statPos.color = colors.pop();
					statPos.imageSrc = finalPositions[i].imageSrc;
					statPos.count = finalPositions[i].count;
					canvasManager.addStatic(statPos);
				}

				// now build the transition that will be from the click point...
				var finalPosition = _.last(finalPositions);
				
				var dynPos = {};
				dynPos.x0 = touch.pageX;
				dynPos.y0 = touch.pageY + 90;
				dynPos.x1 = finalPosition.x;
				dynPos.y1 = finalPosition.y;
				dynPos.color = colors.pop();

				dynPos.imageSrc = _.last(finalPositions).imageSrc;
				dynPos.count = 1;

				canvasManager.setNewUnit();
				canvasManager.addDynamic(dynPos);

				canvasManager.draw();
			}
			
			

		}
	}
});


var InventoryUnitView = Backbone.View.extend({

	// set the div for this element
	tagName: 'li',

	template: _.template($('#attack-unit-template').html()),

	events: {
		'touchstart'		: 'addToAttack'
	},

	addToAttack: function(arg) {
		this._addToAttackCallback(arg, this._renderLogger);
	},

	initialize: function(attrs, options) {
		this.listenTo(this.model, 'change', this.render);
		this._index = attrs.index;
		this._addToAttackCallback = attrs.addToAttackCallback;
		this._renderLogger = attrs.renderTimeoutLog;
	},

	render: function() {

		this.$el.html(this.template(this.model.toJSON()));

		// console.log(this.model.get('unit').get('pieceName').toLowerCase());
		var pieceName = this.model.get('unit').get('pieceName').toLowerCase();
		// set the alternating color for the backgrounds...
		if(!(this._index % 2)) {
			$(this.$el.children()[0]).css('background-color', '#494d57');
		} else {
			$(this.$el.children()[0]).css('background-color', '#41444f');
		}

		// print out the image sizes, because we are going to adjust them
		var image = this.$el.find('.inventory-icon');
		// switch the src
		var imageSrc = $(image).attr('src', 'img/' + pieceName + '.png');
		var imageSrc = $(image).attr('src').toLowerCase();

		var jsImageCopy;
		_.each(images, function(cashedImage) {
			if(cashedImage.src.indexOf(imageSrc) > -1) jsImageCopy = cashedImage;
		});

		var other = $(jsImageCopy).attr('src');

		var originalAspectRatio = jsImageCopy.width / jsImageCopy.height;
		var height = 52;
		var width = 62;

		if(jsImageCopy.width > 70) {
			image.width(width + 'px');
			image.height((width / originalAspectRatio) + 'px');
			image.css('padding-left', ((80 - image.width()) * 1/2) + 'px');
			image.css('padding-top', ((70 - image.height()) * 1/2) + 'px');
		} else if (jsImageCopy.height > 65) {
			image.height(height + 'px');
			image.width((originalAspectRatio * height) + 'px');
			image.css('padding-left', ((80 - image.width()) * 1/2) + 'px');
			image.css('padding-top', ((60 - image.height()) * 1/2) + 'px');
		}

		return this;
	}
});
