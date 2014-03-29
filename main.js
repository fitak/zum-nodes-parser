#!/usr/bin/env node

var commander = require('commander');
var package = require('./package.json');

var Parser = require('./parser');

commander
  .version(package.version)
  .usage('[options] <file ...>')    
  .parse(process.argv);

if(commander.args.length === 0) {
  console.error('You must specify source file.');
  process.exit(1);
}

commander.args.forEach(function(file) {
  var parser = new Parser(file);
  parser.parse();  
});



