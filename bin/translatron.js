#!/usr/bin/env node

// translatron -l <lang> <infile> <outfile>

// node modules
var fs = require("fs");
var path = require("path");

// npm modules
var minimist = require("minimist");

// local modules
var translatron = require(path.resolve(__dirname, "../lib/translatron.js"));

// argv
var argv = minimist(process.argv.slice(2));

// get parameters
var langs = ((!argv.l) ? [] : (typeof argv.l === "string") ? argv.l.toLowerCase().split(/[^0-9a-z_]+/g) : (argv.l instanceof Array) ? argv.l : []).filter(function(l){ return (l && typeof l === "string" && l !== "") });
var src = (argv._[0] && typeof argv._[0] === "string" && argv._[0] !== "") ? argv._[0] : null;
var dest = (argv._[1] && typeof argv._[1] === "string" && argv._[1] !== "") ? argv._[1] : null;

// check parameter sanity
if (src === null) console.error("No source file."), process.exit(1);
if (dest === null && langs.length !== 1) console.error("No destination file or lang"), process.exit(1);

// check for wildcard, amend
if (dest !== null && dest.indexOf("*") < 0) dest += ".*";

// get absolute paths
var src = path.resolve(process.cwd(), src);
var dest = (dest === null) ? null : path.resolve(process.cwd(), dest);

translatron(src, { langs: langs }, function(err, trans){
	if (err) console.error("No destination file or lang"), process.exit(1);
	
	if (dest === null) return process.stdout.write(trans[Object.keys(trans).shift()]);
	
	Object.keys(trans).forEach(function(l){
		fs.writeFile(dest.replace(/\*/g,l), trans[l]);
	});
	
});

