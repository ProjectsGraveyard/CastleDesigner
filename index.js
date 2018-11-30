"use strict";

// ===== Variables ========================================================= //

// Flags
let ageIndex = 8, // CurrentAge = ageIndex + 1
    mousePressed = false,
    // Last mouse button pressed: 1: left, 3: right (normalized by jQuery)
    mouseButton = 0,
    currentItem = ""; // The item that is carried

// Sidebar
const sidebarRows = {};
let MovingTool;

// Canvas
let objects, mouse, grid, tower, info;

// Roads
const gridRoads = [[-1, 17], [16, -1], [34, 16], [17, 34]];

// Info canvas
const helpText = new Drawable.Text(
    ["#ffffff", "#800000", 3],
    "", 15, 30, "18px Comic Sans MS", "left", 2,
);
const infoText = new Drawable.Text(
    ["#ffffff", "#800000", 3],
    "", 0, 0, "18px Comic Sans MS", "center", 2,
);

// Mouse canvas
const itemPlacementRect = new Drawable.Rect(
    ["#000000", "#009900", 1, [0, 0]],
    0, 0, 0, 0, 1,
);
let currentColor = 200,
    deltaColor = 10,
    itemPlaceFree = true,
    itemPlacementAnimationStopToken;

// ===== Initialization ==================================================== //

$(document).ready(function () {
    // ===== Initialize Sidebar ============================================ //

    // First row
    MovingTool = new BuildingRow("MovingTool", "-");
    MovingTool.built = "-";
    MovingTool.builtObj.html("-");

    // Build rows
    for (let i = 0; i < dataOrder.length; i++) {
        sidebarRows[dataOrder[i]] = new BuildingRow(
            dataOrder[i],
            ageData[ageIndex][dataOrder[i]],
        );
    }

    // Select
    $("#buildingTable").on("click", ".clickable-row", function (e) {
        if (
            $(this).hasClass("success") ||
            $(this).attr("id") === "MovingTool"
        ) {
            // Deselect
            $(this).removeClass("success").siblings().removeClass("success");
            MovingTool.rowObj.addClass("success");
            currentItem = "";
            helpText.data[1] = msgData[0];
            // Hide placement rectange
            mouse.drawArray = [];
        } else if (sidebarRows[$(this).attr("id")].left > 0) {
            // Select if we can build it
            $(this).addClass("success").siblings().removeClass("success");
            currentItem = $(this).attr("id");
            if (currentItem === "Road" || currentItem === "Wall") {
                helpText.data[1] = msgData[2];
            } else {
                helpText.data[1] = msgData[1];
            }
        }
        // Redraw info canvas
        info.clear();
        info.draw();
        // Prevent next event handler (global click handler) to take it
        e.stopPropagation();
    });

    // ===== Initialize Engine ============================================= //

    objects = new Engine("objects", true);
    mouse = new Engine("mouse", true);
    grid = new Engine("grid", true);
    tower = new Engine("tower", true);
    info = new Engine("info", false);

    // ===== Initialize grid canvas ======================================== //

    // Add road objects
    for (let i = 0; i < gridRoads.length; i++) {
        const pos = GridToPos(gridRoads[i]);
        grid.add(new Drawable.Rect(
            ["#000000", "#66ff99", 1.5],
            pos[0], pos[1], gridSide, gridSide, 2,
        ));
    }

    // Add grid object
    grid.add(new Drawable.Grid(
        ["#000000", "#000000", 1.5],
        gridStart, gridStart, gridEnd, gridEnd, gridCount, gridCount,
    ));
    grid.draw();

    // ===== Initialize Info Canvas ======================================== //

    info.add(helpText, infoText);
    // Initialize info canvas help text
    helpText.data[1] = msgData[0];
    info.clear();
    info.draw();

    // ===== Initialize Mouse Canvas ======================================= //

    mouse.context.globalAlpha = 0.6;
    // Start animation
    itemPlacementAnimationStopToken = window.setInterval(
        itemPlacementAnimation,
        Math.floor(1000 / 30),
    );

    // ===== Mouse Events ================================================== //

    // Mouse move
    $(document).mousemove(function (e) {
        const grid = PosToGrid(getMousePos(e, true));
        if (currentItem === "") {
            // Show hover tooltip
            showHoverTooltip(grid, e)
        } else {
            // Show item placement
            showItemPlacement(grid);
            if (mousePressed && isDragMode()) {
                // Handle placing and removing road and wall
                if (mouseButton === 1) {
                    placeItem(e);
                }
            }
        }
    });

    // Mouse down
    $(document).mousedown(function (e) {
        // If one button is already pressed or pressed outside the canvas, it
        // is ignored
        if (!mousePressed && isMouseInside(getMousePos(e))) {
            mousePressed = true;
            mouseButton = e.which;
            // Place first piece
            if (isDragMode()) {
                if (mouseButton === 1) {
                    placeItem(e);
                }
            }
        }
    });

    // Mouse up
    $(document).mouseup(function (e) {
        if (mousePressed) {
            mousePressed = false;
            //Place the item or the last road or wall piece
            if (mouseButton === 1) {
                placeItem(e);
            }
        }
    });

    // ===== Wrap up ======================================================= //

    // Select moving tool when everything is done
    MovingTool.rowObj.trigger("click");
});
