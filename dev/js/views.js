// views.js
// Joshua Dickson


// set up game functions
var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
	new ProductionWrapper(new LinearProduction(1, 1)), new TestRandomNumberGenerator());

// the game player for the tutorial
var gamePlayer = new Player({
	'rank': 'Sergeant First Class'
});

// the game model
var GameModel = new SkyFlyerGameModel({
	'gameState': buildTutorialGame(), 
	'gameFunctions': gameFunctions,
	'player': gamePlayer
});

var InventoryUnitView = Backbone.View.extend({

	// set the div for this element
	tagName: 'li',

	className: 'inline-block',

	template: _.template($('#attack-unit-template').html()),

	events: {
		'click'		: 'addToAttack'
	},

	addToAttack: function() {
		console.log('add to attack called for unit: ' + this.model.get('unit').get('pieceName'));
		GameModel.addToAttack(this.model);
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var AttackUnitView = Backbone.View.extend({

	// set the div for this element
	tagName: 'li',

	className: 'inline-block',

	template: _.template($('#attack-unit-template').html()),

	events: {
		'click'		: 'removeFromAttack'
	},

	removeFromAttack: function() {
		console.log('remove from attack called for unit: ' + this.model.get('unit').get('pieceName'));
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
var GameView = Backbone.View.extend({
  				
	// set the div for this element
	el: $("#game-statistics"),

	template: _.template($('#game-info').html()),
	
	initialize: function() {

		GameModel.get('gameState').set('playerRank', GameModel.get('player').get('rank'));

		this.listenTo(GameModel.get('gameState'), 'change', this.render);
		this.listenTo(GameModel.get('gameState').get('playerUnitInventory'), 'change', this.render);

		this.render();

	},

	render: function() {
		// render the game statistics
		this.$el.html(this.template(GameModel.get('gameState').toJSON()));

		$('#available-attack-units').empty();
		GameModel.get('gameState').get('playerUnitInventory').each(function(inventoryItem) {
			var view = new InventoryUnitView({ model: inventoryItem });
			this.$('#available-attack-units').append(view.render().el);
		});

		return this;
	}
});

// the view for the game
var AttackView = Backbone.View.extend({
  				
	initialize: function() {
		this.listenTo(GameModel.get('gameState').get('attackForce'), 'change reset add remove', this.render);
		this.render();
	},

	render: function() {
		$('#attack-units').empty();
		GameModel.get('gameState').get('attackForce').each(function(inventoryItem) {
			console.log('rendering attack unit');
			var view = new AttackUnitView({ model: inventoryItem });
			this.$('#attack-units').append(view.render().el);
		});
		return this;
	}
});

// the view for the game
var OpponentView = Backbone.View.extend({
  				
	// set the div for this element
	el: $("#opponent-score"),

	// set the template for this view
	template: _.template($('#opponent-score-display').html()),
	
	initialize: function() {

		this.listenTo(GameModel.get('gameState'), 'change', this.render);

		// render right away
		this.render();

	},

	render: function() {
		this.$el.html(this.template(GameModel.get('gameState').toJSON()));
		return this;
	},
});

// Ending turn view
var EndTurnView = Backbone.View.extend({
	el: $('#end-turn-icon'),

	events: {
		'click'		: 'endTurn',
	},

	endTurn: function() {
		GameModel.endTurn();
	}

});

var Game = new GameView;
var Attack = new AttackView;
var Opponent = new OpponentView;
var EndTurn = new EndTurnView;