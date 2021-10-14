// Load required libraries
const express = require("express");
const webpack = require("webpack");
const socketio = require("socket.io");
const webpackDevMiddleware = require("webpack-dev-middleware");


// Set up our express server
const app = express();
// We're serving static content
app.use(express.static("public"))


// Dev environment stuff
// ...
//

// Listen on port...
//const port = process.env.PORT || 3000
const port = 3000
const server = app.listen(port);
console.log(`Listening on port ${port}`);

// Get our socket.io going
const io = socketio(server);


// Listen for connections...
io.on("connection", socket => {
    console.log(`Player ${socket.id}`);
    // socket.on(Constants.MSG_TYPES.CREATE_GAME, createGame);
    // socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    // socket.on(Constants.MSG_TYPES.INPUT, handleInput);
    // socket.on('disconnect', onDisconnect);
})

// Functions to be carried out...

// Setup a new game

// Handle user inputs

// Disconnect players

// Join a game
