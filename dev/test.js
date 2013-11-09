
module("Game Initialization");

test("Constants initialize", function() {
	
	var newGameConfiguration = new SkyFlyerGameConfigModel({
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
	var inventoryItems = new InventoryModelItems();
	inventoryItems.add(new InventoryModel({'idNumber': 1001, 'count': 10}));
	inventoryItems.add(new InventoryModel({'idNumber': 2001, 'count': 6}));
	inventoryItems.add(new InventoryModel({'idNumber': 3001, 'count': 2}));
	inventoryItems.add(new InventoryModel({'idNumber': 4001, 'count': 0}));

	var gameConfiguration = new SkyFlyerGameConfigModel({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'unitInventory': inventoryItems
	});

	var gameState = new SkyFlyerGameStateModel({'gameConfig': gameConfiguration});

	// check the player's units
	equal(gameState.get('gameConfig').get('unitInventory').length, 4);
});

test("Check research project queue", function()  {

	var gameConfiguration = new SkyFlyerGameConfigModel({
		'buildQueueItem': new InventoryModel({'idNumber': 8001, 'count': 5})
	});

	var gameState = new SkyFlyerGameStateModel({'gameConfig': gameConfiguration});

	equal(gameState.get('gameConfig').get('buildQueueItem').get('idNumber'), 8001, "working on 8001");
	equal(gameState.get('gameConfig').get('buildQueueItem').get('count'), 5, "5 turns to complete");

});

test("Check units available to build", function() {

	var gameState = new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
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
	var gameState = new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
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
	var researchInventory = new InventoryModelItems();
	researchInventory.add(new InventoryModel({'idNumber': 0}));
	researchInventory.add(new InventoryModel({'idNumber': 8001}));
	researchInventory.add(new InventoryModel({'idNumber': 8002}));
	researchInventory.add(new InventoryModel({'idNumber': 8008}));
	researchInventory.add(new InventoryModel({'idNumber': 8005}));

	// configure the game
	var gameState = new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
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
	var researchInventory = new InventoryModelItems();
	researchInventory.add(new InventoryModel({'idNumber': 0}));
	researchInventory.add(new InventoryModel({'idNumber': 8001}));
	researchInventory.add(new InventoryModel({'idNumber': 8002}));
	researchInventory.add(new InventoryModel({'idNumber': 8008}));
	researchInventory.add(new InventoryModel({'idNumber': 8005}));
	researchInventory.add(new InventoryModel({'idNumber': 8003}));
	researchInventory.add(new InventoryModel({'idNumber': 8004}));
	researchInventory.add(new InventoryModel({'idNumber': 8006}));

	// configure the game
	var gameState = new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
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
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('idNumber'), 1001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('idNumber'), 2001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 0);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('idNumber'), 3001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 5);

	// record how much cash the player has before the purchase
	var previousCash = game.get('gameState').get('gameConfig').get('playerCash');

	// now, buy a Liberator at a cost of 100 units
	game.buy(2001);

	equal(game.get('gameState').get('gameConfig').get('playerCash') + 100, previousCash, "show that amount was decremented for purchase")

	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('idNumber'), 1001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('idNumber'), 2001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 1);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('idNumber'), 3001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 5);
})

test("Check buy several units", function() {

	// set up the game
	var game = new SkyFlyerGameModel({'gameState': buildComplexGame()})

	// record the player's cash
	var playerCashBeforeBuying = game.get('gameState').get('gameConfig').get('playerCash');

	// check the player's inventory
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 8);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('idNumber'), 3002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('idNumber'), 2002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 2);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('idNumber'), 1002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 1);

	// buy three units
	game.buy(2002);
	game.buy(4001);
	game.buy(4001);

	// recheck the player's inventory with additions
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').length, 4);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('idNumber'), 4001);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(0).get('count'), 10);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('idNumber'), 3002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(1).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('idNumber'), 2002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(2).get('count'), 3);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('idNumber'), 1002);
	equal(game.get('gameState').get('gameConfig').get('playerUnitInventory').at(3).get('count'), 1);

	// check that the cash was spent
	equal(game.get('gameState').get('gameConfig').get('playerCash') + 400, playerCashBeforeBuying, "show that amount was decremented for purchase")

})

function buildSimpleGame() {

	// turn 		5
	// cash 		400
	// points		800
	// opp str 		85

	// seed the units that the user starts with...
	var playerUnitInventory = new InventoryModelItems();
	playerUnitInventory.add(new InventoryModel({'idNumber': 1001, 'count': 2}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 2001, 'count': 0}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 3001, 'count': 10}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 4001, 'count': 5}));

	// configure the game
	return new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'playerUnitInventory': playerUnitInventory,
		'turnNumber': 5,
		'playerCash': 400,
		'playerPoints': 800,
		'opponentStrength': 85,
		
	})});
}

function buildComplexGame() {

	// turn 		4
	// cash 		400
	// points		800
	// opp str 		85

	// build the research inventory
	var researchInventory = new InventoryModelItems();
	researchInventory.add(new InventoryModel({'idNumber': 0}));
	researchInventory.add(new InventoryModel({'idNumber': 8001}));
	researchInventory.add(new InventoryModel({'idNumber': 8002}));
	researchInventory.add(new InventoryModel({'idNumber': 8008}));
	researchInventory.add(new InventoryModel({'idNumber': 8005}));
	researchInventory.add(new InventoryModel({'idNumber': 8003}));
	researchInventory.add(new InventoryModel({'idNumber': 8004}));
	researchInventory.add(new InventoryModel({'idNumber': 8006}));

	// seed the units that the user starts with...
	var playerUnitInventory = new InventoryModelItems();
	playerUnitInventory.add(new InventoryModel({'idNumber': 4001, 'count': 8}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 3002, 'count': 3}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 2002, 'count': 2}));
	playerUnitInventory.add(new InventoryModel({'idNumber': 1002, 'count': 1}));

	// configure the game
	return new SkyFlyerGameStateModel({'gameConfig': new SkyFlyerGameConfigModel({
		'gameUnitInventory': buildTutorialGameUnitModelInventory(),
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'researchInventory': researchInventory,
		'playerUnitInventory': playerUnitInventory,
		'turnNumber': 5,
		'playerCash': 400,
		'playerPoints': 800,
		'opponentStrength': 85
	})});
}

