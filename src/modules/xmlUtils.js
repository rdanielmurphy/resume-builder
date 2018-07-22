const _ = require('lodash');
const util = require('util');

function searchForStateVars(val) {
	let results = [];

	let regEx = new RegExp('(\\$\\{[\\w\\.\\(\\)]*\\})', 'g');
	let response = regEx.exec(val);

	while (response) {
		results.push(response[0]);
		response = regEx.exec(val);
	}

	return results;
}

module.exports = {
	getInnerHTML: function () {
		return "";
	},
	trim: function (someText) {
		if (someText) {
			return someText.replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
		}

		return "";
	},
	getAllAttributes: function (node) {
		let attributes = {};

		if (util.isObject(node)) {
			if (node['$']) {
				_.forEach(node['$'], function (value, key) {
					attributes[key] = value;
				});
			}
		}

		return attributes;
	},
	replaceVars: function (text, data) {
		let newString = text;
		if (text && text.length > 0 && text.includes("${")) {
			if (data) {
				let results = searchForStateVars(text.trim());
				for (let value of results) {
					var path = value.substring(2, value.length - 1);
					var newValue = this.getDataFromPath(path, data);
					if (newValue) {
						newString = newString.split(value).join(newValue);
					}
				}
			}
		} else {
			newString = text;
		}

		return newString;
	},
	hasDataItems: function (node) {
		const attributes = this.getAllAttributes(node);
		return attributes['data-items'];
	},
	getDataFromPath: function (path, data) {
		let pathParts = path.split(".");
		let result = data;

		for (var i = 0; i < pathParts.length; i++) {
			let path = pathParts[i];
			result = result[path];
			if (!result) {
				break;
			}
		}

		return result;
	}
}
