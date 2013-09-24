
module("Game Initialization");

test("Constants initialize (turn, cash, points, opp str)", function() {
	var gameConfiguration = new SkyFlyerGameConfig(5, 400, 800, 85, null,  buildTutorialResearchTree(), null, null);
	var gameState = new SkyFlyerGameState(gameConfiguration);
	ok(gameState);
	equal(gameState.turn(), 5, "turn is 4");
	equal(gameState.cash(), 400, "cash is 400");
	equal(gameState.points(), 800, "points are 800");
	equal(gameState.opponentStrength(), 85, "opp strength is 85");
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
	ok(gameState.unitInventory());
	equal(gameState.unitInventory().length, 4, "four inventory items");
	equal(gameState.unitInventory()[0].getIDNumber(), 1001, "first inventory item id matches");
	equal(gameState.unitInventory()[0].getCount(), 10, "first inventory item count matches");
	equal(gameState.unitInventory()[1].getIDNumber(), 2001, "second inventory item id matches");
	equal(gameState.unitInventory()[1].getCount(), 6, "second inventory item count matches");
	equal(gameState.unitInventory()[2].getIDNumber(), 3001, "third inventory item id matches");
	equal(gameState.unitInventory()[2].getCount(), 2, "third inventory item count matches");
	equal(gameState.unitInventory()[3].getIDNumber(), 4001, "fourth inventory item id matches");
	equal(gameState.unitInventory()[3].getCount(), 0, "fourth inventory item count matches");
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

test("Check complex game state formation", function() {

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



// tutorial initiation...
function buildTutorialGameUnitInventory() {
	var inventory = new Array();
	inventory.push(new SkyFlyerGamePiece(1001, "Mustang", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1002, "Phantom", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1003, "Eagle", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(1004, "Lightning", 1, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(2001, "Liberator", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2002, "Stratofortress", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2003, "Lancer", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(2004, "Spirit", 1, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(3001, "Spitfire", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3002, "Flagon", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3003, "Nighthawk", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(3004, "Raptor", 1, 4, 3, 3, 5, 1));

	inventory.push(new SkyFlyerGamePiece(4001, "Rocket", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4002, "Missile", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4003, "ICBM", 1, 4, 3, 3, 5, 1));
	inventory.push(new SkyFlyerGamePiece(4004, "Predator", 1, 4, 3, 3, 5, 1));

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