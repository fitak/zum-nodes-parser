var cheerio = require('cheerio');
var fs = require('fs');


var Parser = function(file_name, options) {
  this.file_name = file_name;
  this.options = options;

  this.dom_ = null;
}

Parser.prototype.getEdgesQueries_ = function() {

}

Parser.prototype.getNodesQueries_ = function() {
  if(!this.dom_) {
    throw new Error('XML DOM is not loaded');
  }

  var queries = [];
  var self = this;

  // this.dom_('nodes').each(function(index, node) {
  //   console.log(self.dom_('edge', this).toArray());
  // });
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

  var result 
}

module.exports = Parser;