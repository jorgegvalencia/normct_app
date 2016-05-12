var express      = require('express');
var app          = express();
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var api       = require('./routes/index');

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Use morgan middleware as logger
app.use(logger('dev'));

/**
 * Enable parser middleware
 *
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Enable cookie middleware
 *
 */
app.use(cookieParser());

// Express will use /frontend dir to access to index.html and other files required by AngularJS
app.use(express.static(path.join(__dirname, '../frontend')));

// Give access to bower components
app.use('/bower_components',express.static(path.join(__dirname, '../../bower_components/')));

// API routes

// param parsing
app.use(function (req, res, next) {
	// offset and limit
	req.offset = parseInt(req.query["offset"]  || 0);
	req.limit = parseInt(req.query["limit"]  || 10);

	
	next();
})

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message: err.message, error: err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({message: err.message, error: err});
});


module.exports = app;
