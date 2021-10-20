const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const constants = require('./constants')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Player = require("./player")

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
// currently handles 2 playes. Can be amended as per the requirements for the game
const connections = [null, null]

io.on('connection', socket => {

    console.log(`Player connected! ${socket.id}`)

    // Handle various client requests
    // I think we should encapsulate all youre functionality to a few functions like this
    // It'll help keep things clean.
    // The way I understand the game:
    // Player can host or join a lobby
    // I think Lobby should be a class.

    socket.on(constants.MSG_TYPES.JOIN_GAME, joinLobby);
    socket.on(constants.MSG_TYPES.HOST_GAME, createLobby);
    socket.on(constants.MSG_TYPES.LEAVE_GAME, onDisconnect);
    // This will handle splats.
    socket.on(constants.MSG_TYPES.INPUT, onInput);
    //

    // All of this can be in a function
    // Find an available player number
    let playerIndex = -1;
    for (connection in connections) {
        if (connection === null) {
            playerIndex = i;
            break
        }
    }
    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)

    // Ignore player 3 for now. This isn't good, why return from something that isn't a function?
    if (playerIndex === -1) return
    // Player not ready
    connections[playerIndex] = false
    // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex)
    // End function


    // Handle Diconnect
    socket.on(constants.MSG_TYPES.LEAVE_GAME, () => {
        // Make a function
        console.log(`Player ${playerIndex} disconnected with id ${socket.id}`)
        connections[playerIndex] = null
        //Tell everyone what player number just disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    })

    // On Ready
    socket.on('player-ready', () => {
        // Make a function
        socket.broadcast.emit('enemy-ready: ', playerIndex)
        connections[playerIndex] = true
    })

    // Not sure about this? When will clients request to see other players. I think we should automatically send player lists,
    // ... Whenever some joins/leaves a lobby
    // Check player connections
    socket.on('check-players', () => {
        // Make a function
        const players = []
        for (const i in connections) {
            connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] })
        }
        socket.emit('check-players', players)
    })

    // Timeout connection
    setTimeout(() => {
        connections[playerIndex] = null
        socket.emit('timeout')
        socket.disconnect()
    }, 300000) //  Time limit per player needs to be set.Currently set to 5minutes
})

// Haven't done this yet, but will need a lobby class.
// const lobby = new Lobby();
// Functions to be carried out...

// Setup a new game

// Handle user inputs

// Join a game

function onInput() { }
function joinLobby() { }
//Only allow a single game to be hosted
function createLobby() { }
function onDisconnect() { }