const Promises = require("bluebird");
const cheerio = require('cheerio');
const _ = require('lodash');

const getAllAttributes = function(node) {
	let attributes = {};

	_.forEach(node.attribs, (value, name) => {
		attributes[name] = value
	});

	return attributes;
}

function extractSubDataItems(html) {
	let dataSubItems = [];
	const $ = cheerio.load(html);

	$('*').find('data-subitem').each(function(i, elm) {
		let dataSubItem = {
			'attributes': getAllAttributes($(elm)[0]),
			'text': $(elm).text()
		};
		dataSubItems.push(dataSubItem);
	});

	return dataSubItems;
}

function extractDataItems(html) {
	let dataItems = [];
	const $ = cheerio.load(html);

	$('*').find('data-item').each(function(i, elm) {
		let dataItem = {
			'attributes': getAllAttributes($(elm)[0]),
			'subitems': extractSubDataItems($(elm).html())
		};
		dataItems.push(dataItem);
	});

	return dataItems;
}

function compileData(data) {
	const $ = cheerio.load(data);
	let compiledData = {};

	// Get state vars
	$('resume-data').find('data:not(:has(*))').each(function(i, elm) {
		compiledData[$(elm).attr('id')] = $(elm).text().trim();
	});

	// Get data-items
	$('resume-data').find('data:has(*)').each(function(i, elm) {
		compiledData[$(elm).attr('id')] = extractDataItems($(elm).html());
	});

	console.log(compiledData);

	return compiledData;
}

function searchForStateVars(val) {
	var results = [];

	var regEx = new RegExp('(\\$\\{[\\w\\(\\)]*\\})', 'g');
	var response = regEx.exec(val);

	while (response) {
		results.push(response[0]);
		response = regEx.exec(val);
	}

	return results;
}

function replaceVars(html, data) {
	const $ = cheerio.load(html);

	$('#resume-root').find('*').contents().filter(function() {
		return this.nodeType == 3 || this.nodeType == 1;
	}).each(function(i, elm) {
		let text = $(elm).text();
		let newString = text;

		if (text && text.length > 0 && text.includes("${")) {
			let results = searchForStateVars(text.trim());
			for (let value of results) {
				var key = value.substring(2, value.length - 1);
				newString = newString.split(value).join(data[key]);
			}
		}
		$(elm).text(newString);
	});

	return $.html();
}

function replaceDataItems(html, data) {
	return html;
}

function compileHtml(data, html) {
	let compiledHTML = '<div id="resume-root">' + html + '</div>';
	let compiledData = compileData(data);

	compiledHTML = replaceVars(compiledHTML, compiledData);
	compiledHTML = replaceDataItems(compiledHTML, compiledData);

	return compiledHTML;
}

function getResumeFiles(dir) {
	var readFile = Promises.promisify(require("fs").readFile);

	var promises = [];
	promises.push(readFile(dir + '/data.xml', "utf8"));
	promises.push(readFile(dir + '/template.html', "utf8"));

	return new Promise((resolve, reject) => {
		Promise.all(promises).then(function(data) {
				resolve(data);
			})
			.catch(function(e) {
				reject(e);
			});
	});
}

module.exports = function(resumeDir) {
	return new Promise((resolve, reject) => {
		getResumeFiles(resumeDir).then((data) => {
			try {
				let html = compileHtml(data[0], data[1]);
				resolve(html);
			} catch (error) {
				reject('Could not compile resume: ' + error.message);
			}
		}).catch((error) => {
			reject(error);
		});
	});
}
