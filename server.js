const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
// currently handles 2 playes. Can be amended as per the requirements for the game
const connections = [null, null]

io.on('connection', socket => {
    // console.log('New WS Connection')

    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i
            break
        }
    }

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)

    console.log(`Player ${playerIndex} has connected with id ${socket.id}`)

    // Ignore player 3 for now
    if (playerIndex === -1) return

    connections[playerIndex] = false

    // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex)

    // Handle Diconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected with id ${socket.id}`)
        connections[playerIndex] = null
        //Tell everyone what player number just disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    })

    // On Ready
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true
    })

    // Check player connections
    socket.on('check-players', () => {
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


// Functions to be carried out...

// Setup a new game

// Handle user inputs

// Join a game