var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStategy = passportLocal.strategy;
let flash = require('connect-flash');

var app = express();

//model for User collection
let UserModel = require('./models/user');
let User = UserModel.User;

//setup express session 
app.use(session({
	secret:"SomeSecret",
	saveUninitialized: true,
	resave:false

}));
//implement a User auth
passport.use(User.createStrategy());



//inialize the flash
app.use(flash());
//initialize passport
app.use(passport.initialize());
app.use(passport.session());


//serial and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var indexRouter = require('./routes/index');




// config mongoDB
let mongoose = require('mongoose');
let DB = require('./db');


// send mongoose to our DB URI
mongoose.connect(DB.URI);
let mongDB = mongoose.connection;
mongDB.on('error', console.error.bind(console, 'Connection Error:  '))
mongDB.once('open', ()=>{
  console.log('Connected to MongoDB');

});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));





app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
