const endpoint = "resume";
const fileUtils = require('../shared/fileUtils');

const resumeDir = __dirname + ".\\..\\..\\resume"
console.log(resumeDir);

module.exports = function (app, prefix) {
	app.get('/' + prefix + '/' + endpoint + '/sample', (req, res) => {
		fileUtils.getResumeFiles(resumeDir).then((data) => {
			res.send({
				"template": data[1],
				"data": data[0]
			});
		}).catch((error) => {
			throw new Error("Could not log sample files: " + error); // Express will catch this on its own.
		});
	});
}

