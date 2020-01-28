var five = require("johnny-five")
const {Board, Servo, Servos, Proximity} = require("johnny-five");
var board = null
var car = null
var distancetowall = 0
var lastprox = 0

function play(){
    move(4);
}
try {
    board = new five.Board()
} catch (e) {
    console.log("error johnny : ", e)
}

function init() {
    board.on("ready", function () {
        // Create two servos as our wheels
        let wheels = {}
        wheels.left = new five.Servo({
            pin: 13,
            type: "continuous"
        });
        wheels.right = new five.Servo({
            pin: 12,
            type: "continuous",
            invert: true // one wheel mounted inverted of the other
        });
        wheels.both = new Servos([wheels.left, wheels.right]);
        car = wheels
        wheels.both.stop()

        const proximity = new Proximity({
            controller: "HCSR04",
            pin: 7
        });

        proximity.on("change", () => {
            const {centimeters, inches} = proximity;
            distancetowall = centimeters / 100;
        });

        play()

    });

}

//0 = stop , 1 = forward , 2 = backward , 3 = left , 4 = right
function move(state){
    lastprox = 0
    switch (state) {
        case 0:
            car.both.stop();
            break;
        case 1:
            car.both.cw()
            break;
        case 2:
            car.both.ccw()
            break;
        case 3:
            car.right.cw();
            car.left.ccw();
            break;
        case 4:
            car.right.ccw();
            car.left.cw();
            break;
    }
}

module.exports = init;