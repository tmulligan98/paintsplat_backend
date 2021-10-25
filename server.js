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
const canvas = require('./canvas');

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
// currently handles 2 playes. Can be amended as per the requirements for the game

// const game = null;

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
    // Todo: Host only
    socket.on(Constants.MSG_TYPES.START_GAME, () => {
        lobby.startGame(socket.id);
    });

})



const lobby = new Lobby();

// function onInput(splatCoords) { } //TODO: Handle input splats!!


function joinLobby(username) {  // Allow a socket connection to join the lobby.
    // Check if max player count exceeded
    console.log("Player joining lobby:", username);
    if (lobby.playerCount > Constants.MAX_PLAYERS) {
        this.emit(Constants.MSG_TYPES.DENY_ENTRY)
        return;
    }
    // Otherwise...
    lobby.addPlayer(this, username)
    // Announce new player
    io.emit("new_player: ", username)
}


//Only allow a single game to be hosted
function createLobby(username) {    // Allow for someone to host a game.
    // Assign lobby host as player
    // Tell player what the id is
    console.log("Player creating lobby:", username);
    this.emit("lobby_id: ", lobby.lobbyId);
    lobby.addHost(this, username);
}

function onDisconnect() {   // Allow for someone to leave a game
    username = lobby.dropPlayer(this.id);
    console.log("Player leaving:", username);
    io.emit("player_left: ", username)
    // game.dropPlayer()
}

// function to allow input from user splats
//let us assume splatCoords be objects with splat coordinates such as {'xcoord': something,'ycoord':something}
function onInput(splatCoords){
    game.handleInput(this, splatCoords);
     
}
  