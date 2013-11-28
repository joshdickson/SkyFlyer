/**
 * homeView.js
 * Joshua Dickson
 */


/**
 * A Backbone JS View for the Home Page of the application (base landing page)
 */
var GameHomeView = Backbone.View.extend({

	// The native element for this page
	el: $('#home-page'),

	// Bind user interaction events, native mouse necessary because of use of the draggable
	events: {
		'touchend 		#end-turn-icon' 			: 'endTurn',
		'touchstart 	#attack-inventory-icon'		: 'touchstart',
		'touchmove 		#attack-inventory-icon'		: 'touchmove',
		'touchend 		#attack-inventory-icon'		: 'touchend',
		// TODO - bind to menu
		// TODO - bind to back button
	},

	// Set the mouse down flag
	touchstart: function(event) {

		// ui switch
		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon-active.png')

		// respond to event
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		this._mousedown = true;
		this._attackInventoryTouchStart.startX = touch.pageX;
		this._attackInventoryTouchStart.startY = touch.pageY;
	},
	
	// If the mouse is down and moving set the dragging flag
	touchmove: function(event) {
		if(this._mousedown) this._isDragging = true;
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		var deltaY = touch.pageY - this._attackInventoryTouchStart.startY;
		var deltaX = touch.pageX - this._attackInventoryTouchStart.startX;
                                    
		// see if the position is inside the boundary
		if(deltaY > this._attackInventoryTouchStart.contain[1] && deltaY < this._attackInventoryTouchStart.contain[3])

		this.$el.offset({ top: deltaY });
	},

	// Reset the mouse down and dragging flags if they are set, filter out drag event
	touchend: function() {
		this._mousedown = undefined;
        if(this._isDragging) {
        	this._isDragging = undefined;
			this.attackInventoryCallback(this.$el);
			this._attackInventoryTouchStart.startX = undefined;
			this._attackInventoryTouchStart.startY = undefined;
        } 
        else this.goToAttackBuilder();
	},

	// Initialize this view
	initialize: function(attrs, options) {
		this._transition = attrs.transition;
        this._attackInventoryTouchStart = {};
        this._attackInventoryTouchStart.contain = [0, -90, 0, 0];
	},

	// Set the callback for when the attack inventory draggable is released by the user
	attackInventoryCallback: function(element, resetCallback, callbackObj) {
		var topOffset = $(element).offset().top;
		// the draggable moved beyond the threshold, so transition to the next state
		if(topOffset < -20) {
			easeToFinalLocation($(element), topOffset, -90);
			// callbackObj._transition('attackBuilder', 900);
			this._transition('attackBuilder', 900);
		} else {
			$('#attack-inventory-icon').attr('src', 'img/attack-build-icon.png');
			easeToFinalLocation($(element), topOffset, 0);
		}
	},

	// End the turn
	endTurn: function() {
		GameModel.endTurn();
		var canvas = $('#attack-unit-canvas');
		var ctx = canvas[0].getContext("2d");
		ctx.clearRect(0, 0, 320, 658);
	},

	// Transition to the attack builder view via a callback request to the view manager
	goToAttackBuilder: function() {
		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon-active.png');
		easeToFinalLocation(this.$el, $('#home-page').offset().top, -90);
		this._transition('attackBuilder', 900);
	}

});