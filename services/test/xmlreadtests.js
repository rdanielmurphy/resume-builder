var expect = require("chai").expect;
var xmlutils = require("../src/modules/xmlUtils");
var cheerio = require("cheerio");

describe("Getting Inner HTML", function () {
	it("gets the inner html", function () {
		expect(xmlutils.getInnerHTML()).to.equal("");
	});
});
describe("Getting all attributes", function () {
	it("gets the attributes", function () {
		const $ = cheerio.load('<ul id="fruits" a="34"></ul>');
		expect(xmlutils.getAllAttributes($("#fruits"))).to.deep.equal({'id' : 'fruits', 'a' : '34'});
	});
	it("does not get the child attributes", function () {
		let html = '<ul id="fruits" a="34"><li foo="bar"></li></ul>'
		const $ = cheerio.load(html);
		expect(xmlutils.getAllAttributes($("#fruits"))).to.deep.equal({'id' : 'fruits', 'a' : '34'});
	});
});
describe("Replace vars", function () {
	it("replaces vars with data", function () {
		const text = "This is a <b>${adj}</b> Job";

		expect(xmlutils.replaceVars(text,{ 'adj' : 'cool' })).to.deep.equal("This is a <b>cool</b> Job");
		expect(xmlutils.replaceVars(text,{ 'adj' : '' })).to.deep.equal("This is a <b>${adj}</b> Job");
		expect(xmlutils.replaceVars(text,{ 'adj2' : 'cool' })).to.deep.equal("This is a <b>${adj}</b> Job");
	});
});

