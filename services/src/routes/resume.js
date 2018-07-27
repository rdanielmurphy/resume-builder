const endpoint = "resume";
//var pjson = require('./package.json');

module.exports = function(app) {
	app.get('/' + endpoint, (req, res) => {
		res.send({"version" : process.env.npm_package_version});
	});
}

