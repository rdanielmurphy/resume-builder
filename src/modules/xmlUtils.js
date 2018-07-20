const Promises = require("bluebird");
const cheerio = require('cheerio');
const _ = require('lodash');

module.exports = {
	getInnerHTML: function() {

	},
	getAllAttributes: function(node) {
		let attributes = {};

		_.forEach(node.attribs, (value, name) => {
			attributes[name] = value
		});

		return attributes;
	},
	replaceVars: function(text, data) {
		let newString = text;

		if (text && text.length > 0 && text.includes("${")) {
			if (data) {
				let results = searchForStateVars(text.trim());
				for (let value of results) {
					var key = value.substring(2, value.length - 1);
					newString = newString.split(value).join(data[key]);
				}
			}
		} else {
			newString = text;
		}

		return newString;
	}

}
