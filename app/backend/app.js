var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var api = require('./routes/index');

var clients = require('./model/clients');

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
app.use('/bower_components', express.static(path.join(__dirname, '../../bower_components/')));
app.use('/fonts', express.static(path.join(__dirname, '../../bower_components/bootstrap/fonts/')));

io.sockets.on('connection', function(socket) {
    var socketid = socket.id.replace('/#', '');
    clients[socketid] = socket;
    // clients.push(socket.id);
    console.info('New client connected (id=' + socketid + ').', 'Current clients: ', Object.keys(clients).length);
    // io.to(socket.id).emit('You are connected');
    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function() {
        var socketid = socket.id.replace('/#', '');
        var index = clients[socketid];
        if (index) {
            // clients.splice(index, 1);
            delete clients[socketid];
            console.info('Client gone (id=' + socketid + ').');
        }
    });
});

// Add socket.io in response object
app.use(function(req, res, next) {
    res.io = io;
    next();
});

// param parsing
app.use(function(req, res, next) {
    // offset and limit
    req.offset = parseInt(req.query["offset"] || 0);
    req.limit = parseInt(req.query["limit"] || 1000);
    next();
})

// API routes
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
        res.json({ message: err.message, error: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });
});


module.exports = { app: app, server: server };
