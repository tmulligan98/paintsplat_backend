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
    constructor(sockets, players, level) {
        this.sockets = sockets;
        this.players = players;
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.level = level;
        this.canvas = new Canvas(level)
        this.scores = {}
        this.gameStartTime = Date.now();
        this.intervalId = setInterval(this.update.bind(this), 1000 / 60);
    }

    // handleInput
    handleInput(socket, input) {

        var splat_status = "";

        if (this.players[socket.id].fireCooldown === 0) {

            if (validSplat(input["x_coord"], input["y_coord"], this.canvas)) {

                // Translate to coordinates with respect to the canvas
                // Get x and y distance from canvas to splat point
                const splat_x_canvas = input["x_coord"] - this.canvas.xCoord;
                const splat_y_canvas = input["y_coord"] - this.canvas.yCoord;

                // Initialise a splat object
                const splat = new Splat(splat_x_canvas, splat_y_canvas, this.players[socket.id]);

                //add splat to the list
                this.canvas.splats.push(splat)
                //console.log('Valid splat.')


                this.players[socket.id].score += 1;
                splat_status = "hit";
                //this.update(socket.id)
            }
            else {
                //console.log("you missed");
                splat_status = "miss";
                // Player Cooldown
                this.players[socket.id].fireCooldown = Constants.PLAYER_FIRE_COOLDOWN;
            }
        } else {
            console.log(this.players[socket.id].username + " is still cooling down.")
            splat_status = "cooldown";
        }


        socket.emit("splat_confirmation", { "username": this.players[socket.id], "splat": splat_status })
        console.log(splat_status)


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

        var arrayLength = this.canvas.splats.length;
        for (var i = 0; i < arrayLength; i++) {
            listOfSplats.push({ // For loop error, not iterating through splats.
                "splat_x": this.canvas.splats[i].xCoord,
                "splat_y": this.canvas.splats[i].yCoord,
                "player_ID": this.canvas.splats[i].player.id,
                "colour": this.canvas.splats[i].player.colour,
            })
        }

        // for (let spl in this.canvas.splats) {
        //     listOfSplats.push({ // For loop error, not iterating through splats.
        //         "splat_x": spl.xCoord,
        //         "splat_y": spl.yCoord,
        //         "player_ID": spl.player.id, // Bug here
        //         "colour": spl.player.colour,
        //     })
        // }
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
                this.players[playerID].update(dt)
                //console.log(this.createUpdate(this.canvas, leaderboard))
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

    // Check if splat outside x boundary
    if ((xCoord - Constants.SPLAT_RADIUS) <= CanvasObject.xCoord ||
        (xCoord + Constants.SPLAT_RADIUS) >= CanvasObject.xCoord + Constants.CANVAS_WIDTH) {    // Within x boundary

        return false;
    }

    // Check if splat outside y boundary
    if ((yCoord - Constants.SPLAT_RADIUS) <= CanvasObject.yCoord ||
        (yCoord + Constants.SPLAT_RADIUS) >= CanvasObject.yCoord + Constants.CANVAS_HEIGHT) {    // Within x boundary

        return false;
    }

    const splat_x_canvas = xCoord - this.canvas.xCoord;
    const splat_y_canvas = yCoord - this.canvas.yCoord;

    // Check if overlapping other splats on canvas
    let a = 0.0
    let b = 0.0
    for (var i = 0; i < CanvasObject.splats.length; i++) {
        //c = sqrt(a^2 + b^2)
        a = Math.abs(splat_x_canvas - CanvasObject.splats[i].xCoord);
        b = Math.abs(splat_y_canvas - CanvasObject.splats[i].yCoord);
        c = Math.sqrt((a ** 2) + (b ** 2));
        if (c < (2 * Constants.SPLAT_RADIUS)) {
            console.log("Splat overlaps another splat")
            return false;
        }

    }
    return true;

}


module.exports = Game;
