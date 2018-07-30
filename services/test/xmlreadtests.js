const expect = require("chai").expect;
const xmlutils = require("../src/shared/xmlUtils");
const xml2js = require('xml2js');
const util = require('util');

describe("Getting Inner HTML", function () {
	it("gets the inner html", function () {
		expect(xmlutils.getInnerHTML()).to.equal("");
	});
});
describe("Getting all attributes", function () {
	it("gets the attributes", function () {
		xml2js.parseString('<ul id="fruits" a="34"></ul>', function (err, result) {
			if (err) {
				reject("Error parsing html!" + err);
			}

			expect(xmlutils.getAllAttributes(result.ul)).to.deep.equal({ 'id': 'fruits', 'a': '34' });
		});
	});
	it("does not get the child attributes", function () {
		xml2js.parseString('<ul id="fruits" a="34"><li foo="bar"></li></ul>', function (err, result) {
			if (err) {
				reject("Error parsing html!" + err);
			}

			expect(xmlutils.getAllAttributes(result.ul)).to.deep.equal({ 'id': 'fruits', 'a': '34' });
		});
	});
});
// TODO trim()
// TODO hasDataItems()
// TODO getDataFromPath()
describe("Replace vars", function () {
	it("replaces vars with data", function () {
		const text = "This is a <b>${adj}</b> Job";

		expect(xmlutils.replaceVars(text, { 'adj': 'cool' })).to.deep.equal("This is a <b>cool</b> Job");
		expect(xmlutils.replaceVars(text, { 'adj': '' })).to.deep.equal("This is a <b>${adj}</b> Job");
		expect(xmlutils.replaceVars(text, { 'adj2': 'cool' })).to.deep.equal("This is a <b>${adj}</b> Job");
	});
});

