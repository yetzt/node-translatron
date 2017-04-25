#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var cheerio = require("cheerio");
var debug = require("debug")("translatron");

module.exports = function translatron(src, opts, fn){

	// ensure instance
	if (!(this instanceof translatron)) return new translatron(src, opts, fn);

	var self = this;

	// optionalize opts
	if (typeof opts === "function") var fn = opts, opts = {};

	// check parameters
	var fn = (fn && typeof fn === "function") ? fn : function(){};
	if (!src || typeof src !== "string") return fn(new Error("invalid source")), self;

	self.opts = opts || {};

	src = path.resolve(src);

	// load source file
	fs.readFile(src, function(err, html){
		if (err) return fn(err);
					
		// determine which languages to use
		if (self.opts.langs && self.opts.langs instanceof Array && self.opts.langs.length > 0) {
			self.langs = self.opts.langs;
		} else if (self.opts.langs && typeof self.opts.langs === "string") {
			self.langs = self.opts.langs.split(/[^A-Za-z0-9\_]+/g).filter(function(l){
				return (typeof l === "string"  && l !== "");
			}).map(function(l){
				return l.toLowerCase();
			});
		} else {

			try {
				var $ = cheerio.load(html, {decodeEntities: false, normalizeWhitespace: true });
			} catch (err) {
				return fn(err);
			}
		
			// determine languages by looking at html.lang
			if ($("html[lang]").length === 1) {
				self.langs = $("html[lang]").attr("lang").split(/[^A-Za-z0-9\_]+/g).filter(function(l){
					return (typeof l === "string"  && l !== "");
				});
			// evaluating all tags to determine languages
			} else {
				self.langs = $("[l]").map(function(){
					return $(this).attr("l").toLowerCase()
				}).get().reduce(function(p,c){
					if (p.indexOf(c) < 0) p.push(c);
					return p;
				},[]);
			}
			
		}
		
		debug("found %d languages: %j", self.langs.length, self.langs);
		
		// shortcut for no languages
		if (self.langs.length === 0) return fn(null, {});
		
		try {
			self.result = self.langs.reduce(function(p,l){
			
				var $ = cheerio.load(html, { decodeEntities: false });

				// remove other languages and l attributes
				$('[l]').replaceWith(function(){
					var $t = $(this);
					if ($t.attr("l") !== l) return "";
					$t.attr("l",null);
					return $.html($t);
				});

				// remove lang tags
				$('lang').replaceWith(function(){
					return $(this).html();
				});
			
				// set html lang attribute
				$('html').attr('lang', l);
			
				p[l] = $.html();
		
				return p;
			},{});
		} catch (err) {
			return fn(err);
		}
		
		return fn(null, self.result);
		
	});

	return this;
};
