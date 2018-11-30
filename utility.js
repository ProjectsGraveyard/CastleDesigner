// Utility library
"use strict";

// ===== Mouse ============================================================= //

// Get mouse position
const getMousePos = function (e, transform) {
    const rect = info.canvas.getBoundingClientRect();
    // Get normal position
    let x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    // Transform if needed
    if (transform) {
        // Translate
        x -= EngineConfig.origin[0];
        y -= EngineConfig.origin[1];
        // Rotate
        const transMatrix = [
            0.7071067811865476, 0.7071067811865476,
            -0.7071067811865476, 0.7071067811865476,
        ];
        const newX = x * transMatrix[0] + y * transMatrix[1],
            newY = x * transMatrix[2] + y * transMatrix[3];
        // Return
        return [newX, newY];
    } else {
        // Simply return normal mouse position if we are not transforming
        return [x, y];
    }

};

// Check if mouse is inside the canvas (takes in normal mouse position)
const isMouseInside = function (pos) {
    return (
        pos[0] >= 0 && pos[0] <= EngineConfig.size[0] &&
        pos[1] >= 0 && pos[1] <= EngineConfig.size[1]
    );
};

// ===== Conversion and Compare ============================================ //

// Convert (transformed) position to grid and grid to (transformed) position
const PosToGrid = function (pos) {
    const x = Math.floor((pos[0] - gridStart) / gridSide),
        y = Math.floor((pos[1] - gridStart) / gridSide);
    return [x, y];
};
const GridToPos = function (grid) {
    const x = gridStart + grid[0] * gridSide,
        y = gridStart + grid[1] * gridSide;
    // Note: Grid start at 0, terrain goes from 0 to 33 (total 34 squares)
    return [x, y];
};

// Compare grids
const gridCmp = function (grid1, grid2) {
    return (grid1[0] === grid2[0] && grid1[1] === grid2[1]);
};

// ===== Item Object ======================================================= //

// Object canvas item object
let objID = 0; // objectID used to remove them
const ObjectItem = function (grid, width, height, backColor, text) {
    // Get position
    const pos = GridToPos(grid);
    // ID used for removal
    this.ID = objID;
    objID++;
    // Initialize objects
    this.rect = new Drawable.Rect(
        ["#000000", backColor, 1.5, this.ID],
        pos[0], pos[1], gridSide * width, gridSide * height, 2,
    );
    this.text = new Drawable.Text(
        ["#000000", "#ffffff", 1, this.ID],
        text, pos[0], pos[1] + 10, "10px Comic Sans MS", "left", 2,
    );
    // Put objects into canvas
    objects.add(this.rect, this.text);
};

/*
// We do not need this for now
ObjectItem.prototype.update = function (grid) {
    const pos = GridToPos(grid);
    this.rect.data[1] = pos[0];
    this.rect.data[2] = pos[1];
    // Redraw
    objects.clear();
    objects.draw();
};
*/
ObjectItem.prototype.remove = function () {
    objects.drawArray = objects.drawArray.filter(function (x) {
        return x.common[3] === this.ID;
    });
};

// ===== Logic ============================================================= //

// If we are in drag mode
const isDragMode = function () {
    return (currentItem === "Road" || currentItem === "Wall");
};

// Show hover tooltip
const showHoverTooltip = function (grid, e) {
    infoText.data[1] = "";
    // Update position
    const mousePos = getMousePos(e);
    infoText.data[2] = mousePos[0];
    infoText.data[3] = mousePos[1] - 15;
    // Road exits
    for (let i = 0; i < gridRoads.length; i++) {
        if (gridCmp(gridRoads[i], grid)) {
            // Update text
            infoText.data[1] = "Road Exit - Connect for Daily Gold";
        }
    }
    // Building
    if (getGridData(grid) !== "" && getGridData(grid) !== "OutOfRange") {
        // Normal buildings
        infoText.data[1] = getGridData(grid);
    }
    if (infoText.data[1] === "KeepDoor") {
        // Keep door
        infoText.data[1] += " - Drag to build Road";
    }
    // Redraw canvas
    info.clear();
    info.draw();
};

