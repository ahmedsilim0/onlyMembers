require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
const session = require("express-session");
const passport = require("passport");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var URI = require('./config/connect');
var indexRouter = require('./routes/index');

const app = express();


//connect to mongoDB
mongoose.connect(URI ,{useNewUrlParser:true ,useUnifiedTopology :true , useFindAndModify:false , useCreateIndex:true})
.then(()=>console.log('Connected'))
.catch((error) => {
    console.log('error');
});

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for passsport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });
  
  app.use('/', indexRouter);
  
  module.exports = app;

  
app.listen(3000 , (req,res)=>console.log('app is running...'));
