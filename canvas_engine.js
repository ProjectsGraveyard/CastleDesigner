// Canvas Engine
"use strict";

// ===== Configuration ===================================================== //

const EngineConfig = {
    lineJoin: "miter",
    size: [800, 800],
    origin: [400, 400],
    rotation: Math.PI / 4 // 45 degree
};

// ===== Engine Constructor ================================================ //

// Constructor
// (Constructor) Engine (id, transform)
// (str) id: The ID of the canvas
// (bool) transform: If translation and rotation should be applied
const Engine = function (canvId, transform) {
    // Initialize
    this.canvas = document.getElementById(canvId);
    this.context = this.canvas.getContext("2d");
    this.drawArray = [];
    // Apply configurations
    this.context.lineJoin = EngineConfig.lineJoin;
    this.canvas.width = EngineConfig.size[0];
    this.canvas.height = EngineConfig.size[1];
    if (transform) {
        this.context.translate(
            EngineConfig.origin[0],
            EngineConfig.origin[1],
        );
        this.context.rotate(EngineConfig.rotation);
    }
    // Disable context menu
    this.canvas.oncontextmenu = function () {
        return false;
    };
};

// Add object to draw
// (int) Engine.prototype.add ()
// (drawable object) arguments: Drawable objects
Engine.prototype.add = function () {
    for (let i = 0, l = arguments.length; i < l; i++) {
        this.drawArray.push(arguments[i]);
    }
};

// Draw everything
// (void) Engine.prototype.draw ()
// Draws every objct in "drawArray", this function will not empty the screen
// first
Engine.prototype.draw = function () {
    for (let i = 0, l = this.drawArray.length; i < l; i++) {
        // Set often used parameters
        this.context.strokeStyle = this.drawArray[i].common[0];
        this.context.fillStyle = this.drawArray[i].common[1];
        this.context.lineWidth = this.drawArray[i].common[2];
        this.context.beginPath();
        // Call draw function
        this.drawArray[i].draw(this.context);
    }
};

// Clear the screen
// (void) Engine.prototype.clear ()
// Empty the screen
Engine.prototype.clear = function () {
    this.context.clearRect(-1000, -1000, 2000, 2000);
};

// ===== Drawable Objects Constructor ====================================== //

const Drawable = {};

// Common constructor parameters, these parameters needs to be passed in as an
// array as the first argument
// (str) colorStroke: A valid color for the outline
// (str) colorFill: A valid color for filling
// (int) lineWidth: The width of the line
// [optional] (mix) identifier: Additional data can be put in common to used
// as identifier or other purposes

// ----- Pattern ----------------------------------------------------------- //

// (constructor) Drawable.Pattern (common, pointArray, option)
// (Array) pointArray: An array of (x, y) pairs to form a polygon
// (int) option:
//     0 - Draw the line
//     1 - Close the path and draw the line
//     2 - Close the path and fill only
//     3 - Close the path and fill and draw the line
Drawable.Pattern = function (common, pointArray, option) {
    this.data = arguments;
    this.common = this.data[0];
};

// Draw the pattern
// (constructor) Drawable.Pattern.prototype.draw (context)
// (2d context) context: The 2d context of a canvas
Drawable.Pattern.prototype.draw = function (context) {
    // Draw the line
    context.moveTo(this.data[1][0][0], this.data[1][0][1]);
    for (let i = 1, l = this.data[1].length; i < l; i++) {
        context.lineTo(this.data[1][i][0], this.data[1][i][1]);
    }
    // Close the path if option is not 0
    if (this.data[2] !== 0) {
        context.closePath();
    }
    // Draw the line if option is not 2
    if (this.data[2] !== 2) {
        context.stroke();
    }
    // Fill if option is 2 or 3
    if (this.data[2] === 2 || this.data[2] === 3) {
        context.fill();
    }
};

// ----- Rectangle --------------------------------------------------------- //

// (constructor) Drawable.Rect (common, x, y, w, h, option)
// (int) x, y, w, h: The position the rectangle (x, y, width, height)
// (int) option:
//     0 - Outline only
//     1 - Fill only
//     2 - Outline and fill
Drawable.Rect = function (common, x, y, w, h, option) {
    this.data = arguments;
    this.common = this.data[0];
};

// Draw the rectangle
// (2d context) context: The 2d context of a canvas
Drawable.Rect.prototype.draw = function (context) {
    // Create a rectangle
    context.rect(this.data[1], this.data[2], this.data[3], this.data[4]);
    // Draw the outline if the option is not 1
    if (this.data[5] !== 1) {
        context.stroke();
    }
    // Fill if option is not 0
    if (this.data[5] !== 0) {
        context.fill();
    }
};

// ----- Text -------------------------------------------------------------- //

// (constructor) Drawable.Text (common, text, x, y, font, align)
// (str) text: The text to draw
// (int) x and y: The position of the text to draw
// (str) font: A valid font
// (str) align: A valid aligh string: left, center, or right
// (int) option:
//     0 - The outline of the text only
//     1 - The text only
//     2 - The outline and the text
Drawable.Text = function (common, text, x, y, font, align, option) {
    this.data = arguments;
    this.common = this.data[0];
};

// Draw the text
// (2d context) context: The 2d context of a canvas
Drawable.Text.prototype.draw = function (context) {
    // Set style
    context.font = this.data[4];
    context.textAlign = this.data[5];
    // Draw the outline if the option is not 1
    if (this.data[6] !== 1) {
        context.strokeText(this.data[1], this.data[2], this.data[3]);
    }
    // Fill if option is not 0
    if (this.data[6] !== 0) {
        context.fillText(this.data[1], this.data[2], this.data[3]);
    }
};

// ----- Grid -------------------------------------------------------------- //

// (void) Drawable.Text (common, text, x, y, font, align)
// (int) startX, startY, endX, and endY: Position of the grid, end must be
// larger than start
// (int) countRow and countColumn: The number of rows and columns of the grid
Drawable.Grid = function (common, startX, startY, endX, endY, countRow, countColumn) {
    this.data = arguments;
    this.common = this.data[0];
    // Space between horizontal and vertical lines
    this.dX = (endX - startX) / countColumn;
    this.dY = (endY - startY) / countRow;
};

// Draw the grid
// (2d context) context: The 2d context of a canvas
Drawable.Grid.prototype.draw = function (context) {
    // Track where we are
    let nowY = this.data[2],
        nowX = this.data[1];
    // Horizontal lines
    while (nowY <= this.data[4]) {
        context.beginPath();
        context.moveTo(this.data[1], nowY); // startX, nowY
        context.lineTo(this.data[3], nowY); // endX, nowY
        context.stroke();
        nowY += this.dY;
    }
    // Vertical lines
    while (nowX <= this.data[3]) {
        context.beginPath();
        context.moveTo(nowX, this.data[2]); // nowX, startY
        context.lineTo(nowX, this.data[4]); // nowX, endY
        context.stroke();
        nowX += this.dX;
    }
};
