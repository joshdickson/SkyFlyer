
// test.js
// Joshua Dickson
// unit tests for the SkyFlyer game

module("Game Initialization");

test("Constants initialize", function() {
	
	var newGameConfiguration = new GameConfiguration({
	    turn: 5,
	    playerCash: 400,
	    playerPoints: 800,
	    opponentStrength: 85,
	    gameResearchInventory: buildTutorialResearchModelTree()
  	});

	equal(newGameConfiguration.get('turn'), 5, "turn is 5");
	equal(newGameConfiguration.get('playerCash'), 400, "cash is 400");
	equal(newGameConfiguration.get('playerPoints'), 800, "points are 800");
	equal(newGameConfiguration.get('opponentStrength'), 85, "opp strength is 85");
});

test("Unit inventory initializes", function() {
	// set up the game configuration
	var inventory = new InventoryCollection();
	inventory.add(new Inventory({'idNumber': 1001, 'count': 10}));
	inventory.add(new Inventory({'idNumber': 2001, 'count': 6}));
	inventory.add(new Inventory({'idNumber': 3001, 'count': 2}));
	inventory.add(new Inventory({'idNumber': 4001, 'count': 0}));

	var gameConfiguration = new GameConfiguration({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'unitInventory': inventory
	});

	var gameState = new GameState({'gameConfig': gameConfiguration});

	// check the player's units
	equal(gameState.get('gameConfig').get('unitInventory').length, 4);
});

test("Check research project queue", function()  {

	var gameConfiguration = new GameConfiguration({
		'buildQueueItem': new Inventory({'idNumber': 8001, 'count': 5})
	});

	var gameState = new GameState({'gameConfig': gameConfiguration});

	equal(gameState.get('gameConfig').get('buildQueueItem').get('idNumber'), 8001, "working on 8001");
	equal(gameState.get('gameConfig').get('buildQueueItem').get('count'), 5, "5 turns to complete");

});

test("Check units available to build", function() {

	var gameState = new GameState({'gameConfig': new GameConfiguration({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree()
	})});

	equal(gameState.getAvailableBuildUnits().length, 4, "four units to build");
	
	// check contents
	equal(gameState.getAvailableBuildUnits()[0], 1001, "first unit is Mustang");
	equal(gameState.getAvailableBuildUnits()[1], 2001, "second unit is Liberator");
	equal(gameState.getAvailableBuildUnits()[2], 3001, "third unit is Spitfire");
	equal(gameState.getAvailableBuildUnits()[3], 4001, "fourth unit is Rocket");
});

test("Check research available to conduct", function() {
	var gameState = new GameState({'gameConfig': new GameConfiguration({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree()
	})});


	equal(gameState.getAvailableResearchProjects().length, 3, "three research projects available");
	
	// check contents
	equal(gameState.getAvailableResearchProjects()[0], 8001, "first project is jet engines");
	equal(gameState.getAvailableResearchProjects()[1], 8002, "second project is dogfighting");
	equal(gameState.getAvailableResearchProjects()[2], 8008, "third project is night bombing");
});

test("Check complex game state formation research available", function() {

	// build the research inventory
	var researchInventory = new InventoryCollection();
	researchInventory.add(new Inventory({'idNumber': 0}));
	researchInventory.add(new Inventory({'idNumber': 8001}));
	researchInventory.add(new Inventory({'idNumber': 8002}));
	researchInventory.add(new Inventory({'idNumber': 8008}));
	researchInventory.add(new Inventory({'idNumber': 8005}));

	// configure the game
	var gameState = new GameState({'gameConfig': new GameConfiguration({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'researchInventory': researchInventory
	})});

	// // check game state
	equal(gameState.getAvailableResearchProjects().length, 5, "five projects now available");
	equal(gameState.getAvailableResearchProjects()[0], 8003, "flagon factory is first project");
	equal(gameState.getAvailableResearchProjects()[1], 8007, "air superiority second project");
	equal(gameState.getAvailableResearchProjects()[2], 8009, "modern rocketry is third project");
	equal(gameState.getAvailableResearchProjects()[3], 8004, "phantom factory is forth");
	equal(gameState.getAvailableResearchProjects()[4], 8006, "stratofortress plant is fifth");
});


test("Check complex game state formation units available to build", function() {

	// build the research inventory
	var researchInventory = new InventoryCollection();
	researchInventory.add(new Inventory({'idNumber': 0}));
	researchInventory.add(new Inventory({'idNumber': 8001}));
	researchInventory.add(new Inventory({'idNumber': 8002}));
	researchInventory.add(new Inventory({'idNumber': 8008}));
	researchInventory.add(new Inventory({'idNumber': 8005}));
	researchInventory.add(new Inventory({'idNumber': 8003}));
	researchInventory.add(new Inventory({'idNumber': 8004}));
	researchInventory.add(new Inventory({'idNumber': 8006}));

	// configure the game
	var gameState = new GameState({'gameConfig': new GameConfiguration({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'researchInventory': researchInventory
	})});

	// check game state
	equal(gameState.getAvailableBuildUnits().length, 4, "still four units available");
	equal(gameState.getAvailableBuildUnits()[0], 4001, "rocket still available");
	equal(gameState.getAvailableBuildUnits()[1], 3002, "flagon now available");
	equal(gameState.getAvailableBuildUnits()[2], 1002, "phantom now available");
	equal(gameState.getAvailableBuildUnits()[3], 2002, "stratofortress now available");

});

