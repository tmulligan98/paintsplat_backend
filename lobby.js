const { emit } = require('nodemon');
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

    for (let i = 0; i < Constants.LOBBY_ID_SIZE; i++) {
        result += alphabet.charAt(Math.floor.apply(Math.random() * alphabet.length))
    }

    return result;
}



class Lobby {
    constructor() {
        this.lobbyId = "";
        this.playerCount = 0;
        this.players = {};
        this.game = new Game();
        this.sockets = {};
        this.hostId = "";
        this.playerUsernames = [];

        //
        this.lobbyId = makeId();
    }

    addHost(socket, username) {
        this.hostId = socket.id;
        this.addPlayer(socket, username);
    }

    // TODO: Given a playerId, drop a player from the game.
    dropPlayer(playerId) {
        // Get the player username
        const uName = this.players[playerId].username;
        this.playerCount -= 1;
        delete this.players[playerId];
        delete this.sockets[playerId];

        // Check if player was host, if so assign to next player on list, and tell them.
        if (uName === this.hostUsername) {
            this.hostUsername = this.players[0].username;
            let newHostId = this.players[0].id;
            // Inform them of changes
            console.log("New host is: ", this.hostUsername);
            const msg = Constants.RESPONSE_BODY;
            msg["message"] = "You're the new host!";
            msg["time"] = Date.now();
            this.sockets[newHostId].emit(Constants.MSG_TYPES.NEW_HOST, msg);
        }

        // Remove the player
        for (var i = 0; i < this.playerUsernames.length; i++) {
            if (this.playerUsernames[i] === uName) {
                this.playerUsernames.splice(i, 1)
                i--;
            }

        }
        return uName
    }

    // Given a player object, add that player
    addPlayer(socket, username) {
        this.sockets[socket.id] = socket;
        this.playerCount += 1;
        this.players[socket.id] = new Player(socket.id, username);
        this.playerUsernames.push(username);
        // Tell player who is already in game
        socket.emit("players: ", this.playerUsernames);
    }

    startGame(playerId) {   // Commence the game. This should return the game object to where it is called (server.js)
        // Check that the person issuing the command is the host
        if (playerId !== this.hostId) {
            const msg = Constants.ERROR_MESSAGE_BODY;
            msg["code"] = 401;
            msg["message"] = "You're not the host!";
            this.sockets[playerId].emit(Constants.MSG_TYPES.ERROR_MSG, msg);
            console.log("Non-host player " + this.sockets[playerId].username + " attempted to start the game.");
            return null;
        }
        // Populate the game.
        this.game.players = this.players;
        this.game.sockets = this.sockets;

        // Return game object, populated with players.
        return this.game;
    }


    closeLobby() {
        // Inform players
        for (socket in this.sockets) {
            socket.emit(Constants.MSG_TYPES.GAME_END);
        }
        this.playerCount = 0;
        this.players = {};
        this.game = new Game();
        this.sockets = {};
        this.hostId = "";
        this.playerUsernames = [];
    }


}
module.exports = Lobby;