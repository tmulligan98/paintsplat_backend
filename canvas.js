const { MAX_SPEED, MAX_ACCELERATION, SCREEN_LENGTH, SCREEN_WIDTH } = require('./constants');
const Constants = require('./constants');

// Accepts either x or y coordinate and speed to determine if overlapping on that axis
function isOverlappingXY(coord, speed, screenDimension, canvasDimension) {
    if (coord + speed < 0 || coord + speed > screenDimension - canvasDimension) {
        return True
    }
}

class Canvas {
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

        // Speed
        this.speedX = 0.0;
        this.speedY = 0.0;
    }

    // add splats to the canvas for every user input
    //need to confirm
    // addSplats(splat) {
    //     if (this.validSplat(splat)) {
    //         this.splats.push(splat);
    //         return True
    //     }
    //     else {
    //         console.log('You missed your splat');
    //         return False
    //     }
    // }

    update(dt, splat) {

        this.timeElapsed += dt;

        // Update course of canvas
        // What trajectory is this going to follow?
        this.moveBoard()

    }

    // collision with borders
    //
    moveBoard() {

        // Change the canvas direction
        if (this.timeElapsed > 0.5) {
            this.timeElapsed = 0;

            // x component
            const dx = ((Math.random() - 0.5) * MAX_ACCELERATION * 2);
            if (this.speedX > 0) {
                this.speedX = Math.min(speedX + dx, MAX_SPEED);
            } else {
                speedX = Math.max(speedX + dx, MAX_SPEED);
            }
            // y component
            dy = ((Math.random() - 0.5) * MAX_ACCELERATION * 2);
            if (speedY > 0) {
                speedX = Math.min(speedY + dy, MAX_SPEED);
            } else {
                speedY = Math.max(speedX + dy, MAX_SPEED);
            }

            this.speedX = speedX;
            this.speedY = speedY;


        }

        // update canvas coordinates
        // About to overlap...
        if (isOverlappingXY(this.xCoord, speedX, SCREEN_WIDTH, CANVAS_WIDTH) == true) {
            this.speedX = -this.speedX;
        }
        if (isOverlappingXY(this.yCoord, speedY, SCREEN_HEIGHT, CANVAS_HEIGHT) == true) {
            this.speedY = -this.speedY;
        }
        this.xCoord = this.xCoord + this.speedX;
        this.yCoord = this.yCoord + this.speedY;


    }




}
module.exports = Canvas;