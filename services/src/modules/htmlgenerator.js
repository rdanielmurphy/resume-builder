const _ = require('lodash');
const xmlUtils = require('../shared/xmlUtils');
const fileUtils = require('../shared/fileUtils');
const util = require('util');
const xml2js = require('xml2js');
const Builder = new xml2js.Builder();

const xml2jsParser = new xml2js.Parser({
	'explicitChildren' : true,
	'preserveChildrenOrder' : true
});

function compileDataSubItemNode(node, compiledData) {
	_.forEach(node, function (value, key) {
		compiledData.push(value);//xmlUtils.getAllAttributes(value);
		//compiledData['content'] = xmlUtils.getInnerHTML(value);
	});
}

function compileDataItemNode(node, compiledData) {
	_.forEach(node, function (value, key) {
		compiledData[key] = xmlUtils.getAllAttributes(value);
		if (value['data-subitem']) {
			compiledData[key]['subItems'] = [];
			compileDataSubItemNode(value['data-subitem'], compiledData[key]['subItems']);
		}
	});
}

function compileDataNode(node, compiledData) {
	_.forEach(node, function (value, key) {
		if (value['data-item']) {
			compiledData[value['$'].id] = {};
			compileDataItemNode(value['data-item'], compiledData[value['$'].id]);
		} else {
			compiledData[value['$'].id] = xmlUtils.trim(value['_']);
		}
	});

	return compiledData;
}

function compileData(data) {
	return compileDataNode(data['resume-data']['data'], {});
}

function compileDataItemTemplate(node, data) {
	let dataItemsKey = '';
	let dataItemsIterator = '';
	let dataItemsTemplate = '';
	let dataItemsTemplateTag = '';
	let dataItemsTemplateInnerHTML = '';

	console.log("data item node", node);

	_.forEach(node, function (value, key) {
		if (key === '$') {
			dataItemsKey = value['data-items'];
			dataItemsIterator = value['item'];
		}
		else {
			dataItemsTemplateTag = key;
			dataItemsTemplateInnerHTML = value;
			dataItemsTemplate = {};
			dataItemsTemplate[key] = dataItemsTemplateInnerHTML;
		}
	});

	// console.log("dataItemsKey", dataItemsKey);
	// console.log("dataItemsIterator", dataItemsIterator);
	// console.log("dataItemsTemplateTag", dataItemsTemplateTag);
	// console.log("dataItemsTemplateInnerHTML", dataItemsTemplateInnerHTML);
	// console.log("dataItemsTemplate", dataItemsTemplate);

	// TODO: different paths for single line templates vs multiline templates?
	let newNodes = [];
	let dataSubset = xmlUtils.getDataFromPath(dataItemsKey, data);
	_.forEach(dataSubset, function (value, key) {
		let clonedNode = JSON.parse(JSON.stringify(dataItemsTemplate));
		let newData = {};
		newData[dataItemsIterator] = dataSubset[key];
		//console.log("BEFORE", util.inspect(clonedNode, false, null));
		let newNode = compileTemplate(clonedNode, newData);
		//console.log("AFTER", util.inspect(newNode, false, null));
		if (dataItemsTemplateTag === 'li' && newNodes[0]) {
			newNodes[0][dataItemsTemplateTag].push(newNode[dataItemsTemplateTag][0]);
		} else {
			newNodes.push(newNode);
		}
	});

	if (dataItemsTemplateTag === 'li') {
		node[dataItemsTemplateTag] = newNodes[0][dataItemsTemplateTag];
	} else {
		node[dataItemsTemplateTag] = newNodes;
	}
}

function compileTemplate(node, data) {
	if (xmlUtils.hasDataItems(node)) {
		compileDataItemTemplate(node, data);
	}
	else {
		_.forEach(node, function (value, key) {
			if (util.isArray(value) || util.isObject(value)) {
				compileTemplate(value, data);
			} else {
				value = xmlUtils.replaceVars(value, data);
				node[key] = value;
			}
		});
	}

	return node;
}

function replaceDataItems(json, data) {
	return json;
}

function compileHtml(html, data) {
	let compiledHTML = '<div id="resume-root">' + html + '</div>';

	return new Promise((resolve, reject) => {
		xml2jsParser.parseString(data, function (dataErr, dataResult) {
			if (dataErr) {
				reject("Error parsing data!" + dataErr);
			}

			let compiledData = compileData(dataResult);
			//console.log("data: ", compiledData);
			xml2js.parseString(compiledHTML, function (templateErr, templateResult) {
				if (templateErr) {
					reject("Error parsing template!" + templateErr);
				}

				let compiledJsonTemplate = compileTemplate(templateResult, compiledData);
				compiledHTML = Builder.buildObject(compiledJsonTemplate);

				resolve(compiledHTML);
			});
		});
	});
}

module.exports = function (template, data) {
	return new Promise((resolve, reject) => {
		//		fileUtils.getResumeFiles(resumeDir).then((data) => {
		try {
			compileHtml(template, data).then((html) => {
				console.log(html);
				resolve(html);
			}).catch((error1) => {
				reject(error1);
			});
		} catch (error2) {
			reject('Could not compile resume: ' + error2.message);
		}
	}).catch((error3) => {
		reject(error3);
	});
	//	});
}
