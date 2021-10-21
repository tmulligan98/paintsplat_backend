const { MAX_SPEED, MAX_ACCELERATION, SCREEN_LENGTH, SCREEN_WIDTH } = require('./constants');
const Constants = require('./constants');

// Accepts either x or y coordinate and speed to determine if overlapping on that axis
function isOverlappingXY(coord, speed, screenDimension, canvasDimension) {
    if (coord + speed < 0 || coord + speed > screenDimension - canvasDimension) {
        return True
    }
}







class canvas {
    constructor() {
        // Initial coords wrt to screen
        this.xCoord = 0.0;
        this.yCoord = 0.0;
        this.width = 0.0;
        this.height = 0.0;
        this.timeElapsed = 0.0;

        // Origin (0,0) of canvas is bottom left
        // This will be an array of splat objects
        this.splats = []
        // Last x and y changes for the canvas
        this.dx = 0.0
        this.dy = 0.0
    }

    update(dt, splat) {

        this.timeElapsed += dt;

        // Is splat valid?
        if (this.updateSplat(splat)) {
            this.splats.push(splat);
        }

        // Update course of canvas
        // What trajectory is this going to follow?

    }

    // Given a new splat, check if the new splat is valid
    validSplat(splat) {
        let a = 0.0
        let b = 0.0
        for (spl in this.splats) {
            //c = sqrt(a^2 + b^2)
            a = abs(splat.xCoord - splat.xCoord);
            b = abs(splat.yCoord - splat.yCoord);
            c = sqrt(a ** 2 + b ** 2);
            if (c < 2 * Constants.SPLAT_RADIUS) {
                return false;
            }

        }
        return true;

    }
    // collision with borders
    //
    moveBoard() {

        // Change the canvas direction
        if (this.timeElapsed > 0.5) {
            this.timeElapsed = 0;

            dx = ((Math.random() - 0.5) * MAX_ACCELERATION * 2);
            if (speed_x > 0) {
                speed_x = Math.min(speed_x + dx, MAX_SPEED);
            } else {
                speed_x = Math.max(speed_x + dx, MAX_SPEED);
            }
            dy = ((Math.random() - 0.5) * MAX_ACCELERATION * 2);
            if (speed_y > 0) {
                speed_x = Math.min(speed_y + dy, MAX_SPEED);
            } else {
                speed_y = Math.max(speed_x + dy, MAX_SPEED);
            }

            this.speed_x = speed_x;
            this.speed_y = speed_y;


        }

        // update canvas coordinates
        // About to overlap...
        if (isOverlappingXY(this.xCoord, speed_x, SCREEN_WIDTH, CANVAS_WIDTH) == true) {
            this.speed_x = -this.speed_x;
        }
        if (isOverlappingXY(this.yCoord, speed_y, SCREEN_HEIGHT, CANVAS_HEIGHT) == true) {
            this.speed_y = -this.speed_y;
        }
        this.xCoord = this.xCoord + this.speed_x;
        this.yCoord = this.yCoord + this.speed_y;


    }



    // Need a method for controlling the motion of the canvas.

}
module.exports = canvas;