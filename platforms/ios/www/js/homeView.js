/**
 * homeview.js
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
		'touchstart 	#attack-inventory-icon'		: '_attacktouchstart',
		'touchmove 		#attack-inventory-icon'		: '_attacktouchmove',
		'touchend 		#attack-inventory-icon'		: '_attacktouchend',
		// TODO - bind to menu
		// TODO - bind to back button
	},

	/**
	 * Log that the user has touched the attack-inventory-icon button and transition the view
	 */
	_attacktouchstart: function(event) {

		// show button as active
		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon-active.png')

		// respond to event
		this._mousedown = true;
		var touch = event.originalEvent.touches[0];
		this._attackInventoryTouchStart.startY = touch.pageY;
	},
	
	/**
	 * The user is dragging the attack-inventory-icon button
	 */
	_attacktouchmove: function(event) {

		// set the dragging flag
		if(this._mousedown) this._isDragging = true;

		// get the touch event
		var touch = event.originalEvent.touches[0];

		// process a change on the element if necessary
		var deltaY = touch.pageY - this._attackInventoryTouchStart.startY;
        if(deltaY > this._attackInventoryTouchStart.contain[1] && deltaY < this._attackInventoryTouchStart.contain[3])
			this.$el.offset({ top: deltaY });
	},

	/**
	 * The user has released the attack-inventory-icon
	 */
	_attacktouchend: function() {

		// reset touch activity
		this._mousedown = undefined;
        
		// if the element was dragged
        if(this._isDragging) {
        	this._isDragging = undefined;
			this._attackInventoryTouchStart.startY = undefined;
			this.attackInventoryCallback(this.$el);
        }

        // the element was tapped, so go to the attack
        else this.goToAttackBuilder();
	},

	/**
	 * Initialize this view
	 */
	initialize: function(attrs, options) {
		this._transition = attrs.transition;
        this._attackInventoryTouchStart = {};
        this._attackInventoryTouchStart.contain = [0, -90, 0, 0];
	},

	// Set the callback for when the attack inventory draggable is released by the user
	attackInventoryCallback: function() {

		// get the current top offset of the element
		var topOffset = $(this.$el).offset().top;

		// the draggable moved beyond the threshold, so transition to the next state
		if(topOffset < -20) {
			easeToFinalLocation($(this.$el), 'top', topOffset, -90);
			this._transition('attackBuilder', 400);
		} 

		// the draggable did not move beyond the threshold, so ease back to the starting location
		else {
			$('#attack-inventory-icon').attr('src', 'img/attack-build-icon.png');
			easeToFinalLocation($(this.$el), 'top', topOffset, 0);
		}
	},

	// End the turn
	endTurn: function() {
		// var canvas = $('#attack-unit-canvas');
		// var ctx = canvas[0].getContext("2d");
		// ctx.clearRect(0, 0, 320, 658);
		
		// we may have to clear the drawing section
		if(GameModel.get('gameState').get('attackForce')) {
			var children = $('#game-container-canvas-wrapper').children();
			_.each(children, function(child) {
				$(child).offset({top: -1000,left: -1000});
			});
		}

		

		// TODO - refactor access to global GameModel variable
		var result = GameModel.endTurn();
		this._transition('transition', 1, result);
	},

	// Transition to the attack builder view via a callback request to the view manager
	goToAttackBuilder: function() {
		$('#attack-inventory-icon').attr('src', 'img/attack-build-icon-active.png');
		

		easeToFinalLocation(this.$el, 'top', $('#home-page').offset().top, -90);

		this._transition('attackBuilder', 400);
	}

});

function getExpMult(mult, val) {
	return 1 / Math.exp(mult * val);
}











