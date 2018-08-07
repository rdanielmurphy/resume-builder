const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded({ limit: '50mb', extended: true })); // to support URL-encoded bodies

// Serve static content
const dirname = path.resolve(__dirname + "./../../web/build");
const serveStatic = require('serve-static');
app.use(serveStatic(dirname, { 'index': ['index.html'] }));

console.log('dirname', dirname);

// Setup APIs
const normalizedPath = require("path").join(__dirname, "routes");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
	if (file.endsWith("js")) {
		require("./routes/" + file)(app, "api");
	}
});

// Run server
app.listen(8082, () => console.log('Example app listening on port 8082!'))
