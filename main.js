#!/usr/bin/env node

var commander = require('commander');
var package = require('./package.json');

var Parser = require('./parser');

commander
  .version(package.version)
  .usage('[options] <file ...>')
  //.option('-p, --pedantic', 'Pedantic mode is checking for inconsistency in map', true)
  .option('-f, --foreign-keys', 'Disable foreign keys')
  .option('-l, --leave-content', 'Does not truncate tables')
  .parse(process.argv);

if(commander.args.length === 0) {
  console.error('You must specify source file.');
  process.exit(1);
}

commander.args.forEach(function(file) {
  var parser = new Parser(file, commander);
  
  process.stdout.write(parser.parse());
});



