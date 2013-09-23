// Units.js
// Joshua Dickson

/**
 * The game configuration that is used as a parameter object to seed a SkyFlyerGameState
 */
function SkyFlyerGameConfig(turnNumber, playerCash, playerPoints, opponentStrength, gameUnitInventory, gameResearchInventory, unitInventory, researchInventory) {
	this.turnNumber 			= turnNumber;
	this.playerCash 			= playerCash;
	this.playerPoints 			= playerPoints;
	this.opponentStrength 		= opponentStrength;
	this.gameUnitInventory 		= gameUnitInventory;
	this.gameResearchInventory 	= gameResearchInventory;
	this.unitInventory 			= unitInventory;
	this.researchInventory 		= researchInventory;
};

/**
 * The major tracking object that holds all of the information about a game that is
 * currently being played. With a game state, a new game can be instantiated and returned
 * to the exact state as another game (For instance, if the player quits the app, the
 * game state can be saved to later recreate the game exactly as it was).
 *		turn 					the current turn number of a game
 *		playerCash				how much cash the player has
 *		playerPoints			how many points the player has
 *		opponentStrength		the opponent's strength
 *		gameUnitInventory 		SkyFlyerGamePieceInventory (list of all game pieces)
 *		gameResearchInventory	SkyFlyerResearchInventory (list of all research projects)
 *		unitInventory 			Inventory array for all units owned by the player
 *		researchInventory 		sequential Inventory array for all research done for the game
 */
function SkyFlyerGameState(gameConfig) {
	
	/**
	 * Local scope
	 */
	var turn 					= gameConfig.turnNumber;
	var playerCash 				= gameConfig.playerCash;
	var playerPoints		 	= gameConfig.playerPoints;
	var opponentStrength 		= gameConfig.opponentStrength;
	var gameUnitInventory 		= new SkyFlyerGamePieceInventory(gameConfig.gameUnitInventory);
	var gameResearchInventory 	= new SkyFlyerResearchInventory(gameConfig.gameResearchInventory);
	var unitInventory 			= gameConfig.unitInventory;
	var researchInventory 		= gameConfig.researchInventory;
	var unitsAvailableToBuild 	= getUnitsAvailableToBuild();
	var researchAvailableToDo	= getResearchAvailableToConduct();

	/**
	 * Global scope
	 */
	this.turn 					= getTurn;
	this.cash 					= getPlayerCash;
	this.points 				= getPoints;
	this.opponentStrength 		= getOpponentStrength;
	this.unitInventory 			= getUnitInventory;
	this.getAvailableBuildUnits	= getAvailableBuildUnits;
	this.getAvailableResearchProjects = getAvailableResearchProjects;

	/**
	 * Get the list of units available to build as a list of ID numbers
	 */
	function getAvailableBuildUnits() {
		return unitsAvailableToBuild;
	}

	function getAvailableResearchProjects() {
		return researchAvailableToDo;
	}

	/**
	 * Get the inventory of units that this player has
	 */
	function getUnitInventory() {
		return unitInventory;
	}

	/**
	 * Get the current turn of the game
	 */
	function getTurn() {
		return turn;
	};

	/**
	 * Get the player's cash
	 */
	function getPlayerCash() {
		return playerCash;
	};

	/**
	 * Get the player's points
	 */
	function getPoints() {
		return playerPoints;
	};

	/**
	 * Get the opponent's strength
	 */
	function getOpponentStrength() {
		return opponentStrength;
	};

	/**
	 * Build the list of units that can be built from the research projects completed
	 */
	function getUnitsAvailableToBuild() {
		var unitsAvailableToBuild = new Array();
		setResearchInventoryToStartUpIfNull();
		addUnitsToAvailableBuildListForEachResearchInventoryItem();
		return unitsAvailableToBuild;
		
		/**
		 * Add each of the units to the available build list for every completed research item
		 */
		function addUnitsToAvailableBuildListForEachResearchInventoryItem() {
			for(var index = 0; researchInventory != null && index < researchInventory.length; index++) {

				var thisResearchInventoryItem = gameResearchInventory.getResearchByID(researchInventory[index].getIDNumber());
				addResearchInventoryItemUnitsToUnitsAvailableToBuildList();
				
				/** 
				 * Add each of the units to the unitsAvailableToBuild list for this research item
				 */
				function addResearchInventoryItemUnitsToUnitsAvailableToBuildList() {
					for(unitUnlockIndex = 0; unitUnlockIndex < thisResearchInventoryItem.unlockUnit.length; unitUnlockIndex++) {
						if(!isItemIDAlreadyInUnitsAvailableList(thisResearchInventoryItem.unlockUnit[unitUnlockIndex])) {
							unitsAvailableToBuild.push(thisResearchInventoryItem.unlockUnit[unitUnlockIndex]);
						}
					}
				};

				/**
				 * Check to see if an ID matching the given ID already appears in the units available to build list.
				 * For instance, if two research projects unlock the same unit, we only want to add it to the 
				 * allowed build list once.
				 */
				function isItemIDAlreadyInUnitsAvailableList(id) {
					for(var unitsIndex = 0; unitsIndex < unitsAvailableToBuild.length; unitsIndex++) {
						if(unitsAvailableToBuild[unitsIndex] == id) {
							console.log("Returning true...");
							return true;
						}
					}
					return false;
				};
			}

		};

		/**
		 * If the incoming research inventory list is null, we are starting a completely new game. In this case, we want to swap this
		 * null value out so that we are starting with the zero Inventory item, i.e. the startup Inventory item that unlocks all of
		 * the initial functionality of the game with regard to the units and buildings available to build and purchase.
		 */
		function setResearchInventoryToStartUpIfNull() {
			if(researchInventory == null) {
				researchInventory = new Array();
				researchInventory.push(new Inventory(0, 1));
			}
		};
	};

//////////////////////////////////////
	/**
	 * Build the list of units that can be built from the research projects completed
	 */
	function getResearchAvailableToConduct() {
		var researchAvailable = new Array();
		addResearchToAvailableResearchBuildList();
		return researchAvailable;
		
		/**
		 * Add each of the research projects to the available research list for every completed research item
		 */
		function addResearchToAvailableResearchBuildList() {
			for(var index = 0; researchInventory != null && index < researchInventory.length; index++) {

				var thisResearchInventoryItem = gameResearchInventory.getResearchByID(researchInventory[index].getIDNumber());
				addResearchInventoryItemUnitsToUnitsAvailableToBuildList();
				
				/** 
				 * Add each of the units to the researchAvailable list for this research item
				 */
				function addResearchInventoryItemUnitsToUnitsAvailableToBuildList() {
					for(researchUnlockIndex = 0; researchUnlockIndex < thisResearchInventoryItem.unlockResearch.length; researchUnlockIndex++) {
						if(!isItemIDAlreadyInUnitsAvailableList(thisResearchInventoryItem.unlockResearch[researchUnlockIndex])) {
							researchAvailable.push(thisResearchInventoryItem.unlockResearch[researchUnlockIndex]);
						}
					}
				}

				/**
				 * Check to see if an ID matching the given ID already appears in the units available to build list.
				 * For instance, if two research projects unlock the same unit, we only want to add it to the 
				 * allowed build list once.
				 */
				function isItemIDAlreadyInUnitsAvailableList(id) {
					for(var researchIndex = 0; researchIndex < researchAvailable.length; researchIndex++) {
						if(researchAvailable[researchIndex] == id) {
							return true;
						}
					}
					return false;
				}
			}

		};
	}
};



