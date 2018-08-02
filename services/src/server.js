const express = require('express');
const app = express();

app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded({ limit: '50mb', extended: true })); // to support URL-encoded bodies

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