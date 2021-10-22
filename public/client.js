// MSG_TYPES = {
//     JOIN_GAME: 'join_game',
//     GAME_UPDATE: 'update',
//     INPUT: 'input',
//     GAME_OVER: 'dead',
// }

// Import net module.

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


const socketio = require("socket.io-client");
const { MSG_TYPES } = require("../constants");

const socket = socketio.connect("http://localhost:3000");
//const socket = socketio.connect("https://pure-meadow-74449.herokuapp.com");

readline.question('Enter:', command => {
    console.log("Here")
    // socket.emit("host_game", "Player1")
    if (command === '1') {
        socket.emit("host_game", "Player1")
    }
    if (command === '2') {
        socket.emit("join_game", "Player2")
    }
    readline.close();
});