/**
 * An inventory building block that maps an idNumber, for a unit or research, and a counter
 */
function Inventory(idNumber, count) {
	var idNumber 	= idNumber;
	var count 		= count;
	
	this.getIDNumber = getIDNumber;
	this.getCount = getCount;

	/**
	 * Get this inventory item's ID number
	 */
	function getIDNumber() {
		return idNumber;
	}

	/**
	 * Get this inventory item's inventory count
	 */
	function getCount() {
		return count;
	}
}

/**
 * An inventory tracking object used to maintain the list of all research possibilities in the game.
 * @author Joshua Dickson
 * @version September 18, 2013
 */
function SkyFlyerResearchInventory(researchProjects) {
	this.researchProjects 	= researchProjects;
	this.getResearchByID 	= getResearchByID;

	/**
	 * Get a research block in this inventory of research elements by idNumber
	*/
	function getResearchByID(idNumber) {
		for(var index = 0; index < this.researchProjects.length; index++) {
			if(this.researchProjects[index].idNumber == idNumber) {
				return this.researchProjects[index];
			}
		}
	};
};

/**
 * An object that represents a SkyFlyer research element (Technology, building, etc)
 *		idNumber		The global identifier for a research element
 *		researchName	The(printable) name of this research, technology or building
 *		shortName		The (printable) short name for this research
 *		productionCost	The production unit cost of this research project
 *		unlockResearch	The array of research idNumbers that this research makes available
 *		unlockUnit		The array of unit idNumbers that this research makes available
 *		canBeMultiple	Whether or not multiples of this research is possible
 */
function SkyFlyerResearch(idNumber, researchName, shortName, productionCost, unlockResearch, unlockUnit, canBeMultiple) {
	this.idNumber 		= idNumber;
	this.researchName 	= researchName;
	this.shortName 		= shortName;
	this.productionCost = productionCost;
	this.unlockResearch = unlockResearch;
	this.unlockUnit 	= unlockUnit;
};

/**
 * An inventory tracking object used to maintain the list of all units available in the game.
 * @author Joshua Dickson
 * @version September 18, 2013
 */
function SkyFlyerGamePieceInventory(gamePieces) {
	this.gamePieces = gamePieces;
	this.getGamePieceByID = getGamePieceByID;

	/**
	 * Get a game piece in this inventory of game pieces by idNumber
	*/
	function getGamePieceByID(idNumber) {
		for(var index = 0; index < this.gamePieces.length; index++) {
			if(this.gamePieces[index].idNumber == idNumber) {
				return this.gamePieces[index];
			}
		}
	};
}

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
function SkyFlyerGamePiece(idNumber, pieceName, productionCost, attack, defense, experience, detection, reuse) {
	this.idNumber = idNumber;
	this.pieceName = pieceName;
	this.productionCost = productionCost;
	this.attack = attack;
	this.defense = defense;
	this.experience = experience;
	this.detection = detection;
};

