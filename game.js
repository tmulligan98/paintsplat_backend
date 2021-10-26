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
module.exports = Game;