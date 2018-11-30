// Data manager
"use strict";

// ===== Canvas Data ======================================================= //

// Grid configuration
const gridStart = -280,
    gridEnd = 280,
    gridCount = 34,
    gridSide = (gridEnd - gridStart) / gridCount;

// ===== Building Data ===================================================== //

// Data from Wikia http://age-of-empires-castle-siege.wikia.com/wiki/Main_Page
// Amount of each building that you can build
// Military: ArmyCamp to University
// Economy: Cathdral to Road
// Defense: ArcherTower to MusketTower
// (Keep, Wonder, and WallTroop are special)
const ageData = [
    { // Age 1
        Keep: 1,
        ArmyCamp: 1,
        TroopUpgrade: 1,
        Embassy: 0,
        University: 0,
        Wonder: 0,
        Cathedral: 0,
        FarmMill: 2,
        SiloLumb: 2,
        Quarry: 0,
        Storehouse: 0,
        Road: 20,
        ArcherTower: 1,
        XBowTower: 0,
        CannonTower: 0,
        Catapult: 0,
        Trebuchet: 0,
        FlameTower: 0,
        GuardHouse: 0,
        PatrolPoint: 0,
        Wall: 0,
        Caltrops: 0,
        FireTrap: 0,
        EngineerTrap: 0,
        WatchSignal: 0,
        MusketTower: 0,
        WallTroop: 0,
    },
    { // Age 2
        Keep: 1,
        ArmyCamp: 2,
        TroopUpgrade: 2,
        Embassy: 0,
        University: 0,
        Wonder: 0,
        Cathedral: 0,
        FarmMill: 4,
        SiloLumb: 2,
        Quarry: 0,
        Storehouse: 0,
        Road: 20,
        ArcherTower: 2,
        XBowTower: 0,
        CannonTower: 0,
        Catapult: 0,
        Trebuchet: 0,
        FlameTower: 0,
        GuardHouse: 0,
        PatrolPoint: 1,
        Wall: 0,
        Caltrops: 0,
        FireTrap: 0,
        EngineerTrap: 0,
        WatchSignal: 0,
        MusketTower: 0,
        WallTroop: 0,
    },
    { // Age 3
        Keep: 1,
        ArmyCamp: 2,
        TroopUpgrade: 4,
        Embassy: 0,
        University: 1,
        Wonder: 0,
        Cathedral: 1,
        FarmMill: 6,
        SiloLumb: 4,
        Quarry: 0,
        Storehouse: 1,
        Road: 20,
        ArcherTower: 3,
        XBowTower: 0,
        CannonTower: 0,
        Catapult: 1,
        Trebuchet: 0,
        FlameTower: 0,
        GuardHouse: 1,
        PatrolPoint: 1,
        Wall: 35,
        Caltrops: 5,
        FireTrap: 0,
        EngineerTrap: 0,
        WatchSignal: 0,
        MusketTower: 0,
        WallTroop: 0,
    },
    { // Age 4
        Keep: 1,
        ArmyCamp: 2,
        TroopUpgrade: 4,
        Embassy: 0,
        University: 1,
        Wonder: 0,
        Cathedral: 1,
        FarmMill: 6,
        SiloLumb: 4,
        Quarry: 2,
        Storehouse: 1,
        Road: 38,
        ArcherTower: 4,
        XBowTower: 1,
        CannonTower: 0,
        Catapult: 1,
        Trebuchet: 0,
        FlameTower: 0,
        GuardHouse: 1,
        PatrolPoint: 2,
        Wall: 55,
        Caltrops: 8,
        FireTrap: 0,
        EngineerTrap: 0,
        WatchSignal: 1,
        MusketTower: 0,
        WallTroop: 4,
    },
    { // Age 5
        Keep: 1,
        ArmyCamp: 3,
        TroopUpgrade: 6,
        Embassy: 1,
        University: 1,
        Wonder: 3,
        Cathedral: 1,
        FarmMill: 6,
        SiloLumb: 6,
        Quarry: 2,
        Storehouse: 1,
        Road: 38,
        ArcherTower: 5,
        XBowTower: 2,
        CannonTower: 1,
        Catapult: 2,
        Trebuchet: 0,
        FlameTower: 0,
        GuardHouse: 2,
        PatrolPoint: 2,
        Wall: 70,
        Caltrops: 10,
        FireTrap: 0,
        EngineerTrap: 1,
        WatchSignal: 1,
        MusketTower: 0,
        WallTroop: 4,
    },
    { // Age 6
        Keep: 1,
        ArmyCamp: 4,
        TroopUpgrade: 6,
        Embassy: 1,
        University: 1,
        Wonder: 3,
        Cathedral: 1,
        FarmMill: 8,
        SiloLumb: 8,
        Quarry: 3,
        Storehouse: 2,
        Road: 50,
        ArcherTower: 5,
        XBowTower: 2,
        CannonTower: 2,
        Catapult: 2,
        Trebuchet: 1,
        FlameTower: 1,
        GuardHouse: 2,
        PatrolPoint: 3,
        Wall: 85,
        Caltrops: 12,
        FireTrap: 1,
        EngineerTrap: 2,
        WatchSignal: 1,
        MusketTower: 0,
        WallTroop: 8,
    },
    { // Age 7
        Keep: 1,
        ArmyCamp: 4,
        TroopUpgrade: 6,
        Embassy: 1,
        University: 1,
        Wonder: 3,
        Cathedral: 1,
        FarmMill: 8,
        SiloLumb: 8,
        Quarry: 3,
        Storehouse: 2,
        Road: 50,
        ArcherTower: 6,
        XBowTower: 2,
        CannonTower: 3,
        Catapult: 3,
        Trebuchet: 1,
        FlameTower: 1,
        GuardHouse: 2,
        PatrolPoint: 3,
        Wall: 95,
        Caltrops: 14,
        FireTrap: 2,
        EngineerTrap: 3,
        WatchSignal: 1,
        MusketTower: 0,
        WallTroop: 10,
    },
    { // Age 8
        Keep: 1,
        ArmyCamp: 4,
        TroopUpgrade: 6,
        Embassy: 1,
        University: 1,
        Wonder: 3,
        Cathedral: 1,
        FarmMill: 8,
        SiloLumb: 8,
        Quarry: 3,
        Storehouse: 2,
        Road: 70,
        ArcherTower: 6,
        XBowTower: 3,
        CannonTower: 4,
        Catapult: 3,
        Trebuchet: 2,
        FlameTower: 2,
        GuardHouse: 2,
        PatrolPoint: 3,
        Wall: 110,
        Caltrops: 14,
        FireTrap: 2,
        EngineerTrap: 4,
        WatchSignal: 1,
        MusketTower: 0,
        WallTroop: 12,
    },
    { // Age 9
        Keep: 1,
        ArmyCamp: 4,
        TroopUpgrade: 6,
        Embassy: 1,
        University: 1,
        Wonder: 3,
        Cathedral: 1,
        FarmMill: 8,
        SiloLumb: 8,
        Quarry: 3,
        Storehouse: 2,
        Road: 70,
        ArcherTower: 7,
        XBowTower: 3,
        CannonTower: 4,
        Catapult: 3,
        Trebuchet: 2,
        FlameTower: 2,
        GuardHouse: 2,
        PatrolPoint: 3,
        Wall: 120,
        Caltrops: 14,
        FireTrap: 2,
        EngineerTrap: 4,
        WatchSignal: 1,
        MusketTower: 1,
        WallTroop: 14,
    }
];