// Show item placement
const showItemPlacement = function (grid) {
    mouse.drawArray = [];

    // ===== Placement Rectangle =========================================== //

    // Top left square will follow the mouse, except if width or hight is 
    // larger than 2, then the 2nd square will follow
    if (buildData[currentItem][0] > 2) {
        grid[0]--;
    }
    if (buildData[currentItem][1] > 2) {
        grid[1]--;
    }

    // Check if grid is inside the terrain
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] < 0) {
            grid[i] = 0;
        } else if (grid[i] + buildData[currentItem][i] >= gridCount) {
            grid[i] = 34 - buildData[currentItem][i];
        }
    }

    // Place the placement rectangle
    const pos = GridToPos(grid);
    itemPlacementRect.data[1] = pos[0];
    itemPlacementRect.data[2] = pos[1];

    // Set size
    itemPlacementRect.data[3] = buildData[currentItem][0] * gridSide;
    itemPlacementRect.data[4] = buildData[currentItem][1] * gridSide;

    // Save which grid it is in
    itemPlacementRect.common[3] = grid;

    // Add to canvas
    mouse.add(itemPlacementRect);

    // ===== Place Free Check ============================================== //

    // Subroutine
    const notFree = function (grid) {
        itemPlaceFree = false;
        placeNotEmpty.push(grid);
    };

    // Check loop
    itemPlaceFree = true;
    let placeNotEmpty = [];
    for (let i = 0; i < buildData[currentItem][0]; i++) {
        for (let ii = 0; ii < buildData[currentItem][1]; ii++) {
            // newGrid will be scoped to the loop, so we don't need to slice
            // it in notFree()
            const newGrid = [grid[0] + i, grid[1] + ii];
            if (currentItem === "WallTroop") {
                if (getGridData(newGrid) !== "Wall") {
                    notFree(newGrid);
                }
            } else if (
                currentItem === "Caltrops" ||
                currentItem === "FireTrap" ||
                currentItem === "EngineerTrap"
            ) {
                if (
                    !(
                        getGridData(newGrid) === "" ||
                        getGridData(newGrid) === "Road"
                    )
                ) {
                    notFree(newGrid);
                }
            } else {
                if (getGridData(newGrid) !== "") {
                    notFree(newGrid);
                }
            }
        }
    }
    for (let i = 0; i < placeNotEmpty.length; i++) {
        const pos = GridToPos(placeNotEmpty[i]);
        mouse.add(new Drawable.Rect(
            ["#000000", "#660000", 1],
            pos[0], pos[1], gridSide, gridSide, 1,
        ));
    }

    // Redraw canvas
    mouse.clear();
    mouse.draw();
};

// Place item
const placeItem = function (e) {
    // Check if we can place item
    if (
        isMouseInside(getMousePos(e)) &&
        currentItem !== "" &&
        itemPlaceFree
    ) {
        if (currentItem === "WallTroop") {
            // TODO
            console.warn("Not implemented");
        } else if (
            currentItem === "Caltrops" ||
            currentItem === "FireTrap" ||
            currentItem === "EngineerTrap"
        ) {
            // TODO
            console.warn("Not implemented");
        } else {
            const grid = itemPlacementRect.common[3];
            // Save rebuild data
            rebuildData.push([currentItem, grid[0], grid[1]]);
            // Put in grid matrix
            for (let i = 0; i < buildData[currentItem][0]; i++) {
                for (let ii = 0; ii < buildData[currentItem][1]; ii++) {
                    const newGrid = [grid[0] + i, grid[1] + ii];
                    setGridData(newGrid, currentItem, false);
                    // Keep doors
                    if (currentItem === "Keep") {
                        if (
                            (i === 2 && (ii === 0 || ii === 3)) ||
                            (ii === 2 && (i === 0 || i === 3))
                        ) {
                            setGridData(newGrid, "Door", true);
                        }
                    }
                }
            }
            // Add controller object
            const rD = rebuildData[rebuildData.length - 1],
                bD = buildData[currentItem];
            rD.push(new ObjectItem([rD[1], rD[2]], bD[0], bD[1], bD[2], bD[3]));
            // Update counter
            sidebarRows[currentItem].update(true);
            // Redraw
            objects.clear();
            objects.draw();
        }
    }
};

