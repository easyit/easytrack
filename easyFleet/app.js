
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
//app.get('/logout', logins.logout);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
