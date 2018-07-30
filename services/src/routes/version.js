const endpoint = "version";

module.exports = function (app, prefix) {
	app.get('/' + prefix + '/' + endpoint, (req, res) => {
		res.send({ "version": process.env.npm_package_version });
	});
}
