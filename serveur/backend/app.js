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


//initialize a simple http server
/*const server = http.createServer(app)



//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {

    //log the received message and send it back to the client
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});*/

io.on('connection', function(client) {
  console.log('Client connected...')

  client.on('new-web-client', async function (_id) {
    console.log(client.sessionId)

    /*console.log(_id)
    const user = await User.updateWebClient(_id, client)
    user.webClient.emit('messageChannel', 'Pong')*/
  })









  client.on('pingServer', function (data) {
    console.log(data);
    client.emit('messageChannel', 'Pong')
  })

  client.on('join', function(data) {
    console.log(data);
    client.emit('messages', 'Hello from server')
  })

  client.on('messages', function(data) {
    client.emit('broad', data);
    console.log(data)
    client.broadcast.emit('broad',data);
  })
})
// start server
server.listen(config.APP_PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

// app.listen(config.APP_PORT); // Listen on port defined in environment


module.exports = app;