var constants = require('../constants');

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
	} catch(e) {
		console.log("Error building HTML " + e);
	}
}

