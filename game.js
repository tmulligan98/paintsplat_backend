// It'll be a class
// Need to manage player hits
// Game timer control how long game goes on for
// Batch update thing
// ...
const Splat = require('./Splat');
const canvas = require('./canvas');
const Constants = require('./constants');

const board = new canvas();

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        // setInterval(this.update.bind(this), 1000 / 60);
    }
   
    // handleInput
    handleInput(socket,input){
        splat = new Splat(input['xcoord'], input['ycoord']);
        if(board.addSplats(splat)){
            //increase player score
        }
        
    }

    // update
    update(){
        // Calculate time elapsed
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now

        if (this.shouldSendUpdate) {
            const leaderboard = this.getLeaderboard();
            Object.keys(this.sockets).forEach(playerID => {
              const socket = this.sockets[playerID];
              const player = this.players[playerID];
              socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
            });
            this.shouldSendUpdate = false;
          } else {
            this.shouldSendUpdate = true;
          }
        }
      
        getLeaderboard() {
          return Object.values(this.players)
            .sort((p1, p2) => p2.score - p1.score)
            .slice(0, 5)
            .map(p => ({ username: p.username, score: Math.round(p.score) }));
        }


        //need to be worked on
        createUpdate(player, leaderboard) {


    }
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