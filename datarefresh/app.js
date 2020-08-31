var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var photosRouter = require('./routes/photos');
var loginFacebookRouter = require('./routes/login-facebook');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/photos', photosRouter);
app.use('/facebooklogin', loginFacebookRouter);

module.exports = app;
