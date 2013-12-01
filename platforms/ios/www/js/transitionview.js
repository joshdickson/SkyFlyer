/**
 * transitionview.js
 * Joshua Dickson
 */

var TransitionView = Backbone.View.extend({ 

	// the native element for this page
	el: $('#game-wrapper'),

	_process: function(command) {
		var active = this._activeMessage;
		
		var action;
		if(command === 'default') {
			_.each(this._activeMessage.actions, function(locAction) {
				if(locAction.isDefault) action = locAction;
			});
		} else {
			_.each(this._activeMessage.actions, function(locAction) {
				if(locAction.displayName.toLowerCase() === command) action = locAction;
			});
		}

		$('#game-wrapper').off();

		if(action.actionRequest === 'restart') {

			// console.log('restarting game?');
			// restart the game...
			GameModel = new SkyFlyerGameModel({
				'gameState': buildTutorialGame(), 
				'gameFunctions': gameFunctions,
				'player': gamePlayer
			});

			views.refresh();

			// destroy the display
			// console.log($('#game-wrapper').children()[0]);

			// remove the overlay message
			$('#game-wrapper').children()[0].remove();

			console.log('requested go home');
			this._home(this);
			// setTimeout(this._home, 1, this);
		}
		
	},

	set: function(response) {

		var that = this;

		// if there are prompts to show...
		if(response && response.messageQueue && response.messageQueue.length > 0) {
			// fade the background
			$('#background-image').fadeTo(640, 0.7);
			$('#game-container').fadeTo(640, 0.06);
			$('#opponent-score').fadeTo(640, 0.06);

			// iterate through the messages, display them, and take the appropriate action
			for(var msgID = 0; msgID < response.messageQueue.length; msgID++) {

				// set the current message as active
				this._activeMessage = response.messageQueue[msgID];

				// pick up the template
				var template = _.template($('#message-display-template').html());
				$('#game-wrapper').prepend(template(response.messageQueue[msgID]));
				
				for(var choiceID = 0; choiceID < response.messageQueue[msgID].actions.length; choiceID++) {
					var subTem = _.template($('#message-display-option').html());
					$('#option-list').append(subTem(response.messageQueue[msgID].actions[choiceID]));
				}

				var len = response.messageQueue[msgID].actions.length * (26);
				var leftOffset = (244-len-32) / 2;
				$('#option-list').css('padding-left', leftOffset);

				
				$('#game-wrapper').on('touchend', function() {

					var c = $(event.target).parent().attr('class');
					var key = 'default';
					if(c && (c.indexOf('message-option-item') || c.indexOf('message-display-option-choice'))) {
						var entry = $(event.target).parent().find('.message-option-choice');
						key = $.trim($(entry.context).text()).toLowerCase();
					} 

					that._process(key);

				});

				var width = 280;
				var padding = 26;
				var top = (568 - $('#message-display').height() - padding - padding) / 2;

				$('#message-display').css('margin-top', top);
				$('#message-display').css('display', 'block');
				

			}

		} else {
			// send back right away
			this._home(this);
		}
		
	},

	initialize: function(attrs, options) {
		this._transition = attrs.transition;
	},

	_home: function(that) {
		$('#background-image').fadeTo(640, 1);
		$('#game-container').fadeTo(640, 1);
		$('#opponent-score').fadeTo(640, 1);
		that._transition('gameHome', 500);
	}











});