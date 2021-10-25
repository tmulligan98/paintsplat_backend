const Constants = require('./constants');
class Splat {
    constructor(x, y) {
        // Initial coords wrt to screen
        this.xCoord = x;
        this.yCoord = y;
        this.size = Constants.SPLAT_RADIUS;
        // need colour?
        this.color = "";

        // Origin (0,0) of canvas is bottom left
    }

}

module.exports = Splat;