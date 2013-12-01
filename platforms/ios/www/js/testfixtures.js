/**
 * testfixtures.js

 * @author Joshua Dickson

 * test fixtures for the SkyFlyer game test
 **/

function buildSimpleGame() {

	// turn 		5
	// cash 		400
	// points		800
	// opp str 		85

	// game units
	var gameUnits = buildTutorialGameUnitModelInventory();

	// seed the units that the user starts with...
	var playerUnitInventory = new InventoryCollection();
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(1001), 'count': 2}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(2001), 'count': 0}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(3001), 'count': 10}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(4001), 'count': 5}));

	// configure the game
	return new GameState({
		'gameUnitInventory': gameUnits,
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'playerUnitInventory': playerUnitInventory,
		'turnNumber': 5,
		'playerCash': 400,
		'playerPoints': 800,
		'opponentStrength': 85,
	});
}

function buildComplexGame() {

	// turn 		4
	// cash 		400
	// points		800
	// opp str 		43

	// build the units for the game
	var gameUnits = buildTutorialGameUnitModelInventory();
	var gameResearch = buildTutorialResearchModelTree();

	// build the research inventory
	var researchInventory = new InventoryCollection();
	researchInventory.add(new Inventory({'research': gameResearch.getByID(0)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8001)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8002)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8008)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8005)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8003)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8004)}));
	researchInventory.add(new Inventory({'research': gameResearch.getByID(8006)}));

	// seed the units that the user starts with...
	var playerUnitInventory = new InventoryCollection();
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(4001), 'count': 8}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(3002), 'count': 3}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(2002), 'count': 2}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(1002), 'count': 1}));

	// configure the game
	return new GameState({
		'gameUnitInventory': gameUnits,
		'gameResearchInventory': gameResearch,
		'researchInventory': researchInventory,
		'playerUnitInventory': playerUnitInventory,
		'turnNumber': 3,
		'playerCash': 400,
		'playerPoints': 800,
		'opponentStrength': 43
	});
}

function buildTutorialGame() {

	var gameUnits = buildTutorialGameUnitModelInventory();

	// seed the units that the user starts with...
	var playerUnitInventory = new InventoryCollection();
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(1001), 'count': 8}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(2001), 'count': 3}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(3001), 'count': 6}));
	playerUnitInventory.add(new Inventory({'unit': gameUnits.getByID(4001), 'count': 0}));

	// configure the game
	return new GameState({
		'gameUnitInventory': gameUnits,
		'gameResearchInventory': buildTutorialResearchModelTree(),
		'playerUnitInventory': playerUnitInventory,
		'playerCash': 840,
		'playerPoints': 368,
		'opponentStrength': 25
	});
}

