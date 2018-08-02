const endpoint = "resume";
const fileUtils = require('../shared/fileUtils');
const filebuilder = require('./../modules/filebuilder');
const constants = require('./../constants');
const resumeDir = __dirname + ".\\..\\..\\resume";
const path = require('path');
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

		console.log("template", template);
		console.log("data", data);

		filebuilder.generateFiles([constants.PDF, constants.HTML, constants.DOCX]).then(function (result) {
			var file = __dirname + '/upload-folder/dramaticpenguin.MOV';

			var filename = path.basename(file);
			var mimetype = mime.lookup(file);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);

			var filestream = fs.createReadStream(file);
			filestream.pipe(res);
		}, function (err) {
			throw new Error("Could not generate resume: " + err); // Express will catch this on its own.
		});
	});
}

