// Create an object that can't be changed.
// Make it visible

module.exports = Object.freeze({

    PLAYER_FIRE_COOLDOWN: 2.0,
    SPLAT_RADIUS: 5.0,
    SCREEN_HEIGHT: 200,
    SCREEN_WIDTH: 200,
    CANVAS_HEIGHT: 80,
    CANVAS_WIDTH: 80,
    MAX_ACCELERATION: 3,
    MAX_SPEED: 20,
    LOBBY_ID_SIZE: 6,
    MAX_PLAYER: 2,
    MSG_TYPES: {
        DENY_ENTRY: "no_entry",
        JOIN_GAME: "join_game",
        START_GAME: "start_game",
        HOST_GAME: "host_game",
        INPUT: 'input',
        GAME_UPDATE: 'update_game',
    },


});