function buildTutorialGameUnitModelInventory() {
	var gamePieces = new GamePieceCollection();
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '1001', 'pieceName': 'Mustang', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '1002', 'pieceName': 'Phantom', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1001]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '1003', 'pieceName': 'Eagle', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1002]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '1004', 'pieceName': 'Lightning', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1003]}));

	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '2001', 'pieceName': 'Liberator', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '2002', 'pieceName': 'Stratofortress', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [2001]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '2003', 'pieceName': 'Lancer', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [2002]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '2004', 'pieceName': 'Spirit', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [2003]}));

	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '3001', 'pieceName': 'Spitfire', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '3002', 'pieceName': 'Flagon', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [3001]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '3003', 'pieceName': 'Nighthawk', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [3002]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '3004', 'pieceName': 'Raptor', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [3003]}));

	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '4001', 'pieceName': 'Rocket', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '4002', 'pieceName': 'Missile', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4001]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '4003', 'pieceName': 'ICBM', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4002]}));
	gamePieces.add(new SkyFlyerGamePieceModel({'idNumber': '4004', 'pieceName': 'Predator', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4003]}));


	return gamePieces;
}

function buildTutorialResearchModelTree() {
	var researchProjects = new ResearchCollection();

	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '0', 'researchName': 'startup', 'shortName': '', 'productionCost': '0', 'unlockResearch': [8001, 8002, 8008], 'unlockUnit': [1001, 2001, 3001, 4001]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8001', 'researchName': 'Jet Engines', 'shortName': 'Jt', 'productionCost': '16', 'unlockResearch': [8003, 8005]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8002', 'researchName': 'Dogfighting', 'shortName': 'Dg', 'productionCost': '16', 'unlockResearch': [8007]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8003', 'researchName': 'Flagon Factory', 'Fl': '', 'productionCost': '16', 'unlockUnit': [3002]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8004', 'researchName': 'Phantom Factory', 'shortName': 'Ph', 'productionCost': '16', 'unlockUnit': [1002]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8005', 'researchName': 'Modern Airframes', 'shortName': 'M', 'productionCost': '16', 'unlockResearch': [8004, 8006]}));

	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8006', 'researchName': 'Stratofortress Plant', 'shortName': 'St', 'productionCost': '16', 'unlockUnit': [2002]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8007', 'researchName': 'Air Superiority', 'shortName': 'A', 'productionCost': '16', 'unlockResearch': [8012]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8008', 'researchName': 'Night Bombing', 'shortName': 'Nb', 'productionCost': '16', 'unlockResearch': [8009]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8009', 'researchName': 'Modern Rocketry', 'shortName': 'Mr', 'productionCost': '16', 'unlockResearch': [8010, 8013]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8010', 'researchName': 'Missile Silo', 'shortName': 'Ms', 'productionCost': '16', 'unlockUnit': [4002]}));

	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8011', 'researchName': 'Stealth', 'shortName': 'S', 'productionCost': '16', 'unlockResearch': [8015, 8019]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8012', 'researchName': 'Bomber Program', 'shortName': 'Bp', 'productionCost': '16', 'unlockResearch': [8017, 8022]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8013', 'researchName': 'Space Center', 'shortName': 'Sc', 'productionCost': '16', 'unlockResearch': [8016]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8014', 'researchName': 'Eagle Factory', 'shortName': 'Ef', 'productionCost': '16', 'unlockUnit': [1003]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8015', 'researchName': 'Nighthawk Plant', 'shortName': 'Nh', 'productionCost': '16', 'unlockUnit': [3003]}));

	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8016', 'researchName': 'Long Range Missiles', 'shortName': 'Bm', 'productionCost': '16', 'unlockUnit': [4003]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8017', 'researchName': 'Lancer Factory', 'shortName': 'Ln', 'productionCost': '16', 'unlockUnit': [2003]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8018', 'researchName': 'Unmanned Combat', 'shortName': 'Un', 'productionCost': '16', 'unlockResearch': [8021, 8023]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8019', 'researchName': 'Advanced Stealth', 'shortName': 'AS', 'productionCost': '16', 'unlockResearch': [8020, 8026]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8020', 'researchName': 'Stealth Bomber Plant', 'shortName': 'Sb', 'productionCost': '16', 'unlockUnit': [2004]}));

	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8022', 'researchName': 'National Laboratories', 'shortName': 'Nl', 'productionCost': '16', 'unlockResearch': [8024]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8023', 'researchName': 'Drone Base', 'shortName': 'Dr', 'productionCost': '16', 'unlockUnit': [4004]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8024', 'researchName': 'Joint Strike Program', 'shortName': 'Js', 'productionCost': '16', 'unlockResearch': [8025]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8025', 'researchName': 'Lightning Factory', 'shortName': 'Lt', 'productionCost': '16', 'unlockUnit': [1004]}));
	researchProjects.add(new SkyFlyerResearchModel({'idNumber': '8026', 'researchName': 'Raptor Assembly Plant', 'shortName': 'Rp', 'productionCost': '16', 'unlockUnit': [3004]}));

	return researchProjects;
}