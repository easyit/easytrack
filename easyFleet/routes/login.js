var helper = require('./helper');

/*
 *Get Login
 */
exports.login = function(req, res){
	console.log('Serving request for url [GET] ' + req.route.path);

	if (req.session.uid) {
		res.redirect('/dashboard');
	} else {
		// countlyDb.collection('members').count({}, function(err, memberCount){
		// 	if (memberCount) {
		// 		res.render('login', { "message": req.flash('info'), "csrf": req.session._csrf });
		// 	} else {
		// 		res.redirect('/setup');
		// 	}
		// });
		res.render('login', { error: false, "csrf": req.session._csrf });
	}
};

/*
 *Get Logout
 */
exports.logout = function(req, res){
    console.log('Serving request for url [GET] ' + req.route.path);
    
    if (req.session) {
	    req.session.uid = null;
		req.session.gadm = null;
	    res.clearCookie('uid');
		res.clearCookie('gadm');
	    req.session.destroy(function() {});
	}

	res.redirect('/login');
};


exports.loginP =  function(req, res) {

	 console.log('Serving request for url [POST] ' + req.route.path);

	if (req.body.username && req.body.password) {

		console.log( req.body.username);
		console.log( req.body.password);

		// var password = helper.sha1Hash(req.body.password);
		var password = req.body.password;
	
		fmsDb.collection('Users').findOne({"username": req.body.username, "password": password}, function(err, member){
			if (member) {
				req.session.uid = member["_id"];
				req.session.gadm = (member["admin"] == true);
				res.redirect('/dashboard');
			} else {
				res.render('login', { error: true, "message": "Invalid user or password", "csrf": req.session._csrf });
			}
		});
	} else {
		res.render('login', { error: true, "message": "Account freezed", "csrf": req.session._csrf });
		res.end();
	}
};