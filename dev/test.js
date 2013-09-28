
module("Game Initialization");

test("Constants initialize (turn, cash, points, opp str)", function() {
	var gameConfiguration = new SkyFlyerGameConfig(5, 400, 800, 85, null,  buildTutorialResearchTree(), null, null);
	var gameState = new SkyFlyerGameState(gameConfiguration);
	ok(gameState);
	equal(gameState.getTurn(), 5, "turn is 5");
	equal(gameState.getPlayerCash(), 400, "cash is 400");
	equal(gameState.getPoints(), 800, "points are 800");
	equal(gameState.getOpponentStrength(), 85, "opp strength is 85");
});

test("Unit inventory initializes", function() {
	// set up the game configuration
	var playerInventory = new Array();
	playerInventory.push(new Inventory(1001, 10));
	playerInventory.push(new Inventory(2001, 6));
	playerInventory.push(new Inventory(3001, 2));
	playerInventory.push(new Inventory(4001, 0));
	var gameConfiguration = new SkyFlyerGameConfig(0, 0, 0, 0, buildTutorialGameUnitInventory(),  buildTutorialResearchTree(), playerInventory, null);
	var gameState = new SkyFlyerGameState(gameConfiguration);

	// check the player's units
	ok(gameState.getUnitInventory());
	equal(gameState.getUnitInventory().length, 4, "four inventory items");
	equal(gameState.getUnitInventory()[0].getIDNumber(), 1001, "first inventory item id matches");
	equal(gameState.getUnitInventory()[0].getCount(), 10, "first inventory item count matches");
	equal(gameState.getUnitInventory()[1].getIDNumber(), 2001, "second inventory item id matches");
	equal(gameState.getUnitInventory()[1].getCount(), 6, "second inventory item count matches");
	equal(gameState.getUnitInventory()[2].getIDNumber(), 3001, "third inventory item id matches");
	equal(gameState.getUnitInventory()[2].getCount(), 2, "third inventory item count matches");
	equal(gameState.getUnitInventory()[3].getIDNumber(), 4001, "fourth inventory item id matches");
	equal(gameState.getUnitInventory()[3].getCount(), 0, "fourth inventory item count matches");
});

test("Check research project queue", function()  {

	var gameConfiguration = new SkyFlyerGameConfig(0,0, 0, 0, buildTutorialGameUnitInventory(), 
		buildTutorialResearchTree(), null, null, new BuildQueueItem(8001, 5));
	var gameState =  new SkyFlyerGameState(gameConfiguration);

	equal(gameState.getBuildQueueItem().getIDNumber(), 8001, "working on 8001");
	equal(gameState.getBuildQueueItem().getTurnsToComplete(), 5, "5 turns to complete");
});

test("Check units available to build", function() {
	var gameConfiguration = new SkyFlyerGameConfig(0, 0, 0, 0, buildTutorialGameUnitInventory(), buildTutorialResearchTree(), null, null);
	var gameState = new SkyFlyerGameState(gameConfiguration);
	equal(gameState.getAvailableBuildUnits().length, 4, "four units to build");
	
	// check contents
	equal(gameState.getAvailableBuildUnits()[0], 1001, "first unit is Mustang");
	equal(gameState.getAvailableBuildUnits()[1], 2001, "second unit is Liberator");
	equal(gameState.getAvailableBuildUnits()[2], 3001, "third unit is Spitfire");
	equal(gameState.getAvailableBuildUnits()[3], 4001, "fourth unit is Rocket");
});

test("Check research available to conduct", function() {
	var gameConfiguration = new SkyFlyerGameConfig(0, 0, 0, 0, buildTutorialGameUnitInventory(), buildTutorialResearchTree(), null, null);
	var gameState = new SkyFlyerGameState(gameConfiguration);
	equal(gameState.getAvailableResearchProjects().length, 3, "three research projects available");
	
	// check contents
	equal(gameState.getAvailableResearchProjects()[0], 8001, "first project is jet engines");
	equal(gameState.getAvailableResearchProjects()[1], 8002, "second project is dogfighting");
	equal(gameState.getAvailableResearchProjects()[2], 8008, "third project is night bombing");
});

test("Check complex game state formation research available", function() {

	// build the research inventory
	var researchInventory = new Array();
	researchInventory.push(new Inventory(0));
	researchInventory.push(new Inventory(8001));
	researchInventory.push(new Inventory(8002));
	researchInventory.push(new Inventory(8008));
	researchInventory.push(new Inventory(8005));

	// configure the game
	var gameConfiguration = new SkyFlyerGameConfig(0, 0, 0, 0, buildTutorialGameUnitInventory(), buildTutorialResearchTree(), null, researchInventory);
	var gameState = new SkyFlyerGameState(gameConfiguration);

	// check game state
	equal(gameState.getAvailableResearchProjects().length, 5, "five projects now available");
	equal(gameState.getAvailableResearchProjects()[0], 8003, "flagon factory is first project");
	equal(gameState.getAvailableResearchProjects()[1], 8007, "air superiority second project");
	equal(gameState.getAvailableResearchProjects()[2], 8009, "modern rocketry is third project");
	equal(gameState.getAvailableResearchProjects()[3], 8004, "phantom factory is forth");
	equal(gameState.getAvailableResearchProjects()[4], 8006, "stratofortress plant is fifth");
});


