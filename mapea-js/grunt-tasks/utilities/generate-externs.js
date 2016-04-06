var path = require('path');
var temp = require('temp').track();
var fs = require('fs-extra');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

var NAMESPACES = [];

/**
 * Export generate function.
 */
module.exports = function (infoFile, outputFile, callback) {
   NAMESPACES = [];

   var outputFilePath = path.join(ROOT, outputFile);
   var requireInfoPath = './../../'.concat(infoFile);
   var symbols = require(requireInfoPath).symbols;
   var matches = filterSymbols(["*"], symbols);

   console.log('      · Writing extern file: ' + outputFile);
   writeHeader(outputFilePath);
   for (var i = 0, ilen = matches.length; i < ilen; i++) {
      var symbol = matches[i];
      writeSymbol(outputFilePath, symbol);
   }
   callback(null);
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


function writeHeader(outputFilePath) {
   fs.outputFileSync(outputFilePath, "/**\n * @externs\n */\n\n");
}

function writeSymbol(outputFilePath, symbol) {
   // writes name
   var name = symbol.name;
   if (name.indexOf('#') != -1) {
      name = name.replace(/\#/g, '.');
   }
   writeNamespace(outputFilePath, name);

   // writes provides
   var provides = symbol.provides;
   for (var i = 0, ilen = provides.length; i < ilen; i++) {
      var provide = provides[i];
      writeNamespace(outputFilePath, provide);
   }
}

function writeNamespace(outputFilePath, namespace) {
   var names = namespace.split(/\./);

   // gets root
   var root = names[0]; //.concat('extern');
   root += 'x'; // M --> Mx to avoid conflicts
   if (NAMESPACES.indexOf(root) === -1) {
      writeRoot(outputFilePath, root);
   }

   // set the root
   names[0] = root;
   namespace = names.join('.');

   // add to the extern file
   if (NAMESPACES.indexOf(namespace) === -1) {
      writeNewNamespace(outputFilePath, namespace);
   }
}

function writeRoot(outputFilePath, root) {
   fs.appendFileSync(outputFilePath, "\n/**\n * @type {Object}\n */\n");
   fs.appendFileSync(outputFilePath, "var ");
   fs.appendFileSync(outputFilePath, root);
   fs.appendFileSync(outputFilePath, ";\n");
   NAMESPACES.push(root);
};

function writeNewNamespace(outputFilePath, namespace) {
   fs.appendFileSync(outputFilePath, "\n/**\n * @type {Object}\n");
   fs.appendFileSync(outputFilePath, " * @api stable\n");
   fs.appendFileSync(outputFilePath, " */\n");
   fs.appendFileSync(outputFilePath, namespace);
   fs.appendFileSync(outputFilePath, ";\n");
   NAMESPACES.push(namespace);
}