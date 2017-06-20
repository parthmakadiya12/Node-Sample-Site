var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var classes = require('./routes/classes');
var inUsers = require('./routes/inUsers');
var request = require('./routes/request');
var conversations = require('./routes/conversations');
var email = require('./routes/email');

var app = express();
var db = require('./db');

let http = require('http').Server(app);
var io;
exports.io= io = require('socket.io')(http);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials: true");
  res.header("Access-Control-Allow-Origin", "http://0.0.0.0:3005");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,uid, Content-Type, Accept, Authorization");
  
  next();
});
*/
var whitelist = [
    'http://localhost:3000','http://localhost:4200','http://localhost:5000','http://localhost:3005'
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
    ,optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.options('*', cors()) 
app.use(cors(corsOptions));

app.use('/', index);
app.use('/users', users);
app.use('/classes', classes);
app.use('/inUsers', inUsers);
app.use('/requestC', request);
app.use('/conversations',conversations);
app.use('/email',email);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});


db.connect('mongodb://localhost:27017/inData', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3005, function() {
      console.log('Listening on port 3005...')
    })
  }
})
//app["io"] = io;
module.exports = app;
