//app.js

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
/*const http = require('http')
const WebSocket = require('ws')*/
require('dotenv').config({path: __dirname + '/.env'})
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const User = require('./models/User')


/*const { spawn } = require('child_process')
const pythonProcess = spawn('python',["./python/test.py"])
pythonProcess.stdout.on('data', (data) => {
  let json = JSON.parse(data.toString())
  console.log(json)
  console.log(json.test)
  // Do something with the data returned from python script
})*/


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

})

// check connection
setInterval( async () => {
  User.find({}, function (err, users) {
    users.forEach(async (user) => {
      try {
        await checkWebConnection(user)
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


// start server
server.listen(config.APP_PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

// app.listen(config.APP_PORT); // Listen on port defined in environment


module.exports = app
