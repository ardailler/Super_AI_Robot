const back = require('androidjs').back
const fs = require('fs')
const path = require('path')
var five = require("johnny-five")
const {Board, Servo, Servos, Proximity} = require("johnny-five");
var board = null
var car = null
var distancetowall = 0
var lastprox = 0

try {
    board = new five.Board()
} catch (err) {
    console.log('err : ', err)
    back.send('err', err)
}

init();


function play(){
    move(4);
}




function init(){
    board.on("ready", function() {
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
    distancetowall = centimeters/100;
    });

    play()

    });

}


function getProximity(){
    tmp = lastprox
    lastprox = distancetowall
    if tmp !=0 :
        return [tmp-distancetowall , distancetowall]
    else:
        return [0,distancetowall]

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










back.on('save-data', function (filepath, msg) {
    fs.writeFile(path.join(filepath, 'data.txt'), msg, function (err) {
        if (err) throw err
        console.log('file saved')
    })
})

back.on('get-data', function (filepath) {
    fs.readFile(path.join(filepath, 'data.txt'), 'utf-8', function (err, data) {
        if (err) back.send('get-data-result', '@@')
        else back.send('get-data-result', data)
    })
})