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
    back.send('toast-msg', 'load board')
    board = new five.Board({port: "dev/ttys2"})
    back.send('toast-msg', 'board load')
} catch (err) {
    console.log('err : ', err)
    back.send('toast-msg', err)
}

setTimeout(function () {
    back.send('toast-msg', '-1s avant init')
}, 4000)
setTimeout(function () {
    back.send('toast-msg', 'board : ' + board)
    // init();
    // back.send('toast-msg', 'init work')
}, 5000)


function play(){
    move(4);
}


function init() {
    back.send('toast-msg', 'board : ' + board)
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


function getProximity(){
    tmp = lastprox
    lastprox = distancetowall
    if (tmp != 0) {
        return [tmp-distancetowall , distancetowall]
    }
    else {
        return [0,distancetowall]
    }

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





back.on('save-ip', function(filepath, msg){
    fs.writeFile(path.join(filepath, 'ip.txt'), msg, { flag: 'wx' }, function(err){
        if(err) throw err;
        if (err) {
            back.send('toast-msg', err)
        } else {
            back.send('toast-msg', 'ip saved')
        }
    })
})

back.on('get-ip', function(filepath){
    fs.readFile(path.join(filepath, 'ip.txt'), 'utf-8', function(err, data){
        if(err) back.send('get-ip-result', '');
        else back.send('get-ip-result', data);
    })
})

back.on('save-user', function(filepath, msg){
    fs.writeFile(path.join(filepath, 'user.txt'), msg, { flag: 'wx' }, function(err){
        if(err) throw err;
        if (err) {
            back.send('toast-msg', err)
        } else {
            back.send('toast-msg', 'user saved')
        }
    })
})

back.on('get-user', function(filepath){
    fs.readFile(path.join(filepath, 'user.txt'), 'utf-8', function(err, data) {
        if(err) back.send('get-user-result', '$$')
        else back.send('get-user-result', data)
    })
})





back.on('save-data', function(filepath, msg){
    fs.writeFile(path.join(filepath, 'data.txt'), msg, { flag: 'wx' }, function(err){
        if(err) throw err;
        if (err) {
            back.send('toast-msg', err)
        } else {
            back.send('toast-msg', 'file saved')
        }
        console.log('file saved')
    })
})




back.on('get-data', function(filepath){
    fs.readFile(path.join(filepath, 'data.txt'), 'utf-8', function(err, data){
        if(err) back.send('get-data-result', '@@');
        else back.send('get-data-result', data);
    })
})