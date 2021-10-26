// It'll be a class
// Need to manage player hits
// Game timer control how long game goes on for
// Batch update thing
// ...


class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        // setInterval(this.update.bind(this), 1000 / 60);
    }

    // addPlayer

    // removePlayer

    // handleInput

    // update
    // Needs to:
    // Get time from last update
    // Handle user inputs. Maybe have a queue of player instructions to issue? LIFO kinda thing
    // Update: (Update every other time? 30 ticks per second is okay)
    // Update the board.
    // Update splats.


}

// NOTE: Once a splat is valid, it needs to be added to the Canvas's list of splats!
// Given a new splat, check if the new splat is valid
function validSplat(splat, CanvasObject) {
    let a = 0.0
    let b = 0.0
    for (spl in CanvasObject.splats) {
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
module.exports = Game;