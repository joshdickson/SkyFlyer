// Units.js
// Joshua Dickson

/** 
 * A game model
 */
var SkyFlyerGameModel = Backbone.Model.extend({
	validate: function(attrs, options) {
		if(!attrs.gameState) return "missing game state"
	},
	buy: function(purchaseUnitID) {
		var gameConfig = this.get('gameState').get('gameConfig');
		var playerUnitInventory = gameConfig.get('playerUnitInventory');
		var allGameUnits = gameConfig.get('gameUnitInventory');
		
		_.each(playerUnitInventory.where({idNumber: purchaseUnitID}), function(gameUnit) {
			gameUnit.set('count', (gameUnit.get('count') + 1));
			_.each(allGameUnits.where({idNumber: purchaseUnitID.toString()}), function(matchingUnit) {
				gameConfig.set('playerCash', gameConfig.get('playerCash') - matchingUnit.get('productionCost'));
			});
		});
	},
	endTurn: function(attackForce) {
		var gameConfig = this.get('gameState').get('gameConfig');

		if(attackForce) {
			console.log("Turn ended with attack");
		} 

		// update the opponent strength pending the attack
		var turn = gameConfig.get('turnNumber');
		var oppDefenceScore = this.get('gameFunctions').getOpponentDefense(turn);
		gameConfig.set('opponentStrength', gameConfig.get('opponentStrength') + oppDefenceScore);

		// check that there is no winner, if so, end the game
		if(gameConfig.get('opponentStrength') > 100) {
			// the game is over, the opponent has won :(
			return 1;
		}
		
		// increment the turn counter
		gameConfig.set('turnNumber', gameConfig.get('turnNumber') + 1);
		
		
	}
});

/**
 * The major tracking object that holds all of the information about a game that is
 * currently being played. With a game state, a new game can be instantiated and returned
 * to the exact state as another game (For instance, if the player quits the app, the
 * game state can be saved to later recreate the game exactly as it was).
 *		gameConfig the SkyflyerGameConfig used to start the game
 */
var SkyFlyerGameStateModel = Backbone.Model.extend({
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


var InventoryModel = Backbone.Model.extend({
	defaults: {
	    "count":    1
 	}, 
    validate: function(attrs, options) {
    	if(!attrs.idNumber) {
    		return "missing mandatory object value";
    	}
    }
});

var InventoryModelItems = Backbone.Collection.extend({
    model: InventoryModel
  });

var SkyFlyerResearchModel = Backbone.Model.extend({
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
var ResearchCollection = Backbone.Collection.extend({
	model: SkyFlyerResearchModel
})

/**
 * An object that represents a SkyFlyer game piece and its attributes, including:
 * 		idNumber		The global identifier for a game piece
 *		pieceName		The (printable) name of this piece
 *		productionCost	The production unit cost for this unit
 *		attack			The unit's attack score
 *		defense			The unit's defensive score (if it must defend itself)
 * 		experience		The unit's level of experience
 *		detection		The unit's detection score
 *		reuse			Whether this unit may be reused if it survives attack
 */
var GamePieceCollection = Backbone.Collection.extend({
    model: SkyFlyerGamePieceModel
});

var SkyFlyerGamePieceModel = Backbone.Model.extend({
	defaults: {
	    "reuse":    true
 	}, 
    validate: function(attrs, options) {
    	if(!attrs.idNumber || !attrs.pieceName || !attrs.productionCost || !attrs.attack 
    		|| !attrs.defense || !attrs.experience || !attrs.detection) {
    		return "missing mandatory object value";
    	}
    }
});

/**
 * The game configuration that is used as a parameter object to seed a SkyFlyerGameState
 */
var SkyFlyerGameConfigModel = Backbone.Model.extend({

	defaults: {
	    "turnNumber": 0,
	    "playerCash": 0,
	    "playerPoints": 0,
	    "opponentStrength": 50,
	    "gameUnitInventory": null,
	    "gameResearchInventory": null,
	    "playerUnitInventory": null,
	    'researchInventory': null,
	    "buildQueueItem": null,
 	},

 	initialize: function(attrs, options) {
 		// if there is no research inventory given, set it to the start sequence of 0
 		if(!attrs.researchInventory) {
    		var inventory = new InventoryModelItems();
	 		inventory.add(new InventoryModel({'idNumber': '0', 'count': 1}));
	 		this.set('researchInventory', inventory);
    	}
 	}
});