test("Check complex game state formation units available to build", function() {

	// build the research inventory
	var researchInventory = new Array();
	researchInventory.push(new Inventory(0));
	researchInventory.push(new Inventory(8001));
	researchInventory.push(new Inventory(8002));
	researchInventory.push(new Inventory(8008));
	researchInventory.push(new Inventory(8005));
	researchInventory.push(new Inventory(8003));
	researchInventory.push(new Inventory(8004));
	researchInventory.push(new Inventory(8006));

	// configure the game
	var gameConfiguration = new SkyFlyerGameConfig(0, 0, 0, 0, buildTutorialGameUnitInventory(), buildTutorialResearchTree(), null, researchInventory);
	var gameState = new SkyFlyerGameState(gameConfiguration);

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

test("Test SkyFlyerFunctions in game", function() {

	// build game functions
	var gameFunctions = new SkyFlyerFunctions(
		new ProductionWrapper(new LinearProduction(2, 4)), 		// player production
		new ProductionWrapper(new LinearProduction(4, 2)));		// opponent defense

	// build simple game with modification
	var gameConfiguration = new SkyFlyerGameConfig(5, 400, 800, 85, buildTutorialGameUnitInventory(), 
		buildTutorialResearchTree(), null, null, null);
	var gameState = new SkyFlyerGameState(gameConfiguration, gameFunctions);

	// get the game functions
	var returnedFunctions = gameState.getProductionFunctions();
	ok(returnedFunctions);

	// test with same vals as above
	equal(returnedFunctions.getPlayerProduction(0), 4, "2 * 0 + 4");
	equal(returnedFunctions.getPlayerProduction(1), 6, "2 * 1 + 4");
	equal(returnedFunctions.getPlayerProduction(5), 14, "2 * 5 + 4");
});

module("Starting A Game");

test("Create a simple SkyFlyerGame", function() {
	ok(new SkyFlyerGame(buildSimpleGame(), null));
})

test("Create a complex SkyFlyerGame", function() {
	ok(new SkyFlyerGame(buildComplexGame()));
})


module("Purchasing Units");

test("Check buy single unit", function() {

	var game = new SkyFlyerGame(buildSimpleGame());

	var gameState = buildSimpleGame();

	equal(game.getState().getUnitInventory()[0].getIDNumber(), 1001);
	equal(game.getState().getUnitInventory()[0].getCount(), 2);
	equal(game.getState().getUnitInventory()[1].getIDNumber(), 2001);
	equal(game.getState().getUnitInventory()[1].getCount(), 0);
	equal(game.getState().getUnitInventory()[2].getIDNumber(), 3001);
	equal(game.getState().getUnitInventory()[2].getCount(), 10);
	equal(game.getState().getUnitInventory()[3].getIDNumber(), 4001);
	equal(game.getState().getUnitInventory()[3].getCount(), 5);

	// record how much cash the player has before the purchase
	var previousCash = game.getState().getPlayerCash();

	// now, I'm going to buy a Liberator at a cost of 100 units
	game.buy(2001);

	equal(game.getState().getPlayerCash() + 100, previousCash, "show that amount was decremented for purchase")

	equal(game.getState().getUnitInventory()[0].getIDNumber(), 1001);
	equal(game.getState().getUnitInventory()[0].getCount(), 2);
	equal(game.getState().getUnitInventory()[1].getIDNumber(), 2001);
	equal(game.getState().getUnitInventory()[1].getCount(), 1, "show that item was purchased");		
	equal(game.getState().getUnitInventory()[2].getIDNumber(), 3001);
	equal(game.getState().getUnitInventory()[2].getCount(), 10);
	equal(game.getState().getUnitInventory()[3].getIDNumber(), 4001);
	equal(game.getState().getUnitInventory()[3].getCount(), 5);


})

function buildSimpleGame() {

	// turn 		4
	// cash 		400
	// points		800
	// opp str 		85

	// we must seed the units that the user starts with...
	var userUnits = new Array();
	userUnits.push(new Inventory(1001, 2));
	userUnits.push(new Inventory(2001, 0));
	userUnits.push(new Inventory(3001, 10));
	userUnits.push(new Inventory(4001, 5));

	// configure the game
	var gameConfiguration = new SkyFlyerGameConfig(5, 400, 800, 85, buildTutorialGameUnitInventory(), 
		buildTutorialResearchTree(), userUnits, null, null);
	return new SkyFlyerGameState(gameConfiguration);

}



function buildComplexGame() {

	// turn 		4
	// cash 		400
	// points		800
	// opp str 		85

	var researchInventory = new Array();
	researchInventory.push(new Inventory(0));
	researchInventory.push(new Inventory(8001));
	researchInventory.push(new Inventory(8002));
	researchInventory.push(new Inventory(8008));
	researchInventory.push(new Inventory(8005));
	researchInventory.push(new Inventory(8003));
	researchInventory.push(new Inventory(8004));
	researchInventory.push(new Inventory(8006));

	// configure the game
	var gameConfiguration = new SkyFlyerGameConfig(5, 400, 800, 85, buildTutorialGameUnitInventory(), 
		buildTutorialResearchTree(), null, researchInventory);
	return new SkyFlyerGameState(gameConfiguration);

}



// tutorial initiation...
function buildTutorialGameUnitInventory() {
	var inventory = new Array();
	inventory.push(new SkyFlyerGamePiece(1001, "Mustang", 100, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1002, "Phantom", 200, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1003, "Eagle", 300, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1004, "Lightning", 400, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(2001, "Liberator", 100, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2002, "Stratofortress", 200, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2003, "Lancer", 300, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2004, "Spirit", 400, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(3001, "Spitfire", 100, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3002, "Flagon", 200, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3003, "Nighthawk", 300, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3004, "Raptor", 400, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(4001, "Rocket", 100, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4002, "Missile", 200, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4003, "ICBM", 300, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4004, "Predator", 400, 4, 3, 3, 5, 1));

	return inventory;
};

function buildTutorialResearchTree() {
	var researchInventory = new Array();
	researchInventory.push(new SkyFlyerResearch(0, "startup", "", 0, [8001, 8002, 8008], [1001, 2001, 3001, 4001]));
	researchInventory.push(new SkyFlyerResearch(8001, "Jet Engines", "Jt", 16, [8003, 8005], null));
	researchInventory.push(new SkyFlyerResearch(8002, "Dogfighting", "Dg", 16, [8007], null));
	researchInventory.push(new SkyFlyerResearch(8003, "Flagon Factory",	"Fl", 16, null, [3002]));
	researchInventory.push(new SkyFlyerResearch(8004, "Phantom Factory", "Ph", 16, null, [1002]));
	researchInventory.push(new SkyFlyerResearch(8005, "Modern Airframes", "M",  16, [8004, 8006], null));

	researchInventory.push(new SkyFlyerResearch(8006, "Stratofortress Plant", "St", 16, null, [2002]));
	researchInventory.push(new SkyFlyerResearch(8007, "Air Superiority", "A", 16, [8012], null));
	researchInventory.push(new SkyFlyerResearch(8008, "Night Bombing", "Nb", 16, [8009], null));
	researchInventory.push(new SkyFlyerResearch(8009, "Modern Rocketry", "Mr", 16, [8010, 8013], null));
	researchInventory.push(new SkyFlyerResearch(8010, "Missile Silo", "Ms", 16, null, [4002]));

	researchInventory.push(new SkyFlyerResearch(8011, "Stealth", "S", 16, [8015, 8019], null));
	researchInventory.push(new SkyFlyerResearch(8012, "Bomber Program", "Bp", 16, [8017, 8022], null));
	researchInventory.push(new SkyFlyerResearch(8013, "Space Center", "Sc", 16, [8016], null));
	researchInventory.push(new SkyFlyerResearch(8014, "Eagle Factory", "Ef", 16, null, [1003]));
	researchInventory.push(new SkyFlyerResearch(8015, "Nighthawk Plant", "Nh", 16, null, [3003]));

	researchInventory.push(new SkyFlyerResearch(8016, "Long Range Missiles", "Bm", 16, null, [4003]));
	researchInventory.push(new SkyFlyerResearch(8017, "Lancer Factory", "Ln", 16, null, [2003]));
	researchInventory.push(new SkyFlyerResearch(8018, "Unmanned Combat", "Ef", 16, [8021, 8023], null));
	researchInventory.push(new SkyFlyerResearch(8019, "Advanced Stealth", "As", 16, [8020, 8026], null));
	researchInventory.push(new SkyFlyerResearch(8020, "Stealth Bomber Plant", "Sb", 16, null, [2004]));

	researchInventory.push(new SkyFlyerResearch(8022, "National Laboratories", "Nl", 16, [8024], null));
	researchInventory.push(new SkyFlyerResearch(8023, "Drone Base", "Dr", 16, null, [4004]));
	researchInventory.push(new SkyFlyerResearch(8024, "Joint Strike Program", "Js", 16, [8025], null));
	researchInventory.push(new SkyFlyerResearch(8025, "Lightning Factory", "Lt", 16, null, [1004]));
	researchInventory.push(new SkyFlyerResearch(8026, "Raptor Assembly Plant", "Rp", 16, null, [3004]));
	return researchInventory;
}