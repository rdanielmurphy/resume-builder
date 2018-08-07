var constants = require('../constants');
var pandoc = require('node-pandoc');
var generateHTML = require('./htmlgenerator');

function retrieveHTML(template, data) {
	return generateHTML(template, data);
}

module.exports.generateFile = function (template, data, type) {
	return new Promise(function (resolve, reject) {
		const args = '-f html -t ' + type + ' -o resume.' + type;
		retrieveHTML(template, data).then((html) => {
			// Set your callback function
			let callback = function (err, result) {
				if (err) {
					console.error('Oh Nos: ', err);
					reject(err);
				}
				console.log(result);
				// Without the -o arg, the converted value will be returned.
				return resolve('resume.' + type);
			};

			// Call pandoc
			pandoc(html, args, callback);
		}).catch((error) => {
			console.log("Error building HTML " + error);
			reject(error);
		});
	});
}
