// 'use strict'

var AM = require('../modules/account-manager');

/*
 * GET root page.
 */

exports.index = function(req, res){
	console.log('Serving request for url [GET] ' + req.route.path);

	// check if the user's credentials are saved in a cookie //
	if (req.cookies.user == undefined || req.cookies.pass == undefined){
		res.render('login', {  title: 'Hello - Please Login To Your Account' });
	}else{
	// attempt automatic login //
		AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
			if (o != null){
				req.session.user = o;
				res.redirect('/home');
			}	else{
				res.render('login',  { title: 'Hello - Please Login To Your Account' });
			}
		});
	}
};


exports.loginP = function(req, res){
	console.log( req.body.user );
	console.log( req.body.pass );

	// if (req.session.user) {
	// 	res.redirect('/home');
	// }
	
	AM.manualLogin(req.body.user, req.body.pass, function(e, o){
			if (!o){
				console.log("login error !!!!");
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
};


/*
 * GET logged-in user homepage 
 */
exports.home = function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
	}   else{
		res.render('home', {
					title : 'Home',
					udata : req.session.user} );
	}
};

/*
 * Vehicle monitoring dashboard
 */
exports.vmd = function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
	}   else{
		res.render("vmd", {
					title : 'VMD',
					udata : req.session.user} );
	}
};

/*
 * Tracking on map
 */
exports.maptracking = function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
	}   else{
		res.render("maptracking", {
					title : 'Tracking on map',
					udata : req.session.user} );
	}
};

/*
 * Post Logout from system
 */
exports.logoutP= function(req, res){

	console.log("Logout...");

	res.clearCookie('user');
	res.clearCookie('pass');
	req.session.destroy(function(e){ res.send('ok', 200); });

	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
	}   else{
		res.render('home', {
					title : 'Home',
					udata : req.session.user} );
	}
};



