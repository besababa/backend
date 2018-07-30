// spins up an express appliction
const express = require('express');
const app = express();

// organizes hierarchical configurations - depends on NODE_ENV
const config = require('config');

// debugging utility depends on - depends on debug env
const debug = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');

// An object schema validator
const Joi = require('joi');

// HTTP request logger middleware
const morgan = require('morgan');

// Authenticated user middleware
const authUser = require('./api/middleware/auth');

// Handel the body post request
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// require all routes
const eventRoutes = require('./api/routes/events/events');
const userRoutes = require('./api/routes/users/users');
const authRoutes = require('./api/routes/auth/auth');

// checks for the custom-environment-variables.json
const mongoConnetionString = config.get('mongoUrl');

//checks for private key
if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect(mongoConnetionString).then((value) => {
  debug('Connected to MongoDb');
}).catch((err) => {
  console.error('Could not connected to MongoDb',err)
});

// sets up a log middleware - only for dev
if(app.get('env') === 'development') app.use(morgan('dev'));

// parse various different custom JSON types as JSON
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended: true}));


// solve the CORS Cross-Origin Resource Sharing error
// to set it only for my site use https://sitename.com instead of *
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headrs',
  'Origin, X-Requested-with, Content-Type, Accept, Authorization');

  // the incoming request eq to options
  // a browser will always sand an options req (pre-flight) before other req
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// sets up a route middleware
// an incoming request must pass here
app.use('/events', authUser, eventRoutes);
app.use('/users', authUser, userRoutes);
app.use('/',authRoutes);

// handel every request that reaches this line
// no route was able to handle this request
app.use((req,res,next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// handle all kinds of errors the 404
// or any other error thrown by the application
// like 500 that will throw automatically an error object
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({error:error.message});
});


module.exports = app;
