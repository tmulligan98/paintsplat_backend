const Constants = require('./constants');

class target {
    constructor() {
        // Initial coords wrt to screen
        this.xCoord = 0.0;
        this.yCoord = 0.0;
        this.width = 0.0;
        this.height = 0.0;

        // Origin (0,0) of canvas is bottom left
        // This will be an array of splat objects
        this.splats = []
    }

    update(dt, splat) {

        // Is splat valid?
        if (this.updateSplat(splat)) {
            this.splats.push(splat);
        }

        // Update course of canvas
        // What trajectory is this going to follow?

    }

    updateSplat(splat) {
        let a = 0.0
        let b = 0.0
        for (spl in this.splats) {
            //c = sqrt(a^2 + b^2)
            a = abs(splat.xCoord - splat.xCoord);
            b = abs(splat.yCoord - splat.yCoord);
            c = sqrt(a ** 2 + b ** 2);
            if (c < 2 * Constants.SPLAT_RADIUS) {
                return false;
            }

        }
        return true;

    }

}
module.exports = target;