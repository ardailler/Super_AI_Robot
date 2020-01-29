//app.js

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const johnMethods = require('./johnny.js')
johnMethods.initJohn()
/*const http = require('http')
const WebSocket = require('ws')*/
require('dotenv').config({path: __dirname + '/.env'})
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const User = require('./models/User')

// 1-4 orientation, 1-3 distance au mur
const { spawn } = require('child_process')

/*const pythonProcess = spawn('python',["./python/get_action.py", "1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2"])
let response = null
pythonProcess.stdout.on('data', (data) => {
  let json = JSON.parse(data.toString())
   response = json
})*/

function run (cmd, arg, callback) {
  var spawn = require('child_process').spawn;
  var command = spawn(cmd, arg);
  var result = '';
  command.stdout.on('data', function(data) {
    let json = JSON.parse(data.toString())
    result = json
  });
  command.on('close', function(code) {
    return callback(result);
  });
}

const config = require('./config/Config');

const routes = require('./routes')


mongoose.connect(config.DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.all("/api/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Expose-Headers', 'Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  return next();
})

app.use(cors());  //enable cors

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error pages
  res.status(err.status || 500);
  res.render('error');
});


let alphaList = {}

let counter = 40
let sizeOfCase = 0
let initOrientation = 0
let init = false

// websockets
io.on('connection', function(client) {
  console.log('Client connected...')
  client.emit('connected', 'Hello you are connected')
  // new web client is connected
  client.on('new-web-client', async function (_id) {
    client.emit('connected', 'Hello you are connected')
    const client_id = client.id
    const user = await User.updateWebClient(_id, client_id, true)
    io.to(user.webClient).emit('webClient')
  })
    // update connection
    client.on('webIsAlive', async function (_id) {
        const client_id = client.id
        const user = await User.updateWebClient(_id, client_id, true)
    })
    // update actions
    client.on('addActions', async function (_id, salle_id, actions) {
        const user = await User.findById(_id)
        const client_id = user.webClient
        io.to(client_id).emit('newActionsAdded', {salle_id: salle_id, actions: actions})
    })


  // application connected
  client.on('new-app-client', async function (_id) {
    console.log('Hello you are connected '+_id)
    const client_id = client.id
    const user = await User.updateAppClient(_id, client_id, true)
    io.to(user.webClient).emit('app_connected')

  })



  // application connected
  client.on('kill-app-client', async function (_id) {
    console.log('kill '+_id)
    const client_id = client.id
    const user = await User.updateAppClient(_id, '', false)
    if (io.sockets.connected[user.webClient] && user.webIsAlive) {
      io.sockets.connected[user.webClient].emit('app_disconnected')
    }

  })

  // update connection
  client.on('appIsAlive', async function (_id) {
    const user = await User.findById(_id)
    await User.updateAppClient(_id, user.appClient, true)
  })

  client.on('new-data-boussole', async function (data) {
    alphaList[data._id] = data.alpha

    if (counter === 0) {
      let avancement = johnMethods.avancementJohn()
      let distance = johnMethods.distanceJohn()
      let data2 = {
        alpha: data.alpha,
        avancement: avancement,
        distance: distance
      }
      if (!init) {
        sizeOfCase = distance / 5
        initOrientation = data.alpha
        init = true
        for (let i = 0; i < 8; i++) {
          const user = await User.addHistorique(data._id, getOrientation(data.alpha), distance/sizeOfCase)
        }
      }

      goProcessus(data.alpha)

      counter = 40
    } else {
      counter --
    }

    /*init*/
    // alpha + avancement + distance
    // convertir
    //remplir base
    // ask python

    // utilise reponse python
    // verifier + - 5 alpha
    // alpha + avancement + distance
    // convertir
    // si case different
    // stop && ask python


    /*console.log(data.alpha)
    if (data.alpha > 180 && data.alpha < 190) {
      johnMethods.moveJohn(4)
    }else if ((data.alpha < 5 && data.alpha > 0) || (data.alpha > 355 && data.alpha < 360))
    johnMethods.moveJohn(3)*/

  })

})

function getOrientation (_orient) {
  if (_orient < ((initOrientation + 5) % 360) && _orient > ((initOrientation - 5) % 360)) {
    return 0
  } else if (_orient < (((initOrientation + 90) + 5) % 360) && _orient > (((initOrientation + 90) - 5) % 360)) {
    return 3
  } else if (_orient < (((initOrientation + 180) + 5) % 360) && _orient > (((initOrientation + 180) - 5) % 360)) {
    return 2
  } else if (_orient < (((initOrientation - 90) + 5) % 360) && _orient > (((initOrientation - 90) - 5) % 360)) {
    return 1
  }
}