module("Functions");

test("Test LinearProduction production", function() {

	var lp = new LinearProduction(1, 1);

	ok(lp);
	equal(lp.buildProduction(0), 1, "1 on first turn");
	equal(lp.buildProduction(1), 2, "2 on second turn");
	equal(lp.buildProduction(5), 6, "6 on sixth turn");

});

test("Test LinearProduction in ProductionWrapper", function() {

	var pw = new ProductionWrapper(new LinearProduction(2, 4));
	ok(pw);
	equal(pw.buildProduction(0), 4, "2 * 0 + 4");
	equal(pw.buildProduction(1), 6, "2 * 1 + 4");
	equal(pw.buildProduction(5), 14, "2 * 5 + 4");

	// now modify the production wrapper
	pw.addToBonus(10);
	equal(pw.buildProduction(0), 14, "2 * 0 + 4 + 10");
	equal(pw.buildProduction(1), 16, "2 * 1 + 4 + 10");
	equal(pw.buildProduction(5), 24, "2 * 5 + 4 + 10");

	// now modify the multiplication wrapper
	pw.addToMultiplier(0.5);
	equal(pw.buildProduction(0), 16, "4(1.5) + 10");
	equal(pw.buildProduction(1), 19, "6(1.5) + 10");
	equal(pw.buildProduction(5), 31, "14(1.5) + 10");

	// add again to the multiplier
	pw.addToMultiplier(0.5);
	equal(pw.buildProduction(0), 18, "4(2) + 10");
	equal(pw.buildProduction(1), 22, "6(2) + 10");
	equal(pw.buildProduction(5), 38, "14(2) + 10");

});

test("Test SkyFlyerFunctions as wrapper", function() {

	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(4, 2)));

	// getting the player production should match above
	equal(gameFunctions.getPlayerProduction(0), 4, "2 * 0 + 4");
	equal(gameFunctions.getPlayerProduction(1), 6, "2 * 1 + 4");
	equal(gameFunctions.getPlayerProduction(5), 14, "2 * 5 + 4");

});

test('Semi-Random Number Generator Test', function() {
	var randomizer = new TestRandomNumberGenerator();
	equal(randomizer.getNextRandomValue(), 77);
	equal(randomizer.getNextRandomValue(), 54);
	equal(randomizer.getNextRandomValue(), 31);
	equal(randomizer.getNextRandomValue(), 8);

})

module("Starting A Game");

test("Create a simple SkyFlyerGame", function() {
	ok(new SkyFlyerGameModel({'gameState': buildSimpleGame()}));
})

test("Create a complex SkyFlyerGame", function() {
	ok(new SkyFlyerGameModel({'gameState': buildComplexGame()}));
})


module("Purchasing Units");

test("Check buy single unit", function() {

	var game = new SkyFlyerGameModel({'gameState': buildSimpleGame()});

	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('unit').get('idNumber'), 1001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('unit').get('idNumber'), 2001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 0);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('unit').get('idNumber'), 3001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('unit').get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 5);

	// record how much cash the player has before the purchase
	var previousCash = game.get('gameState').get('gameConfig').get('playerCash');

	// now, buy a Liberator at a cost of 100 units
	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');
	game.buy(gameUnits.getByID(2001));

	equal(game.get('gameState').get('gameConfig').get('playerCash') + 100, previousCash, "show that amount was decremented for purchase")

	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('unit').get('idNumber'), 1001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('unit').get('idNumber'), 2001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 1);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('unit').get('idNumber'), 3001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('unit').get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 5);
})

test("Check buy several units", function() {

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame()})

	// record the player's cash
	var playerCashBeforeBuying = game.get('gameState').get('gameConfig').get('playerCash');

	// check the player's inventory
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('unit').get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 8);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('unit').get('idNumber'), 3002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('unit').get('idNumber'), 2002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('unit').get('idNumber'), 1002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 1);

	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');

	// buy three units
	game.buy(gameUnits.getByID(2002));
	game.buy(gameUnits.getByID(4001));
	game.buy(gameUnits.getByID(4001));

	// recheck the player's inventory with additions
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('unit').get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('unit').get('idNumber'), 3002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('unit').get('idNumber'), 2002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('unit').get('idNumber'), 1002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 1);

	// check that the cash was spent
	equal(game.get('gameState').get('gameConfig').get('playerCash') + 400, playerCashBeforeBuying, "show that amount was decremented for purchase")

});

