const back = require('androidjs').back
const fs = require('fs')
const path = require('path')
var five = require("johnny-five")
var board = null
try {
    board = new five.Board()
} catch (err) {
    console.log('err : ', err)
    back.send('err', err)
}

try {
    board.on("ready", function() {
        var led = new five.Led(13)
        led.blink(500)
    })
} catch (err) {
    console.log(err)
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