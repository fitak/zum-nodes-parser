var cheerio = require('cheerio');
var fs = require('fs');


var Parser = function(file_name, options) {
  this.file_name = file_name;
  this.options = options;

  this.dom_ = null;
}

Parser.prototype.getEdgesQueries_ = function() {
  if(!this.dom_) {
    throw new Error('XML DOM is not loaded');
  }

  var queries = [];
  var self = this;
  var counter = 0;

  this.dom_('nodes node edge').each(function(index, node) {
    queries.push('INSERT INTO `edge` (`id`, `from_id`, `to_id`) VALUES ('+(++counter)+', '+this.attr('fromid')+', '+this.attr('toid')+');');
  });

  return queries;
}

Parser.prototype.getNodesQueries_ = function() {
  if(!this.dom_) {
    throw new Error('XML DOM is not loaded');
  }

  var queries = [];
  var self = this;

  this.dom_('nodes node').each(function(index, node) {
    queries.push('INSERT INTO `node` (`id`) VALUES ('+this.attr('id')+');');
  });

  return queries;
}

Parser.prototype.parse = function() {
  var file = fs.readFileSync(this.file_name, {
    encoding: 'ascii'
  });

  this.dom_ = cheerio.load(file, {
    xmlMode: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true
  });  

  var nodes_queries = this.getNodesQueries_() || [];
  var edges_queries = this.getEdgesQueries_() || [];

  var result = '';

  result += '-- Nodes for ZUMScore --\n\n';
  result += '-- Source: '+this.file_name+'\n';
  result += '-- Generated at: '+(new Date().toUTCString())+'\n';
  result += '-- Repository: https://github.com/fitak/zum-nodes-parser.git'+'\n';
  result += '\n';

  if(this.options['foreignKeys']) {
    result += 'SET FOREIGN_KEY_CHECKS=0;\n';
  }

  if(!this.options['leaveContent']) {
    result += 'TRUNCATE edge;\n'
    result += 'TRUNCATE node;\n';  
  }

  result += '\n';

  result += '-- Generating nodes\n';
  result += nodes_queries.join('\n');
  result += '\n\n';

  result += '-- Generating edges\n';
  result += edges_queries.join('\n');

  result += '\n\n-- End of '+this.file_name+'\n';

  return result;
}

module.exports = Parser;