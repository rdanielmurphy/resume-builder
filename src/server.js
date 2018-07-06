var http = require('http');
var filebuilder = require('./modules/filebuilder');
var constants = require('./constants');

console.log("listening on port 8082...");

filebuilder.generateFiles([constants.PDF, constants.HTML, constants.DOCX]);

//create a server object:
http.createServer(function(req, res) {
	console.log('Create server');
	filebuilder.generateFiles([constants.PDF, constants.HTML, constants.DOCX]);
	res.write('Hello World! im very kewl.  version = ' + filebuilder.version()); //write a response to the client
	res.end(); //end the response
}).listen(8082); //the server object listens on port 8080