// Define the order of data
const dataOrder = [
    "Keep",
    "ArmyCamp",
    "TroopUpgrade",
    "Embassy",
    "University",
    "Wonder",
    "Cathedral",
    "FarmMill",
    "SiloLumb",
    "Quarry",
    "Storehouse",
    "Road",
    "ArcherTower",
    "XBowTower",
    "CannonTower",
    "Catapult",
    "Trebuchet",
    "FlameTower",
    "GuardHouse",
    "PatrolPoint",
    "Wall",
    "Caltrops",
    "FireTrap",
    "EngineerTrap",
    "WatchSignal",
    "MusketTower",
    "WallTroop",
];

// Size, color, and abbreviation
// [width, height, color, abbreviation]
const buildData = {
    Keep: [4, 4, "", "Keep"],
    ArmyCamp: [2, 3, "", "Camp"],
    TroopUpgrade: [2, 2, "", "TUp"],
    Embassy: [2, 2, "", "Emb"],
    University: [3, 2, "", "Univ"],
    Wonder: [1, 1, "", "w"],
    Cathedral: [2, 3, "", "Cath"],
    FarmMill: [2, 2, "", "F/M"],
    SiloLumb: [2, 2, "", "S/L"],
    Quarry: [2, 2, "", "Qry"],
    Storehouse: [2, 2, "", "Stn"],
    Road: [1, 1, "", "R"],
    ArcherTower: [1, 1, "", "At"],
    XBowTower: [1, 1, "", "Xt"],
    CannonTower: [1, 1, "", "Ct"],
    Catapult: [1, 1, "", "C"],
    Trebuchet: [1, 1, "", "Tr"],
    FlameTower: [1, 1, "", "Ft"],
    GuardHouse: [2, 2, "", "GH"],
    PatrolPoint: [1, 1, "", "P"],
    Wall: [1, 1, "", "W"],
    Caltrops: [1, 1, "", "Cp"],
    FireTrap: [3, 3, "", "Fire"],
    EngineerTrap: [1, 1, "", "Et"],
    WatchSignal: [2, 2, "", "Wtch"],
    MusketTower: [1, 1, "", "Mt"],
    WallTroop: [1, 1, "", "t"],
    KeepDoor: [1, 1, "", "D"],
};

// Set color
(function () {
    let hue = 0,
        deltaHue = 1 / dataOrder.length;
    for (let i = 0; i < dataOrder.length; i++) {
        buildData[dataOrder[i]][2] = HSVtoHEX(hue, 0.9, 0.7);
        hue += deltaHue;
    }
    // Keep door
    buildData["KeepDoor"][2] = HSVtoHEX(hue, 0.9, 0.7);
})();

// Message strings
const msgData = [
    "Left drag: move  Right click: remove",
    "Left click: place  Right click: remove",
    "Left drag: place  Right drag: remove" // For road and wall
];

// Rebuild instruction - The data to be saved
let rebuildData = [];

// Grid data
let gridData = [];
for (let i = 0; i < 34; i++) {
    gridData.push([]);
    for (let ii = 0; ii < 34; ii++) {
        gridData[i].push(""); // Name of item placed
    }
}

// TODO:
// Basic functionality
// Keep door interaction
// Add drag to move when nothing selected on the right
// Add trap can be placed under road
// Add wall troop
// Add tower range
// Add road can't be connected from 3 sides
// Add loading animation
// Take LAST button press instead of first
// Dragging outside (mouse up outside) will put the item on the edge
// Add Disqus
