const endpoint = "resume";
const fileUtils = require('../shared/fileUtils');
const path = require('path');
const filebuilder = require('./../modules/filebuilder');
const constants = require('./../constants');
const resumeDir = path.resolve(__dirname + '/../../resume');
const mime = require('mime');
const fs = require('fs');

module.exports = function (app, prefix) {
	app.get('/' + prefix + '/' + endpoint + '/sample', (req, res) => {
		fileUtils.getResumeFiles(resumeDir).then((data) => {
			res.send({
				"template": data[1],
				"data": data[0]
			});
		}).catch((error) => {
			throw new Error("Could not get sample files: " + error); // Express will catch this on its own.
		});
	});
	app.post('/' + prefix + '/' + endpoint + '/generate', (req, res) => {
		const template = req.body.template;
		const data = req.body.data;
		const type = req.body.type;

		console.log("template", template);
		console.log("data", data);
		console.log("type", type);

		filebuilder.generateFile(template, data, type).then(function (result) {
			var file = result;

			var filename = path.basename(file);
			var mimetype = mime.lookup(file);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);

			res.download(file, filename);
		});
	});
}

