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
        setInterval(this.update.bind(this), 1000 / 60);
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
module.exports = Game;