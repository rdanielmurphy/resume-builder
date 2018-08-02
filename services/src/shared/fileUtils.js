const Promises = require("bluebird");

module.exports = {
    getResumeFiles: function (dir) {
        var readFile = Promises.promisify(require("fs").readFile);

        var promises = [];
        promises.push(readFile(dir + '/data.xml', "utf8"));
        promises.push(readFile(dir + '/template.html', "utf8"));

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(function (data) {
                resolve(data);
            }).catch(function (e) {
                reject(e);
            });
        });
    }
}