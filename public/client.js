const socketio = require("socket.io-client");
const CREATE_MSG = { "username": "Player1" }
const JOIN_MSG = { "username": "Player2", "LobbyId": "AAAAA" }
const SPLAT_A = { 'x_coord': 100, 'y_coord': 40 }
const SPLAT_B = { 'x_coord': 30, 'y_coord': 30 }

const socket = socketio.connect("http://localhost:3000");
//const socket = socketio.connect("https://pure-meadow-74449.herokuapp.com");

// When emitting, the first param is the event, the next is the message / object...

const readline = require('readline');

function replDemo() {
    return new Promise(function (resolve, reject) {
        let rl = readline.createInterface(process.stdin, process.stdout)
        rl.setPrompt('ready> ')
        rl.prompt();
        rl.on('line', function (line) {
            if (line === "exit" || line === "quit" || line == 'q') {
                rl.close()
                return // bail here, so rl.prompt() isn't called again
            }

            if (line === "1") {
                console.log(`Host game`)
                socket.emit("host_game", CREATE_MSG)
                socket.on("lobby_id", messageInput)
            } else if (line === "2") {
                console.log('Join Game')
                socket.emit("join_game", JOIN_MSG)
                socket.on("player_list", messageInput)
            } else if (line === "3") {
                console.log('Start')
                socket.emit("start_game")
                socket.on("start_game", messageInput)
            } else if (line === "4") {
                socket.emit("input", SPLAT_A)
            } else if (line === "5") {
                socket.emit("input", SPLAT_B)
            } else {
                console.log(`unknown command: "${line}"`)
            }
            rl.prompt()

        }).on('close', function () {
            console.log('bye')
            resolve(42) // this is the final result of the function
        });
    })
}

async function run() {
    try {
        let replResult = await replDemo()
        console.log('repl result:', replResult)
        socket.on("game_update", () => {
            console.log(update + "\n\n")
        })

    } catch (e) {
        console.log('failed:', e)
    }
}

function messageInput(message) {
    console.log(message)
}

run()