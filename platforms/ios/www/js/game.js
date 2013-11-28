/**
 * game.js
 * Joshua Dickson
 */

// set up game functions
var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
	new ProductionWrapper(new LinearProduction(1, 1)), new TestRandomNumberGenerator());

// the game player for the tutorial
var gamePlayer = new Player({
	'rank': 'Lieutennant'
});

// the game model
var GameModel = new SkyFlyerGameModel({
	'gameState': buildTutorialGame(), 
	'gameFunctions': gameFunctions,
	'player': gamePlayer
});
