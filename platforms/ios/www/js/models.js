/**
 * units.js
 * 
 * Joshua Dickson
 */

/***************************************** BACKBONE MODELS (LOW LEVEL) *******************************************/

/**
 * Inventory item model
 */
var Inventory = Backbone.Model.extend({
	defaults: {
	    "count":    1
 	}, 
    validate: function(attrs, options) {
    	if(!attrs.idNumber) {
    		return "missing mandatory object value";
    	}
    }
});

/**
 * Model for a Player model. A Player represents the user who is playing the game.
 */
var Player = Backbone.Model.extend({
	initialize: function(attrs, options) {
		if(!attrs.rank) throw "missing player rank";
	}
});

/**
 * Model for a Research project. Players attempt to gain certain research projects during
 * the game that yeild game advantages.
 */
var Research = Backbone.Model.extend({
	
	// a default research project is a loose singleton, and does not unlock any other projects or units
	defaults: {
		"isMultipleAllowed": false,
		'unlockResearch': null,
		'unlockUnit': null
	},

	// research projects must have the given attributes
	validate: function(attrs, options) {
		if(!attrs.idNumber || !attrs.researchName || !attrs.shortName || !attrs.productionCost) {
			return "missing mandatory object value";
		}
	}
});

/**
 * Model for a GamePiece
 */
var GamePiece = Backbone.Model.extend({

	// a default piece is not one-time use
	defaults: {
	    "reuse":    true
 	}, 

 	// GamePiece objects must have the given attributes
    validate: function(attrs, options) {
    	if(!attrs.idNumber || !attrs.pieceName || !attrs.productionCost || !attrs.attack 
    		|| !attrs.defense || !attrs.experience || !attrs.detection) {
    		return "GamePiece is missing mandatory object value";
    	}
    }
});


/********************************************** BACKBONE COLLECTIONS **********************************************/

/**
 * A collection of Research objects
 */
var ResearchCollection = Backbone.Collection.extend({
	model: Research,

	// get a game piece that has the given idNumber
    getByID: function(idNumber) {
		return this.findWhere({idNumber: idNumber.toString()});
	}
});

/**
 * A collection of GamePiece objects
 */
var GamePieceCollection = Backbone.Collection.extend({
	
    model: GamePiece,

    // get a game piece that has the given idNumber
    getByID: function(idNumber) {
		return this.findWhere({idNumber: idNumber.toString()});
	}
});

/**
 * A collection of Inventory items
 */
var InventoryCollection = Backbone.Collection.extend({
    model: Inventory
});


/********************************************** BACKBONE MODELS (HIGH LEVEL) **********************************************/

/**
 * A model representing an active game state. The GameState model contains all of the information necessary to document
 * and rebuild the current game, including information about the player's inventory and prior actions.
 */
var GameState = Backbone.Model.extend({
	defaults: {
	    "turnNumber": 1,
	    "playerCash": 0,
	    "playerPoints": 0,
	    "opponentStrength": 50,
	    "gameUnitInventory": new GamePieceCollection,
	    "gameResearchInventory": new ResearchCollection,
	    "playerUnitInventory": null,
	    'researchInventory': null,
	    "buildQueueItem": null,
	    'attackForce': new InventoryCollection
 	},
 	initialize: function(attrs, options) {
 		// if there is no research inventory given, set it to the start sequence of 0
 		if(!attrs.researchInventory) {
    		var inventory = new InventoryCollection();
	 		inventory.add(new Inventory({'research': this.get('gameResearchInventory').getByID(0), 'count': 1}));
	 		this.set('researchInventory', inventory);
    	}
    	// set the available items for research and units
    	this.set('availableBuildUnits', this.getAvailableBuildUnits());
    	this.set('availableResearchProjects', this.getAvailableResearchProjects());
 	},
	getAvailableBuildUnits: function() {

		var availableUnits = new Array();
		var gameUnitInventory = this.get('gameUnitInventory');

		this.get('researchInventory').each( function(researchInventoryItem) {
			_.each(researchInventoryItem.get('research').get('unlockUnit'), function(researchID) {
				availableUnits.push(gameUnitInventory.getByID(researchID));
				_.each(gameUnitInventory.where({idNumber: (researchID).toString()}), function(gameUnitID) {
					_.each(gameUnitID.get('makesObsolete'), function(obsoleteUnitID) {
						availableUnits = _.without(availableUnits, gameUnitInventory.getByID(obsoleteUnitID));
					});
				});
			});
		});
		return availableUnits;
	},
	getAvailableResearchProjects: function() {

		var availableResearch = new Array();
		var gameResearchInventory = this.get('gameResearchInventory');

		this.get('researchInventory').each(function(research) {
			availableResearch = _.without(availableResearch, research.get('research'));
			_.each(research.get('research').get('unlockResearch'), function(researchID) {
				availableResearch.push(gameResearchInventory.getByID(researchID));
			});
		}); 
		return availableResearch;
	}
});

/** 
 * A model for a SkyFlyer game and associated actions necessary to play the game
 */
