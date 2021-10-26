const Constants = require('./constants');

class Player {

    constructor(id, username, colour) {
        this.username = username;
        this.id = id;
        this.score = 0;
        // this.initial_x = 0.0;
        // this.initial_y = 0.0;
        this.fireCooldown = 0;
        this.colour = colour;

    }


    update(splat_confirmation, dt, splat_fired) {

        // Player has to be able to fire again after cooldown

        // Add a point
        // if (splat_confirmation) {
        //     this.score += 1;
        // }
        // Begin Cooldown
        // if (splat_fired) {
        //     this.fireCooldown = Constants.PLAYER_FIRE_COOLDOWN
        // }
        // Cooldown splatter
        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
        }

    }


}

module.exports = Player;