function buildTutorialGameUnitModelInventory() {
	var gamePieces = new GamePieceCollection();
	gamePieces.add(new GamePiece({'idNumber': '1001', 'pieceName': 'Mustang', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new GamePiece({'idNumber': '1002', 'pieceName': 'Phantom', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1001]}));
	gamePieces.add(new GamePiece({'idNumber': '1003', 'pieceName': 'Eagle', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1002]}));
	gamePieces.add(new GamePiece({'idNumber': '1004', 'pieceName': 'Lightning', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [1003]}));

	gamePieces.add(new GamePiece({'idNumber': '2001', 'pieceName': 'Liberator', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new GamePiece({'idNumber': '2002', 'pieceName': 'Stratofortress', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '16', 'makesObsolete': [2001]}));
	gamePieces.add(new GamePiece({'idNumber': '2003', 'pieceName': 'Lancer', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [2002]}));
	gamePieces.add(new GamePiece({'idNumber': '2004', 'pieceName': 'Spirit', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [2003]}));

	gamePieces.add(new GamePiece({'idNumber': '3001', 'pieceName': 'Spitfire', 'productionCost': '100', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5'}));
	gamePieces.add(new GamePiece({'idNumber': '3002', 'pieceName': 'Flagon', 'productionCost': '200', 'attack': '4', 'defense': '8', 'experience': '3', 'detection': '5', 'makesObsolete': [3001]}));
	gamePieces.add(new GamePiece({'idNumber': '3003', 'pieceName': 'Nighthawk', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [3002]}));
	gamePieces.add(new GamePiece({'idNumber': '3004', 'pieceName': 'Raptor', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [3003]}));

	gamePieces.add(new GamePiece({'idNumber': '4001', 'pieceName': 'Rocket', 'productionCost': '100', 'attack': '10', 'defense': '3', 'experience': '3', 'detection': '1'}));
	gamePieces.add(new GamePiece({'idNumber': '4002', 'pieceName': 'Missile', 'productionCost': '200', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4001]}));
	gamePieces.add(new GamePiece({'idNumber': '4003', 'pieceName': 'ICBM', 'productionCost': '300', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4002]}));
	gamePieces.add(new GamePiece({'idNumber': '4004', 'pieceName': 'Predator', 'productionCost': '400', 'attack': '4', 'defense': '3', 'experience': '3', 'detection': '5', 'makesObsolete': [4003]}));

	return gamePieces;
}

function buildTutorialResearchModelTree() {
	var researchProjects = new ResearchCollection();

	researchProjects.add(new Research({'idNumber': '0', 'researchName': 'startup', 'shortName': '', 'productionCost': '0', 'unlockResearch': [8001, 8002, 8008], 'unlockUnit': [1001, 2001, 3001, 4001]}));
	researchProjects.add(new Research({'idNumber': '8001', 'researchName': 'Jet Engines', 'shortName': 'Jt', 'productionCost': '16', 'unlockResearch': [8003, 8005]}));
	researchProjects.add(new Research({'idNumber': '8002', 'researchName': 'Dogfighting', 'shortName': 'Dg', 'productionCost': '16', 'unlockResearch': [8007]}));
	researchProjects.add(new Research({'idNumber': '8003', 'researchName': 'Flagon Factory', 'Fl': '', 'productionCost': '16', 'unlockUnit': [3002]}));
	researchProjects.add(new Research({'idNumber': '8004', 'researchName': 'Phantom Factory', 'shortName': 'Ph', 'productionCost': '16', 'unlockUnit': [1002]}));
	researchProjects.add(new Research({'idNumber': '8005', 'researchName': 'Modern Airframes', 'shortName': 'M', 'productionCost': '16', 'unlockResearch': [8004, 8006]}));

	researchProjects.add(new Research({'idNumber': '8006', 'researchName': 'Stratofortress Plant', 'shortName': 'St', 'productionCost': '16', 'unlockUnit': [2002]}));
	researchProjects.add(new Research({'idNumber': '8007', 'researchName': 'Air Superiority', 'shortName': 'A', 'productionCost': '16', 'unlockResearch': [8012]}));
	researchProjects.add(new Research({'idNumber': '8008', 'researchName': 'Night Bombing', 'shortName': 'Nb', 'productionCost': '16', 'unlockResearch': [8009]}));
	researchProjects.add(new Research({'idNumber': '8009', 'researchName': 'Modern Rocketry', 'shortName': 'Mr', 'productionCost': '16', 'unlockResearch': [8010, 8013]}));
	researchProjects.add(new Research({'idNumber': '8010', 'researchName': 'Missile Silo', 'shortName': 'Ms', 'productionCost': '16', 'unlockUnit': [4002]}));

	researchProjects.add(new Research({'idNumber': '8011', 'researchName': 'Stealth', 'shortName': 'S', 'productionCost': '16', 'unlockResearch': [8015, 8019]}));
	researchProjects.add(new Research({'idNumber': '8012', 'researchName': 'Bomber Program', 'shortName': 'Bp', 'productionCost': '16', 'unlockResearch': [8017, 8022]}));
	researchProjects.add(new Research({'idNumber': '8013', 'researchName': 'Space Center', 'shortName': 'Sc', 'productionCost': '16', 'unlockResearch': [8016]}));
	researchProjects.add(new Research({'idNumber': '8014', 'researchName': 'Eagle Factory', 'shortName': 'Ef', 'productionCost': '16', 'unlockUnit': [1003]}));
	researchProjects.add(new Research({'idNumber': '8015', 'researchName': 'Nighthawk Plant', 'shortName': 'Nh', 'productionCost': '16', 'unlockUnit': [3003]}));

	researchProjects.add(new Research({'idNumber': '8016', 'researchName': 'Long Range Missiles', 'shortName': 'Bm', 'productionCost': '16', 'unlockUnit': [4003]}));
	researchProjects.add(new Research({'idNumber': '8017', 'researchName': 'Lancer Factory', 'shortName': 'Ln', 'productionCost': '16', 'unlockUnit': [2003]}));
	researchProjects.add(new Research({'idNumber': '8018', 'researchName': 'Unmanned Combat', 'shortName': 'Un', 'productionCost': '16', 'unlockResearch': [8021, 8023]}));
	researchProjects.add(new Research({'idNumber': '8019', 'researchName': 'Advanced Stealth', 'shortName': 'AS', 'productionCost': '16', 'unlockResearch': [8020, 8026]}));
	researchProjects.add(new Research({'idNumber': '8020', 'researchName': 'Stealth Bomber Plant', 'shortName': 'Sb', 'productionCost': '16', 'unlockUnit': [2004]}));

	researchProjects.add(new Research({'idNumber': '8022', 'researchName': 'National Laboratories', 'shortName': 'Nl', 'productionCost': '16', 'unlockResearch': [8024]}));
	researchProjects.add(new Research({'idNumber': '8023', 'researchName': 'Drone Base', 'shortName': 'Dr', 'productionCost': '16', 'unlockUnit': [4004]}));
	researchProjects.add(new Research({'idNumber': '8024', 'researchName': 'Joint Strike Program', 'shortName': 'Js', 'productionCost': '16', 'unlockResearch': [8025]}));
	researchProjects.add(new Research({'idNumber': '8025', 'researchName': 'Lightning Factory', 'shortName': 'Lt', 'productionCost': '16', 'unlockUnit': [1004]}));
	researchProjects.add(new Research({'idNumber': '8026', 'researchName': 'Raptor Assembly Plant', 'shortName': 'Rp', 'productionCost': '16', 'unlockUnit': [3004]}));

	return researchProjects;
}