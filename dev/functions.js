
/**
 * A wrapper object for keeping track of myriad functions in use by the program, which
 * will change depending on the difficulty of the game generated
 */
function SkyFlyerFunctions(playerProduction, opponentDefense, randomNumberGenerator) {
	var playerProduction = playerProduction;
	var opponentDefense = opponentDefense;
	var randomNumberGenerator = randomNumberGenerator;

	this.getPlayerProduction = function(turn) {
		return playerProduction.buildProduction(turn);
	}

	this.getOpponentDefense = function(turn) {
		return opponentDefense.buildProduction(turn);
	}

	this.getRandomNumber = function() {
		return randomNumberGenerator.getNextRandomValue();
	}

};


/**
 * A smi-random number generator for use with generating random values used on SkyFlyer tests
 */
function TestRandomNumberGenerator() {
	var currentValue = 0;

	this.getNextRandomValue = function() {
		
		// offset by 0.77, subtract 1 if > 1
		currentValue += 77;
		if(currentValue > 100) {
			currentValue = currentValue - 100;
		}
		return currentValue;
	}
}

/**
 * Create a ProductionWrapper given a variety of Production. A ProductionWrapper
 * wraps an underlying Production function and provides literal and multiplicative
 * bonus' that can be specified to increase the production of the underlying 
 * production function. The initial multiplication bonus is given as one and the
 * literal bonus is zero, yeilding no change to the underlying production
 */
function ProductionWrapper(production) {
	var production = production;
	var multiplier = 1;
	var bonus = 0;
	
	/**
	 * Add the given amount to the direct bonus
	 */
	this.addToBonus = function(bonusAmount) {
		bonus += bonusAmount;
	}

	/**
	 * Get the production value for a given turn
	 */
	this.buildProduction = function(turn) {
		return multiplier * production.buildProduction(turn) + bonus;
	}

	/**
	 * Add the given amount to the multiplier
	 */
	this.addToMultiplier = function(bonusAmount) {
		multiplier += bonusAmount;
	}
}

/**
 * A LinearProduction, of the form mx + b where m is given as the multiplier
 * and o is given by the offset
 */
function LinearProduction(multiplier, offset) {

	var multiplier = multiplier;
	var offset = offset;

	/**
	 * Build a production based on the underlying production equation
	 * for a given turn
	 */
	this.buildProduction = function(turn) {
		return multiplier * turn + offset;
	}
}