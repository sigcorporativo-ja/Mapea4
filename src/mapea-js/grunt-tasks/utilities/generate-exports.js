var path = require('path');
var temp = require('temp').track();
var fs = require('fs-extra');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

/**
 * Export generate function.
 */
module.exports = function (infoFile, outputFile, callback) {
   var requireInfoPath = './../../'.concat(infoFile);
   var symbols = require(requireInfoPath).symbols;

   var matches = filterSymbols(["*"], symbols);
   var exportsContent = generateExports(matches);

   console.log('      · Writing export file: ' + outputFile);
   writeExports(outputFile, exportsContent, callback);
};

function writeExports(outputFile, exportsContent, callback) {
   var outputFilePath = path.join(ROOT, outputFile);
   fs.outputFile(outputFilePath, exportsContent, function (err) {
      if (err) {
         callback(err);
         return;
      }
      else {
         callback(null);
      }
   });
};

/**
 * Generate a list of symbol names given a list of patterns.  Patterns may
 * include a * wildcard at the end of the string, in which case all symbol names
 * that start with the preceding string will be matched (e.g 'foo.Bar#*' will
 * match all symbol names that start with 'foo.Bar#').
 *
 * @param {Array.<string>} patterns A list of symbol names to match.  Wildcards
 *     at the end of a string will match multiple names.
 * @param {Array.<Object>} symbols List of symbols.
 * @param {function(Error, Array.<Object>)} callback Called with the filtered
 *     list of symbols (or any error).
 */
function filterSymbols(patterns, symbols) {
   var matches = [];

   var lookup = {};
   symbols.forEach(function (symbol) {
      lookup[symbol.name] = symbol;
   });

   patterns.forEach(function (name) {
      var match = false;
      var pattern = (name.substr(-1) === '*');
      if (pattern) {
         name = name.substr(0, name.length - 1);
         symbols.forEach(function (symbol) {
            if (symbol.name.indexOf(name) === 0) {
               matches.push(symbol);
               match = true;
            }
         });
      }
      else {
         var symbol = lookup[name];
         if (symbol) {
            matches.push(symbol);
            match = true;
         }
      }
      if (!match) {
         var message = 'No matching symbol found: ' + name + (pattern ? '*' : '');
         throw new Error(message);
      }
   });

   return matches;
}


/**
 * Generate export code given a list symbol names.
 * @param {Array.<Object>} symbols List of symbols.
 * @param {string|undefined} namespace Target object for exported symbols.
 * @return {string} Export code.
 */
function generateExports(symbols, namespace) {
   var blocks = [];
   var requires = {};
   symbols.forEach(function (symbol) {
      symbol.provides.forEach(function (provide) {
         requires[provide] = true;
      });
      var name = symbol.name;
      if (name.indexOf('#') > 0) {
         blocks.push(formatPropertyExport(name));
      }
      else {
         blocks.push(formatSymbolExport(name, namespace));
      }
   });
   blocks.unshift('\n');
   Object.keys(requires).sort().reverse().forEach(function (name) {
      blocks.unshift('goog.require(\'' + name + '\');');
   });
   blocks.unshift(
      '/**\n' +
      ' * @fileoverview Custom exports file.\n' +
      ' * @suppress {checkVars}\n' +
      ' */\n');
   return blocks.join('\n');
}

/**
 * Generate goog code to export a named symbol.
 * @param {string} name Symbol name.
 * @param {string|undefined} namespace Target object for exported
 *     symbols.
 * @return {string} Export code.
 */
function formatSymbolExport(name, namespace) {
   return 'goog.exportSymbol(\n' +
      '    \'' + name + '\',\n' +
      '    ' + name +
      (namespace ? ',\n    ' + namespace : '') + ');\n';
}


/**
 * Generate goog code to export a property.
 * @param {string} name Property long name (e.g. foo.Bar#baz).
 * @return {string} Export code.
 */
function formatPropertyExport(name) {
   var parts = name.split('#');
   var prototype = parts[0] + '.prototype';
   var property = parts[1];
   return 'goog.exportProperty(\n' +
      '    ' + prototype + ',\n' +
      '    \'' + property + '\',\n' +
      '    ' + prototype + '.' + property + ');\n';
}