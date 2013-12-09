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

	callbackHandler: function(event) {

		// get the number of units in the attack force
		preWaveLength = GameModel.get('gameState').get('attackForce').length;

		// if there is a unit to add to the attack and the move succeeds
		if(this.model.get('count') > 0 && GameModel.addToAttack(this.model)) {
			
			// get the touch event
			var touch = event.originalEvent.touches[0];
		
			// load the list of colors to color tiles with
			var colors = ['AD3939', '39AD8E', '6A39AD', '3962AD', 'ad399b', '39a1ad', 'ad6239', 'ad3962'].reverse();

			// load the offsets
			var yOffset = 265;
			var xOffset = 68;

			// get the attack size
			var postWave = GameModel.get('gameState').get('attackForce');

			// load final position information into an array
			var endMoveInformation = [];

			// build the move information positions for all of the units
			for(var i = 0; i < postWave.length; i++) {

				var move = {};

				// load the image partial source and the counter
				move.imageSrc = GameModel.get('gameState').get('attackForce').models[i].get('unit').get('pieceName');
				move.count = GameModel.get('gameState').get('attackForce').models[i].get('count');

				// one row of icons
				if(postWave.length < 5) {
					move.y = yOffset;
					move.x = ((320-((postWave.length - 1) * xOffset))/2) + (i * xOffset);
				} 

				// two rows of icons
				else {
					if(i < 4) {
						move.y = yOffset - 34;
						move.x = ((320-(3*68))/2) + (i * xOffset);
					} else  {
						move.y = yOffset + 34;
						move.x = ((320-((postWave.length - 5) * xOffset))/2) + ((i-4) * xOffset);
					}
				}

				// push the move into the list
				endMoveInformation.push(move);
			}
			
			// start a new drawing manager for the tiles
			var canvasManager = new AttackCanvasDrawingManager();

			// map the static drawables
			_.each(endMoveInformation, function(move) {
				move.color = colors.pop();
				canvasManager.addStatic(move);
			});

			// load attributes for the dynamic position drawable
			var finalPosition = _.last(endMoveInformation);
			var dynPos = {};
			dynPos.x0 = touch.pageX;
			dynPos.y0 = touch.pageY + 90;
			dynPos.x1 = finalPosition.x;
			dynPos.y1 = finalPosition.y;

			// cache the last static object
			var last = _.last(canvasManager.getStatics());

			// the unit added is the same type as the previous tile
			if(postWave.length == preWaveLength) {
				dynPos.color = last.color;
				dynPos.imageSrc = last.imageSrc;
				dynPos.count = last.count;
			} 

			// new unit and a new tile
			else {
				canvasManager.setNewUnit();
				dynPos.imageSrc = last.imageSrc;
				dynPos.color = last.color;
				dynPos.count = 1;
			}

			// add the dynamic drawing object
			canvasManager.addDynamic(dynPos);

			// perform the draw animation
			canvasManager.draw();
			
		}
	}
});

// View for an individual inventory unit attack selection tile
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

		// copy the model content to the template
		this.$el.html(this.template(this.model.toJSON()));

		// set the background color
		var bgColor = '41444f';
		if(!(this._index % 2)) bgColor = '494d57';
		$(this.$el.children()[0]).css('background-color', '#' + bgColor);

		// correct the image and resize it if necessary
		var image = this.$el.find('.inventory-icon');
		var pieceName = this.model.get('unit').get('pieceName').toLowerCase();
		$(image).attr('src', 'img/' + pieceName + '.png');
		var imageSrc = $(image).attr('src').toLowerCase();

		var jsImageCopy;
		_.each(images, function(cashedImage) {
			if(cashedImage.src.indexOf(imageSrc) > -1) jsImageCopy = cashedImage;
		});

		var other = $(jsImageCopy).attr('src');

		var originalAspectRatio = jsImageCopy.width / jsImageCopy.height;
		var height = 52;
		var width = 62;

		// fix the height and width using the original aspect ration of the image
		if(jsImageCopy.width > 70) {
			image.width(width + 'px');
			image.height((width / originalAspectRatio) + 'px');
			
		} else if (jsImageCopy.height > 65) {
			image.height(height + 'px');
			image.width((originalAspectRatio * height) + 'px');			
		}

		// adjust the image padding
		image.css('padding-left', ((80 - image.width()) * 1/2) + 'px');
		image.css('padding-top', ((64 - image.height()) * 1/2) + 'px');

		return this;
	}
});
