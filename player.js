const Constants = require('./constants');

class Player {

    constructor(id, username, initial_x, initial_y) {
        this.username = username;
        this.id = id;
        this.score = 0;
        this.initial_x = initial_x;
        this.initial_y = initial_y;
        this.fireCooldown = 0;

    }


    update(splat_confirmation, dt, splat_fired) {

        // Add a point
        if (splat_confirmation) {
            this.score += 1;
        }
        // Begin Cooldown
        if (splat_fired) {
            this.fireCooldown = Constants.PLAYER_FIRE_COOLDOWN
        }
        // Cooldown splatter
        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
        }

    }


}

module.exports = Player;