module('Simple Game Plays');

test('Turn increments at end of turn', function() {

	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(4, 2)));

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// turn number before any turns are taken, set from complex game
	equal(game.get('gameState').get('gameConfig').get('turnNumber'), 3);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('turnNumber'), 4);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('turnNumber'), 5);

});

test('Player does not make an attack, loses game', function() {

	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(4, 2)));

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// get the opponent's strength
	var oppStrength = game.get('gameState').get('gameConfig').get('opponentStrength');
	
	// check starting strength
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14 + 18);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14 + 18 + 22);
	
	// the opponent now wins the game
	equal(game.endTurn(), 1);

});

test('Player purchases several items but never makes move, loses game', function() {
	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(4, 2)));

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// get the opponent's strength
	var oppStrength = game.get('gameState').get('gameConfig').get('opponentStrength');
	
	// check starting strength
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43);
	game.endTurn();

	// get the game units for easier buying
	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');

	game.buy(gameUnits.getByID(4001)); // buy something

	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14);
	game.endTurn();
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14 + 18);
	game.endTurn();

	game.buy(gameUnits.getByID(4001)); // buy something

	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 14 + 18 + 22);
	
	// the opponent now wins the game
	equal(game.endTurn(), 1);

});

test('Player makes a one-unit attack attempt', function() {
	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(4, 2)), new TestRandomNumberGenerator());

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// first, we are artificially going to give unit 2002 very little chance to defend itself by ensuring it's detected
	game.get('gameState').get('gameConfig').get('gameUnitInventory').getByID(2002).set('defense', 1);

	// set up the attack wave
	var attackWave = new InventoryCollection();
	var attackingUnit = game.get('gameState').get('gameConfig').get('gameUnitInventory').getByID(2002);
	attackWave.add(new Inventory({'unit': attackingUnit, 'count': 1}));
	game.get('gameState').get('gameConfig').get('playerUnitInventory').findWhere({ unit: attackingUnit }).set('count', 1);
	game.get('gameState').get('gameConfig').set('attackForce', attackWave);

	// this is a weak attack, the player will lose this unit
	game.endTurn();

	// check the player's inventory
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 1);


});

test('Player makes attack attempt with two units', function() {
	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(1, 1)), new TestRandomNumberGenerator());

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// strength of 43 before attack
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43);

	// set up the attack wave...
	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');
	
	var attackWave = new InventoryCollection();
	attackWave.add(new Inventory({'unit': gameUnits.getByID(2002), 'count': 1}));
	game.get('gameState').get('gameConfig').get('playerUnitInventory').findWhere({ unit: gameUnits.getByID(2002) }).set('count', 1);
	attackWave.add(new Inventory({'unit': gameUnits.getByID(3002), 'count': 1}));
	game.get('gameState').get('gameConfig').get('playerUnitInventory').findWhere({ unit: gameUnits.getByID(3002) }).set('count', 2);
	game.get('gameState').get('gameConfig').set('attackForce', attackWave);

	game.endTurn();

	// check the updated opponent score...
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43 + 1.4);

	// check the updated unit counts
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('unit').get('idNumber'), 3002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('unit').get('idNumber'), 2002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 1);

});

test('Player makes large attack and wins', function() {
	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(1, 1)), new TestRandomNumberGenerator());

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// strength of 43 before attack
	equal(game.get('gameState').get('gameConfig').get('opponentStrength'), 43);

	// set up the attack wave...
	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');
	var attackWave = new InventoryCollection();
	attackWave.add(new Inventory({'unit': gameUnits.getByID(4001), 'count': 7}));
	attackWave.add(new Inventory({'unit': gameUnits.getByID(2002), 'count': 2}));
	attackWave.add(new Inventory({'unit': gameUnits.getByID(3002), 'count': 3}));
	game.get('gameState').get('gameConfig').set('attackForce', attackWave);

	equal(game.endTurn(), 0);

});

module('Boundary cases');

test('Cannot try to make moves once the game is over', function() {
	// set up game functions
	var gameFunctions = new SkyFlyerFunctions(new ProductionWrapper(new LinearProduction(2, 4)), 
		new ProductionWrapper(new LinearProduction(1, 1)), new TestRandomNumberGenerator());

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame(), 'gameFunctions': gameFunctions});

	// set up the attack wave...
	var attackWave = new InventoryCollection();
	var gameUnits = game.get('gameState').get('gameConfig').get('gameUnitInventory');
	attackWave.add(new Inventory({'unit': gameUnits.getByID(4001), 'count': 7}));
	attackWave.add(new Inventory({'unit': gameUnits.getByID(2002), 'count': 2}));
	attackWave.add(new Inventory({'unit': gameUnits.getByID(3002), 'count': 3}));
	game.get('gameState').get('gameConfig').set('attackForce', attackWave);

	equal(game.endTurn(), 0);

	// throw error when trying to take a turn with the game already over
	raises(function () {
        game.endTurn();
    }, Error);

});























// 