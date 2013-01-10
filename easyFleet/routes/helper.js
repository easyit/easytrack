var crypto = require('crypto');

exports.sha1Hash = function(str, addSalt) {
	var salt = (addSalt)? new Date().getTime() : "";
	return crypto.createHmac('sha1', salt + "").update(str + "").digest('hex');
}