// ===== Sidebar Related =================================================== //

// Row constructor
const BuildingRow = function (name, max) {
    // Initialize variables
    this.name = name;
    this.max = max;
    this.built = 0;
    this.left = max;
    // DOM objects
    this.maxObj = $("<td>").html(max.toString()).css("width", "15%");
    this.builtObj = $("<td>").html("0").css("width", "15%");
    this.leftObj = $("<td>").html(max.toString()).css("width", "15%");
    this.rowObj = $("<tr>").addClass("clickable-row").append(
        $("<td>").html(name).css("width", "55%"),
        this.builtObj,
        this.leftObj,
        this.maxObj
    ).attr("id", name);
    // Put row into table
    $("#buildingTable").append(this.rowObj);
};

// Place and remove
BuildingRow.prototype.update = function (isPlacing) {
    if (isPlacing) {
        this.built++;
        this.left--;
    } else {
        this.built--;
        this.left++;
    }
    // Update html
    this.builtObj.html(this.built.toString());
    this.leftObj.html(this.left.toString());
    // Update color and select MovingTool if we don't have anything left
    if (this.left <= 0) {
        this.leftObj.css("color", "red");
        this.rowObj.addClass("active");
        MovingTool.rowObj.trigger("click");
    } else {
        this.leftObj.css("color", "inherit");
        this.rowObj.removeClass("active");
    }
};

// ===== Safe Data Access ================================================== //

const isInGrid = function (grid) {
    return (
        grid[0] >= 0 && grid[0] < gridCount &&
        grid[1] >= 0 && grid[1] < gridCount
    );
};

// Safely set and update gridData item from grid
const getGridData = function (grid) {
    if (isInGrid(grid)) {
        return gridData[grid[0]][grid[1]];
    } else {
        return "OutOfRange";
    }
};
const setGridData = function (grid, data, append) {
    if (isInGrid(grid)) {
        if (append) {
            gridData[grid[0]][grid[1]] += data;
        } else {
            gridData[grid[0]][grid[1]] = data;
        }
        return true;
    } else {
        return false;
    }
};

// ===== Color and Animation =============================================== //

// Custom color converter based on HSLtoRGB from Stackoverflow
const HSVtoHEX = function (h, s, v) {
    // RGB to HEX
    const RGBtoHEX = function (r, g, b) {
        let tempStr = "#";
        for (let i = 0; i < arguments.length; i++) {
            const temp = arguments[i].toString(16);
            if (temp.length === 1) {
                tempStr += "0" + temp;
            } else {
                tempStr += temp;
            }
        }
        return tempStr;
    };
    // Converting algorithm from Stackoverflow
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    // Return formated color string
    return RGBtoHEX(r, g, b);
};

// Item placement animation, rely on a few variables defined in index.js
const itemPlacementAnimation = function () {
    // Update color
    currentColor += deltaColor;
    if (currentColor >= 250 || currentColor <= 150) {
        deltaColor *= -1;
    }
    let color = currentColor.toString(16);
    if (color.length === 1) {
        color = "0" + color;
    }
    // Set color
    if (itemPlaceFree) {
        // Free, change to green
        itemPlacementRect.data[0][1] = "#00" + color + "00";
    } else {
        // Not free, change to red (cells that are not free will be a darker red)
        itemPlacementRect.data[0][1] = "#" + color + "0000";
    }
    // Redraw canvas
    mouse.clear();
    mouse.draw();
};
