const Constants = require('./constants');
class Splat {
    constructor(x, y, player) {
        // Initial coords wrt to screen
        this.xCoord = x;
        this.yCoord = y;
        this.size = Constants.SPLAT_RADIUS;
        // need colour?
        this.player = player


        // Origin (0,0) of canvas is bottom left
    }

}

module.exports = Splat;