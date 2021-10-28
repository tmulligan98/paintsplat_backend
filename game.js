// It'll be a class
// Need to manage player hits
// Game timer control how long game goes on for
// Batch update thing
// ...
const Splat = require('./splat');
const Canvas = require('./canvas');
const Constants = require('./constants');


function gameEnd(sockets, players) {
    // get Winner
    const topPlayer = Object.values(players).sort((player1, player2) => player2.score - player1.score)
    const msg = { "winner": topPlayer[0] }
    // Tell all players who the winner is, then kick em.
    for (const [key, val] of Object.entries(sockets)) {
        val.emit(Constants.MSG_TYPES.GAME_END, msg)
        val.disconnect(true)
    }
}


class Game {
    constructor(sockets, players) {
        this.sockets = sockets;
        this.players = players;
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.canvas = new Canvas()
        this.scores = {}
        this.gameStartTime = Date.now();
        this.intervalId = setInterval(this.update.bind(this), 1000 /*/ 60*/);
    }

    // handleInput
    handleInput(socket, input) {

        if (this.players[socket.id].fireCooldown === 0) {
            if (validSplat(input["xCoord"], input["yCoord"], this.canvas)) {

                // Initialise a splat object
                const splat = new Splat(input['xCoord'], input['yCoord'], this.players[socket.id]);

                //add splat to the list
                this.canvas.splats.push(splat)
                console.log('Your splat is valid and has been recorded')

                this.players[socket.id].score += 1;
                //this.update(socket.id)
            }
            else {
                console.log("you missed");
            }
        }


        // Player Cooldown
        this.players[socket.id].fireCooldown = Constants.PLAYER_FIRE_COOLDOWN;

    }

    getLeaderboard() {
        return Object.values(this.players)
            .sort((player1, player2) => player2.score - player1.score)
            .slice(0, 5)
            .map(player => ({ username: player.username, score: Math.round(player.score) }));
    }

    // Create json object
    createUpdate(canvas) {
        const json_object = {
            x_coord: canvas.xCoord,
            y_coord: canvas.yCoord,
            time_stamp: Date.now(),
            leaderboard: this.getLeaderboard(),
        }

        var listOfSplats = [] // temporary array
        for (spl in this.canvas.splats) {
            listOfSplats.push({
                "splat_x": spl.xCoord,
                "splat_y": spl.yCoord,
                "player_ID": spl.player.id,
                "colour": spl.player.colour,
            })
        }
        json_object['splat'] = listOfSplats

        return json_object

    }


    // update
    update(/*id*/) {

        const now = Date.now();
        if ((now / 1000 - this.gameStartTime / 1000) > 60) {
            gameEnd(this.sockets, this.players);
            // End the game
            clearInterval(this.intervalId);

        }
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.canvas.update(dt);

        if (this.shouldSendUpdate) {
            const leaderboard = this.getLeaderboard();
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                // const player = this.players[playerID];
                console.log(this.createUpdate(this.canvas, leaderboard))
                socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(this.canvas, leaderboard));
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }



}

// NOTE: Once a splat is valid, it needs to be added to the Canvas's list of splats!
// Given a new splat, check if the new splat is valid
function validSplat(xCoord, yCoord, CanvasObject) {
    let a = 0.0
    let b = 0.0
    for (spl in CanvasObject.splats) {
        //c = sqrt(a^2 + b^2)
        a = abs(xCoord - splat.xCoord);
        b = abs(yCoord - splat.yCoord);
        c = sqrt(a ** 2 + b ** 2);
        if (c < 2 * Constants.SPLAT_RADIUS) {
            return false;
        }

    }
    return true;

}


module.exports = Game;
