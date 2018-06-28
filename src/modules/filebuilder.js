var constants = require('../constants');
var pandoc = require('node-pandoc');

function retrieveHTML() {
	return "<h1>TEST</h1>";
}

function createHtmlResume() {
	console.log("built html resume");
}

function createPdfResume() {
	console.log("built pdf resume");
}

function createDocxResume() {
	console.log("built docx resume");
}

module.exports.version = function() {
	return "1.3.2";
}

module.exports.generateFiles = function(types) {
	var html = "";

	const args = '-f html -t docx -o word.docx';

	try {
		html = retrieveHTML();

		types.forEach(type => {
			if (type === constants.PDF)
				createPdfResume(html);
			else if (type === constants.DOCX)
				createDocxResume(html);
			else if (type === constants.HTML)
				createHtmlResume(html);
			else 
				console.log("Invalid document type: " + type);
		});

		// Set your callback function
		let callback = function (err, result) {
			if (err) console.error('Oh Nos: ',err);
			 // Without the -o arg, the converted value will be returned.
			 return console.log(result), result;
		};

		// Call pandoc
		pandoc(html, args, callback);

	} catch(e) {
		console.log("Error building HTML " + e);
	}
}

