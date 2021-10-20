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
    // Socket inputs shouldnt be handled here
    // We should only call functions, and send updates (via socket.emit) here
    // I think this is too complicated
    // Multiplayer
    startMultiPlayer() {
        gameMode = 'multiPlayer'

        const socket = io();
        let playerNum = 0
        let gameMode = ""
        let currentPlayer = 'user'
        let ready = false
        let enemyReady = false

        // Is this not done in server.js?
        // Get your player number
        socket.on('player-number', num => {
            if (num === -1) {
                console.log("Sorry, the server is full")
            }
            else {
                playerNum = parseInt(num)
                if (playerNum === 1) {
                    currentPlayer = "enemy"
                }
                console.log(playerNum)

                // Get other player status
                socket.emit('check-players')
            }
        })

        // Handle in server.js. Call game class from there
        // Another player has connected or disconnected
        socket.on('player-connection', num => {
            console.log(`Player number ${num} has connected or disconnected`)
            playerConnectedOrDisconnected(num)
        })

        // Server.js again
        // On enemy ready
        socket.on('enemy-ready', num => {
            enemyReady = true
            playerReady(num)
            if (ready) {
                playMultiplayerGame(socket)
            }
        })


        // server.js
        // Check player status
        socket.on('check-players', players => {
            players.forEach((p, i) => {
                if (p.connected) playerConnectedOrDisconnected(i)
                if (p.ready) {
                    playerReady(i)
                    if (i !== playerReady) enemyReady = true
                }
            })
        })


        // Not sure if we need this right now.
        // On Timeout
        socket.on('timeout', () => {
            console.log('You have reached the 10 minute limit')
        })

        // Server stuff
        function playerConnectedOrDisconnected(num) {
            let player = `.p${parseInt(num) + 1}`

            if (parseInt(num) === playerNum) {
                //add according to requirements
            }
        }
        function playerReady(num) {
            let player = `${parseInt(num) + 1}`
            // add according to requirements
        }

        function playMultiplayerGame(socket) {
            //To do:.......
            break
        }

    }
}

// addPlayer

// removePlayer

// handleInput

// update
// Needs to:
// Get time from last update
// Handle user inputs. Maybe have a queue of player instructions to issue? LIFO kinda thing
// Update: (Update every other time? 30 ticks per second is okay)
// each player
// Update the board.
// Update splats.


module.exports = Game;