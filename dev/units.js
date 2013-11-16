// Units.js
// Joshua Dickson


/**
 * A model for a player
 */
var Player = Backbone.Model.extend({
	initialize: function(attrs, options) {
		if(!attrs.rank) throw "missing player rank";
	}
});


/** 
 * A model for a SkyFlyer game that accepts player-driven events and maintains state
 */

var SkyFlyerGameModel = Backbone.Model.extend({
	initialize: function(attrs, options) {
		if(!attrs.gameState) throw "missing initial values";
	},
	addToAttack: function(attackInventoryItem) {
		if(attackInventoryItem.get('count')) {

			// remove this from the available inventory
			attackInventoryItem.set('count', attackInventoryItem.get('count') - 1);

			var attackingMatch;
			var attackForceLast = this.get('gameState').get('gameConfig').get('attackForce').last();
			if(attackForceLast && attackForceLast.get('unit').equals(attackInventoryItem.get('unit'))) {
				attackingMatch = attackForceLast;
			}

			if(attackingMatch === undefined) {
				var attackForce = this.get('gameState').get('gameConfig').get('attackForce');
				attackForce.add(new Inventory({'unit': attackInventoryItem.get('unit'), 'count': 1 }));
				this.get('gameState').get('gameConfig').set('attackForce', attackForce);
			} else {
				attackingMatch.set('count', attackingMatch.get('count') + 1);
			}
		}
	},
	removeFromAttack: function(attackUnitInventoryItem) {

		if(attackUnitInventoryItem.get('count') == 1) this.get('gameState').get('gameConfig').get('attackForce').remove(attackUnitInventoryItem);
		else attackUnitInventoryItem.set('count', attackUnitInventoryItem.get('count') - 1);

		// finally, put it back into the user's inventory...
		var unit = this.get('gameState').get('gameConfig').get('playerUnitInventory').findWhere({ unit: attackUnitInventoryItem.get('unit')});
		unit.set('count', unit.get('count') + 1);

	},
	buy: function(purchaseUnit) {
		var gameConfig = this.get('gameState').get('gameConfig');
		var playerUnitInventory = gameConfig.get('playerUnitInventory');
		var allGameUnits = gameConfig.get('gameUnitInventory');

		var inventoryItem = playerUnitInventory.findWhere({ unit: purchaseUnit });
		inventoryItem.set('count', (inventoryItem.get('count') + 1));
		gameConfig.set('playerCash', gameConfig.get('playerCash') - purchaseUnit.get('productionCost'));

	},
	getTurn: function() {
		return this.get('gameState').get('gameConfig').get('turnNumber');
	},
	getOpponentDefense: function() {
		return this.get('gameState').get('gameConfig').get('opponentStrength');
	},
	getPlayerPoints: function() {
		return this.get('gameState').get('gameConfig').get('playerPoints');
	},
	getPlayerCash: function() {
		return this.get('gameState').get('gameConfig').get('playerCash');
	},
	endTurn: function() {

		var attackForce = this.get('gameState').get('gameConfig').get('attackForce');
		var gameConfig = this.get('gameState').get('gameConfig');

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

var AttackInventoryItem = Backbone.Model.extend({
	validate: function(attrs, options) {
		if(!attrs.unit || !attrs.unitCount) return 'missing mandatory object value for attack inventory item';
	}
});

var AttackInventoryItemCollection = Backbone.Collection.extend({
   model: AttackInventoryItem
});

/**
 * A wrapper around game configurations that provides traversal utilities
 */
var GameState = Backbone.Model.extend({
    validate: function(attrs, options) {
    	if(!attrs.gameConfig) return "missing mandatory object value"
    },
	getAvailableBuildUnits: function() {

		var availableUnits = new Array();
		var gameUnitInventory = this.get('gameConfig').get('gameUnitInventory');
		var researchInventory = this.get('gameConfig').get('researchInventory');
		var gameResearchInventory = this.get('gameConfig').get('gameResearchInventory');

		_.each(researchInventory.models, function(inventoryItem) {	
			_.each(gameResearchInventory.where({idNumber: (inventoryItem.get('idNumber')).toString()}), function(research) {
				// add every unit to the available units list that this research unlocks
				_.each(research.get('unlockUnit'), function(researchID) {
					availableUnits.push(researchID);
					// remove every now obsolete unit
					_.each(gameUnitInventory.where({idNumber: (researchID).toString()}), function(gameUnitID) {
						_.each(gameUnitID.get('makesObsolete'), function(obsoleteUnitID) {
							availableUnits = _.without(availableUnits, obsoleteUnitID);
						})
					});
				});
			});
		});
		return availableUnits;
	},
	getAvailableResearchProjects: function() {

		var availableResearch = new Array();
		var researchInventory = this.get('gameConfig').get('researchInventory');
		var gameResearchInventory = this.get('gameConfig').get('gameResearchInventory');

		_.each(researchInventory.models, function(inventoryItem) {	
			_.each(gameResearchInventory.where({idNumber: (inventoryItem.get('idNumber')).toString()}), function(research) {
				availableResearch = _.without(availableResearch, inventoryItem.get('idNumber'));
				_.each(research.get('unlockResearch'), function(researchID) {
					availableResearch.push(researchID);
				})
			})
		});
		return availableResearch;
	}
});

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
 * A collection of inventory items
 */
var InventoryCollection = Backbone.Collection.extend({
   model: Inventory
});

/**
 * A research item
 */
var Research = Backbone.Model.extend({
	defaults: {
		"isMultipleAllowed": false,
		'unlockResearch': null,
		'unlockUnit': null
	},
	validate: function(attrs, options) {
		if(!attrs.idNumber || !attrs.researchName || !attrs.shortName || !attrs.productionCost) {
			return "missing mandatory object value";
		}
	}
});

/**
 * A collection of research items
 */
var ResearchCollection = Backbone.Collection.extend({
	model: Research
})

/**
 * A game piece model used for a SkyFlyer game
 */
var GamePiece = Backbone.Model.extend({
	defaults: {
	    "reuse":    true
 	}, 
    validate: function(attrs, options) {
    	if(!attrs.idNumber || !attrs.pieceName || !attrs.productionCost || !attrs.attack 
    		|| !attrs.defense || !attrs.experience || !attrs.detection) {
    		return "missing mandatory object value";
    	}
    },
    equals: function(anotherObject) {
    	if(anotherObject && anotherObject.get('idNumber')) {
    		return this.get('idNumber') === anotherObject.get('idNumber');
    	}
    }
});

/**
 * A collection of GamePiece models
 */
var GamePieceCollection = Backbone.Collection.extend({
    model: GamePiece,
    getByID: function(idNumber) {
		return this.findWhere({idNumber: idNumber.toString()});
	}
});

/**
 * A static game configuration model that holds state information about a game in progress
 */
var GameConfiguration = Backbone.Model.extend({
	defaults: {
	    "turnNumber": 1,
	    "playerCash": 0,
	    "playerPoints": 0,
	    "opponentStrength": 50,
	    "gameUnitInventory": null,
	    "gameResearchInventory": null,
	    "playerUnitInventory": null,
	    'researchInventory': null,
	    "buildQueueItem": null,
	    "attackForce": new InventoryCollection
 	},
 	initialize: function(attrs, options) {
 		// if there is no research inventory given, set it to the start sequence of 0
 		if(!attrs.researchInventory) {
    		var inventory = new InventoryCollection();
	 		inventory.add(new Inventory({'idNumber': '0', 'count': 1}));
	 		this.set('researchInventory', inventory);
    	}
 	}
});



