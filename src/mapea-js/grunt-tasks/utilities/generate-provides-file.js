var path = require('path');

var fs = require('fs-extra');

var PROVIDES = [];

/**
 * Export generate function.
 */
module.exports = function (providesFile, matches, callback) {
   PROVIDES = [];
   console.log('      · Generating provides file...');
   var fileStream = fs.createWriteStream(providesFile);
   fileStream.once('open', function (fd) {
      for (var i = 0, ilen = matches.length; i < ilen; i++) {
         var symbol = matches[i];
         writeProvides(fileStream, symbol);
      }
      fileStream.end();
      callback(null);
   });
};

function writeProvides(fileStream, symbol) {
   if ((symbol.stability === "stable") && (symbol.provides != null)) {
      for (var i = 0, ilen = symbol.provides.length; i < ilen; i++) {
         writeProvide(fileStream, symbol.provides[i]);
      }
   }
}

function writeProvide(fileStream, provide) {
   if (PROVIDES.indexOf(provide) === -1) {
      fileStream.write("goog.provide('");
      fileStream.write(provide);
      fileStream.write("');\n");
      PROVIDES.push(provide);
   }
}