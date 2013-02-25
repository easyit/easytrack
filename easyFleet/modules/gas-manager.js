//HY: fmsDb is a global variable defined in app.js


var crypto 		= require('crypto')
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var fmsConfig = require('../config')

var dbPort 		= fmsConfig.mongodb.port;
var dbHost 		= fmsConfig.mongodb.host;
var dbName 		= fmsConfig.mongodb.db;

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});
// var db = global.fmsDb;

var accounts = db.collection('gas');


/* record insertion, update & deletion methods */

exports.addNewData = function(newData, callback)
{
	accounts.insert( newData, function(e, o) {
		if (o){
			callback(e,o);
		}else{
			console.log('Insert error ' + new Data)	;
		}
	});
}



/* account lookup methods */

exports.deleteData = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getDataByMsg = function(msg, callback)
{
	accounts.findOne({msg:msg}, function(e, o){ callback(o); });
}



exports.getAllRecords = function(start, len, callback)
{
	accounts.find().limit(len).skip(start).toArray(
		function(e, res) {
		if (e) 
			callback(e)
		else 
			callback(null, res)
	});
};

exports.getRecords = function(query, start, len, callback)
{
	accounts.find(query).limit(len).skip(start).toArray(
		function(e, res) {
		if (e) 
			callback(e)
		else 
			callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}



/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
