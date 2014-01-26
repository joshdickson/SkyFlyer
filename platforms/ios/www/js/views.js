// views.js
// Joshua Dickson

var GameStatsView = Backbone.View.extend({

	// set the div for this element
	el: $("#game-statistics"),

	template: _.template($('#game-info').html()),

	initialize: function() {
		this.listenTo(GameModel.get('gameState'), 'change', this.render);
		this.render();
	},

	refresh: function() {
		this.listenTo(GameModel.get('gameState'), 'change', this.render);
		this.render();
	},

	render: function() {
		// map the player's rank over
		GameModel.get('gameState').set('playerRank', GameModel.get('player').get('rank'));
		// render the game statistics
		this.$el.html(this.template(GameModel.get('gameState').toJSON()));
	}
})



var AttackUnitView = Backbone.View.extend({

	// set the div for this element
	tagName: 'li',

	className: 'inline-block',

	template: _.template($('#attack-unit-template').html()),

	events: { 
		'click'		: 'removeFromAttack'
	},

	removeFromAttack: function() {
		GameModel.removeFromAttack(this.model);
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


// the view for the game
var OpponentView = Backbone.View.extend({
  				
	// set the div for this element
	el: $("#opponent-score"),

	// set the template for this view
	template: _.template($('#opponent-score-display').html()),

	refresh: function() {
		this._drawingManager.stop();
		this._drawingManager = new OpponentScoreDrawingManager();
		console.log(this._drawingManager === undefined);
		this.listenTo(GameModel.get('gameState'), 'change', this.render);
		this.render();
	},
	
	initialize: function() {
		this.$el.html(this.template(GameModel.get('gameState').toJSON()));
		
		this.listenTo(GameModel.get('gameState'), 'change', this.render);
		this.render();
		this._drawingManager = new OpponentScoreDrawingManager();
	},

	render: function() {
		this.$el.find('#opponent-score-text').text(GameModel.get('gameState').get('opponentStrength'))
		return this;
	},
});





