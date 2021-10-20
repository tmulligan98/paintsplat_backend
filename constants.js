// Create an object that can't be changed.
// Make it visible

module.exports = Object.freeze({

    PLAYER_FIRE_COOLDOWN: 2.0,
    SPLAT_RADIUS = 5.0,
    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        CREATE_GAME: "create_game",
        GAME_UPDATE: 'update',
        INPUT: 'input',
        GAME_OVER: 'game_over',
        LEAVE_GAME: "disconnect"
    },
});