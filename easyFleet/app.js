
/**
 * Module dependencies.
 */

var express = require('express')
//Mongo Store
  , mongoStore = require('connect-mongodb') 
  , fmsConfig = require('./config')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server(fmsConfig.mongodb.host, fmsConfig.mongodb.port, {auto_reconnect: true, native_parser: true})
  , sessionDb = new Db(fmsConfig.mongodb.db, server_config, {})
//
  , mongo = require('mongoskin')
  // , fmsDb = mongo.db(fmsConfig.mongodb.host + ':' + fmsConfig.mongodb.port + '/' + fmsConfig.mongodb.db + '?auto_reconnect')
 // 
  , routes = require('./routes')
//  , logins = require('./routes/login')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

global.fmsDb = mongo.db(fmsConfig.mongodb.host + ':' + fmsConfig.mongodb.port + '/' + fmsConfig.mongodb.db + '?auto_reconnect');

var app = express();



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());

  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'easyfms',
    store: new mongoStore({db: sessionDb, collection: 'user_sessions'})
  }));

  app.use(express.methodOverride());
  // app.use(express.csrf());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/login',  routes.login);
app.post('/login', routes.loginP);
app.post('/logout', routes.logoutP);
app.get('/home', routes.home);
app.get('/vmd', routes.vmd);
app.get('/maptracking', routes.maptracking);
app.get('/speedexception', routes.speedexception);
//app.get('/logout', logins.logout);
app.get('/server_processing', routes.server_processing);
app.get('/geofence',routes.geofence_editor);

app.get('/ReportService',routes.report_service);

app.get('/GasReport', routes.gasreport);
app.get('/GasClient', routes.gasclient);
app.get('/gas_processing', routes.gas_processing);

var server = http.createServer(app);

//===========================================================
var io = require('socket.io').listen(server);
var GM = require('./modules/gas-manager');

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');

    socket.emit('gasdata', 'data1', 'data2');

    socket.on('gasdata', function (data) {
      console.log(data);
      GM.addNewData(data, function(e,o) {

      });
    });
});
//===============================================================

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


