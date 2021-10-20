const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Lobby = require('./lobby')
const { create } = require('domain')
const { Constants } = require('buffer')
const { disconnect } = require('process')

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
// currently handles 2 playes. Can be amended as per the requirements for the game
const connections = [null, null];
const lobby = null;
const game = game;

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
        lobby.startGame(socket.id);
    });


    // console.log('New WS Connection')

    // Find an available player number
    // let playerIndex = -1;
    // for (const i in connections) {
    //     if (connections[i] === null) {
    //         playerIndex = i
    //         break
    //     }
    // }

    // // Tell the connecting client what player number they are
    // socket.emit('player-number', playerIndex)



    // // Ignore player 3 for now
    // if (playerIndex === -1) return

    // connections[playerIndex] = false

    // // Tell eveyone what player number just connected
    // socket.broadcast.emit('player-connection', playerIndex)

    // // Handle Diconnect
    // socket.on('disconnect', () => {
    //     console.log(`Player ${playerIndex} disconnected with id ${socket.id}`)
    //     connections[playerIndex] = null
    //     //Tell everyone what player number just disconnected
    //     socket.broadcast.emit('player-connection', playerIndex)
    // })

    // // On Ready
    // socket.on('player-ready', () => {
    //     socket.broadcast.emit('enemy-ready', playerIndex)
    //     connections[playerIndex] = true
    // })

    // // Check player connections
    // socket.on('check-players', () => {
    //     const players = []
    //     for (const i in connections) {
    //         connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] })
    //     }
    //     socket.emit('check-players', players)
    // })

    // Timeout connection
    // setTimeout(() => {
    //     connections[playerIndex] = null
    //     socket.emit('timeout')
    //     socket.disconnect()
    // }, 300000) //  Time limit per player needs to be set.Currently set to 5minutes
})


// Functions to be carried out...

// Setup a new game

// Handle user inputs

// Join a game

function onInput(splatCoords) { } //TODO: Handle input splats!!


function joinLobby(username, lobbyId) {  // Allow a socket connection to join the lobby.
    // Check if max player count exceeded
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
    // Create Lobby, add player who created.
    const lb = new Lobby(this, username);
    // Tell player what the id is
    this.emit("lobby_id: ", lb.lobbyId);
    // Assign global "lobby" to equal this.
    lobby = lb;

}
function onDisconnect() {   // Allow for someone to leave a game
    lobby.dropPlayer(this.id);
    io.emit("player_left: ", username)
    // game.dropPlayer()
}