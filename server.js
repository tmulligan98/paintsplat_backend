const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Lobby = require('./lobby');
const Constants = require('./constants');
const Game = require('./game')
const parsers = require('./utils');

const canvas = require('./canvas');

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// TODO: I used pythonic for loops that don't work as intended. We gotta change em.

var game = null;

io.on('connection', socket => {
    console.log(`Player has connected with id ${socket.id}`)
    socket.emit("Your id is: ", socket.id);

    // -----Event handlers for a new socket-----

    // Join the lobby
    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinLobby);
    // Disconnect
    socket.on("disconnect", onDisconnect);    // TODO: Remove player from both lobby and/or game
    // This will handle splats.
    socket.on(Constants.MSG_TYPES.INPUT, onInput);
    // Create a lobby.
    socket.on(Constants.MSG_TYPES.HOST_GAME, createLobby);
    // Start the game.
    socket.on(Constants.MSG_TYPES.START_GAME, () => {
        const msg = Constants.RESPONSE_BODY;
        msg["message"] = "Game commencing.";
        msg["time"] = Date.now();
        io.emit(Constants.MSG_TYPES.START_GAME, msg);
        game = lobby.startGame(socket.id);
    });

})



const lobby = new Lobby();

// function onInput(splatCoords) { } //TODO: Handle input splats!!


function joinLobby(message) {  // Allow a socket connection to join the lobby.
    // Get message contents
    const username = parsers.parseUsername(message)
    // const lobbyId = parseLobbyId(message)
    // Check if max player count exceeded
    console.log("Player joining lobby:", username);
    if (lobby.playerCount > Constants.MAX_PLAYERS) {
        this.emit(Constants.MSG_TYPES.DENY_ENTRY)
        return;
    }

    const clrs = ['red', 'green', 'orange'];
    // Otherwise...
    lobby.addPlayer(this, username, clrs[lobby.playerUsernames.length - 1])
    // Let em know
    this.emit("welcome")
    // Announce new player
    io.emit("player_list", parsers.generatePlayerListBody(lobby.playerUsernames))
}


//Only allow a single game to be hosted
function createLobby(message) {    // Allow for someone to host a game.
    // Assign lobby host as player
    // Tell player what the id is
    const username = parsers.parseUsername(message);
    console.log("Player creating lobby:", username);
    this.emit("lobby_id", lobby.lobbyId);
    lobby.addHost(this, username);
}

function onDisconnect() {   // Allow for someone to leave a game
    try {
        username = lobby.dropPlayer(this.id);
        console.log("Player leaving:", username);
        // Broadcast that a given player left
        io.emit(Constants.MSG_TYPES.LEAVE_GAME, username)
        // Send updated player list
        io.emit("player_list", parsers.generatePlayerListBody(lobby.playerUsernames))
    } catch (error) {
        console.log("Player Left (Unknown)")
    }

    // game.dropPlayer()
}

// function to allow input from user splats
//let us assume splatCoords be objects with splat coordinates such as {'xcoord': something,'ycoord':something}
function onInput(splatCoords) {
    const game = new Game;
    game.handleInput(this, splatCoords);

}