// check connection
setInterval( async () => {
  User.find({}, function (err, users) {
    users.forEach(async (user) => {
      try {
        await checkWebConnection(user)
        await checkAppConnection(user)
      } catch (e) {
        console.log(e)
      }
    })
  })
}, 10000);


async function checkWebConnection (user)
{
  try {
    if (user.webClient && user.webClient !== '') {
      if (io.sockets.connected[user.webClient] && !user.webIsAlive) {
        io.sockets.connected[user.webClient].emit('disconnected', 'Hello you are disconnected')
        io.sockets.connected[user.webClient].disconnect()
        await User.updateWebClient(user._id, '', false)
      } else {
        await User.updateWebClient(user._id, user.webClient, false)
        io.to(user.webClient).emit('webRUAlive')
      }
    }
  } catch (e) {
    console.log(e)
  }
}

async function checkAppConnection (user)
{
  try {
    if (user.appClient && user.appClient !== '') {
      if (io.sockets.connected[user.appClient] && !user.appIsAlive) {
        io.sockets.connected[user.webClient].emit('app_disconnected', 'Hello you are disconnected')
        io.sockets.connected[user.appClient].disconnect()
        await User.updateWebClient(user._id, '', false)
      } else {
        await User.updateAppClient(user._id, user.appClient, false)
        io.to(user.webClient).emit('appRUAlive')
      }
    }
  } catch (e) {
    console.log(e)
  }
}

let actionEnCours = 0
let wait = false
let orientDebutAction = 0

let distanceDebutAction = 0

async function goProcessus(orient) {
  const histo = await User.getHistorique(data._id)
  console.log(histo)
  if (actionEnCours === 0 && ! wait) {
    wait = true
    await run("python", ["./python/get_action.py", histo], function (result) {
      let nextAction = result.action
      useAction(nextAction, orient)
      wait = false
    })
  } else if (actionEnCours === 1 && nextAction === 0) {
    if (_orient < (((orientDebutAction + 90) + 5) % 360) && _orient > (((orientDebutAction + 90) - 5) % 360)) {
      johnMethods.moveJohn(0)

      let avancement = johnMethods.avancementJohn()
      let distance = johnMethods.distanceJohn()
      distanceDebutAction = distance
      let data2 = {
        alpha: orient,
        avancement: avancement,
        distance: distance
      }
      nextAction = 2
      useAction(nextAction, orient)
    } else if (actionEnCours === 3 && nextAction === 2) {
      let distance = johnMethods.distanceJohn()
      if (distance < (distanceDebutAction - sizeOfCase)) {
        johnMethods.moveJohn(0)
        actionEnCours = 0
        const user = await User.addHistorique(data._id, getOrientation(data.alpha), distance/sizeOfCase)
      }
    }
  } else if (actionEnCours === 1 && nextAction === 1) {
    if (_orient < (((orientDebutAction - 90) + 5) % 360) && _orient > (((orientDebutAction - 90) - 5) % 360)) {
      johnMethods.moveJohn(0)

      let avancement = johnMethods.avancementJohn()
      let distance = johnMethods.distanceJohn()
      distanceDebutAction = distance
      let data2 = {
        alpha: orient,
        avancement: avancement,
        distance: distance
      }
      nextAction = 2
      useAction(nextAction, orient)
    } else if (actionEnCours === 3 && nextAction === 2) {
      let distance = johnMethods.distanceJohn()
      if (distance < (distanceDebutAction - sizeOfCase)) {
        johnMethods.moveJohn(0)
        actionEnCours = 0
        const user = await User.addHistorique(data._id, getOrientation(data.alpha), distance/sizeOfCase)
      }
    }
  }

}

/*- Action 0 : gauche
- Action 1 : droite
- Action 2 : Avancer*/
function useAction(_action, _orient) {
  switch (_action) {
    case 0:
      orientDebutAction = _orient
      johnMethods.moveJohn(3)
      actionEnCours = 1
      break
    case 1:
      orientDebutAction = _orient
      johnMethods.moveJohn(4)
      actionEnCours = 2
      break
    case 2:
      orientDebutAction = _orient
      johnMethods.moveJohn(2)
      actionEnCours = 3
      break
  }
}


// start server
server.listen(config.APP_PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

// app.listen(config.APP_PORT); // Listen on port defined in environment


module.exports = app