var SkyFlyerGameModel = Backbone.Model.extend({
	initialize: function(attrs, options) {
		if(!attrs.gameState) throw "missing initial values";
	},
	addToAttack: function(attackInventoryItem) {
		if(attackInventoryItem.get('count')) {

			var attackingMatch;
			var attackForceLast = this.get('gameState').get('attackForce').last();
			if(attackForceLast && attackForceLast.get('unit') === (attackInventoryItem.get('unit'))) {
				attackingMatch = attackForceLast;
			}

			// console.log('Attack Wave Length: ' + this.get('gameState').get('attackForce').length);

			if(attackingMatch === undefined) {
				// can't make this move because max 8 units allowed, return false and end
				if(this.get('gameState').get('attackForce').length > 7) {
					return false;
				}
				var attackForce = this.get('gameState').get('attackForce');
				attackForce.add(new Inventory({'unit': attackInventoryItem.get('unit'), 'count': 1 }));
				this.get('gameState').set('attackForce', attackForce);
			} else {
				attackingMatch.set('count', attackingMatch.get('count') + 1);
			} 

			// if we made it this far remove this from the available inventory
			attackInventoryItem.set('count', attackInventoryItem.get('count') - 1);
			return true;
		}
	},
	removeFromAttack: function(attackUnitInventoryItem) {

		if(attackUnitInventoryItem.get('count') == 1) this.get('gameState').get('attackForce').remove(attackUnitInventoryItem);
		else attackUnitInventoryItem.set('count', attackUnitInventoryItem.get('count') - 1);

		// finally, put it back into the user's inventory...
		var unit = this.get('gameState').get('playerUnitInventory').findWhere({ unit: attackUnitInventoryItem.get('unit')});
		unit.set('count', unit.get('count') + 1);

	},
	buy: function(purchaseUnit) {
		var gameConfig = this.get('gameState');
		var playerUnitInventory = gameConfig.get('playerUnitInventory');
		var allGameUnits = gameConfig.get('gameUnitInventory');

		var inventoryItem = playerUnitInventory.findWhere({ unit: purchaseUnit });
		inventoryItem.set('count', (inventoryItem.get('count') + 1));
		gameConfig.set('playerCash', gameConfig.get('playerCash') - purchaseUnit.get('productionCost'));

	},
	getTurn: function() {
		return this.get('gameState').get('turnNumber');
	},
	getOpponentDefense: function() {
		return this.get('gameState').get('opponentStrength');
	},
	getPlayerPoints: function() {
		return this.get('gameState').get('playerPoints');
	},
	getPlayerCash: function() {
		return this.get('gameState').get('playerCash');
	},
	endTurn: function() {

		var attackForce = this.get('gameState').get('attackForce');
		var gameConfig = this.get('gameState');

		// if the game is not over, attempt the turn
		if(gameConfig.get('isGameOver') !== true) {

			var gameFunctions = this.get('gameFunctions');
			var gameUnitInventory = gameConfig.get('gameUnitInventory');
			var playerUnitInventory = gameConfig.get('playerUnitInventory');

			// if there is an attacking force
			if(attackForce) {

				// iterate over attack pieces
				attackForce.each(function(attackInventoryItem) {
					// var unitMultiplier = attackInventoryItem.get('count');

					// get the attacking unit to easily pull attack values from...
					var attackingUnit = attackInventoryItem.get('unit');

					// todo - there may be some added benefits here from combining units, etc, etc

					// now, iterate over each of the units in the attack wave...
					for(var counter = 0; counter < attackInventoryItem.get('count'); counter++) {

						// start by getting a random number that will be used for detection
						var detectionValue = gameFunctions.getRandomNumber();
						var willAttack = true;

						if(parseFloat(attackingUnit.get('detection')) * 5 > detectionValue) {

							var defenseValue = gameFunctions.getRandomNumber();
							var unitDefenseScore = attackingUnit.get('defense') * 10 * ( 1 + (attackingUnit.get('experience') / 10));

							if(unitDefenseScore < defenseValue) { // the unit is lost in the attack
								willAttack = false;	
							} 
						}

						// now, execute the attack. the unit evaded detection, or was detected and survivde
						if(willAttack) { 
							var attackingScore = attackingUnit.get('attack') * 10 * ( 1 + (attackingUnit.get('experience') / 10)) / 20;
							gameConfig.set('opponentStrength', gameConfig.get('opponentStrength') - attackingScore);

							// the unit survived, so we now add it back to the player's inventory (otherwise it was lost )
							var playerInventoryItem = playerUnitInventory.findWhere({unit: attackingUnit});
							playerInventoryItem.set('count', (playerInventoryItem.get('count') + 1));

						}

					}
					
				});

			} 

			// update the opponent strength pending the attack
			var turn = gameConfig.get('turnNumber');
			var oppDefenceScore = this.get('gameFunctions').getOpponentDefense(turn);
			gameConfig.set('opponentStrength', gameConfig.get('opponentStrength') + oppDefenceScore);

			// clean up (reset) the attack force
			attackForce.reset();

			// check that there is no winner, if so, end the game, and declare that it's over
			if(gameConfig.get('opponentStrength') > 100) {
				gameConfig.set('isGameOver', true);
				return 1; // opponent won
			} else if(gameConfig.get('opponentStrength') < 0) {
				gameConfig.set('isGameOver', true);
				return 0; // the player won
			}
			
			// increment the turn counter
			gameConfig.set('turnNumber', gameConfig.get('turnNumber') + 1);

		} else {
			// the game was over, but someone is trying to make a move, so throw an exception
			throw new Error("cannot make a move, the game is over");
		}
	}
});




