// Create an object that can't be changed.
// Make it visible

module.exports = Object.freeze({

    PLAYER_FIRE_COOLDOWN: 2.0,
    SPLAT_RADIUS: 20.0,
    SCREEN_HEIGHT: 500,
    SCREEN_WIDTH: 400,
    CANVAS_HEIGHT: 220,
    CANVAS_WIDTH: 220,
    MAX_ACCELERATION: 1,
    MAX_SPEED: 3,
    LOBBY_ID_SIZE: 6,
    MAX_PLAYER: 2,
    MSG_TYPES: {
        DENY_ENTRY: "no_entry",
        JOIN_GAME: "join_game",
        START_GAME: "start_game",
        HOST_GAME: "host_game",
        INPUT: 'input',
        GAME_UPDATE: 'update_game',
        GAME_END: "game_end"
    },
    RESPONSE_BODY: {
        "message": "",
        "time": 0.00
    },
    PLAYER_LEFT_BODY: {
        "username": "",
        "time": 0.00
    },
    ERROR_MESSAGE_BODY: {
        "code": 0,
        "message": ""
    }
});

module.exports