const http = require('http');
const filebuilder = require('./modules/filebuilder');
const constants = require('./constants');
const express = require('express');
const app = express();

//filebuilder.generateFiles([constants.PDF, constants.HTML, constants.DOCX]);

// Serve static content
const dirname = __dirname + ".\\..\\..\\web\\build"
const serveStatic = require('serve-static');
app.use(serveStatic(dirname, { 'index': ['index.html'] }));

// Setup APIs
const normalizedPath = require("path").join(__dirname, "routes");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
	if (file.endsWith("js")) {
		require("./routes/" + file)(app, "api");
	}
});

// Run server
app.listen(8082, () => console.log('Example app listening on port 8082!'))