#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = 'checks.json';
var URL_DEFAULT = 'http://protected-beach-2673.herokuapp.com/';


var checkUrl = function( url )
{
	if( url.length == 0 )
	{
		console.log("Url is empty." );
	}
}

var download = function(url)
{
	checkUrl(url);
	restler.get(url).on('complete', function(myherokuhtml) {
		return myherokuhtml;
	});
}


var assertFileExists = function(infile) {
	var instr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting. ", instr);
		process.exit(1);
	}

	return instr;
}

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(htmlfile);
}

var loadChecks =function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
}

var checkHtmlFile = function( htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	console.log(checks);
	var out = {};
	for (var ii in checks) {
		var present = checks[ii].length >0;
		out[checks[ii]] = present;
	}

	return out;
}

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --url <html_file>', 'Path to index.html' )

        .parse(process.argv);
   var checkJson = checkHtmlFile(download(program.url), program.checks);
   var outJson = JSON.stringify(checkJson, null, 4);
   fs.writeFileSync("output.txt", outJson);
   console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}