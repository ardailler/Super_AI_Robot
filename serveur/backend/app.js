//app.js

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
require('dotenv').config({path: __dirname + '/.env'})


/*const { spawn } = require('child_process')
const pythonProcess = spawn('python',["./python/test.py"])
pythonProcess.stdout.on('data', (data) => {
  let json = JSON.parse(data.toString())
  console.log(json)
  console.log(json.test)
  // Do something with the data returned from python script
})*/
/////////////////////////////////
/*const torch = require("@idn/torchjs");

var test_model_path = "../../ai/dqn.pt";

var script_module = new torch.ScriptModule(test_model_path);

var a = torch.rand(1, 5); // Etat de l'environnement

var c = script_module.forward(a); // C = Action à faire par le robot*/
/////////////////////////////////////


const config = require('./config/Config');

const routes = require('./routes')

const app = express();

mongoose.connect(config.DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.all("/api/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
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

app.listen(config.APP_PORT); // Listen on port defined in environment


module.exports = app;