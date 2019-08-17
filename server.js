require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var dbRoute = process.env.MONGODB_URI || 'mongodb://localhost/riceeats';
var port = process.env.PORT || 3000;

mongoose.connect(dbRoute, { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));
db.once('open', () => console.log("Database connection successful"))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static Directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// Routing
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port);
console.log("App listening on port " + port);

module.exports = app;