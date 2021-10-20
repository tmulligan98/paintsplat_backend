const Constants = require('./constants');
const Game = require('./game');
const Player = require('./player');


// This class will be instantiated when a player chooses to host a game.
// In here, we have methods to:
// Get the lobby id, a random 6 character string
// Start the game
// Close the lobby

// Return a random ID
function makeId() {

    let result = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (const i = 0; i < Constants.LOBBY_ID_SIZE; i++) {
        result += alphabet.charAt(Math.floor.apply(Math.random() * alphabet.length))
    }

    return result;
}



class Lobby {

    constructor(socket, hostUsername) {
        this.lobbyId = makeId()
        this.playerCount = 0;
        this.players = {};
        this.game = new Game;
        this.sockets = {};
        this.hostId = socket.id;
        this.playerUsernames = []
        // Add host socket
        this.addPlayer(socket, hostUsername);
    }

    // TODO: Given a playerId, drop a player from the game.
    dropPlayer(playerId) {
        this.playerCount -= 1;
        delete this.players[playerId];
        delete this.sockets[playerId];

        // Get the player username
        uName = this.players[playerId].username;
        // Remove the player
        for (var i = 0; i < this.playerUsernames.length; i++) {
            if (this.playerUsernames[i] === uName) {
                this.playerUsernames.splice(i, 1)
                i--;
            }

        }
    }

    // Given a player object, add that player
    addPlayer(socket, username) {
        this.sockets[this.sockets.id] = socket;
        this.playerCount += 1;
        this.players[socket.id] = new Player(socket.id, username);
        // Tell player who is already in game
        socket.emit("players: ", this.playerUsernames);
    }

    startGame(playerId) {   // Commence the game. This should return the game object to where it is called (server.js)
        // Check that the person issuing the command is the host
        if (playerId !== this.hostUsername) {
            sockets[playerId].emit("You're not the host!");
        }
        // Populate the game.
        this.game.players = this.players;
        this.game.sockets = this.sockets;

        // Return game object, populated with players.
        return this.game;
    }


    // TODO: Close the lobby. Drop each player, then delete object
    closeLobby() { }


}

