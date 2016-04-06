var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var async = require('async');
var fse = require('fs-extra');

var $infoPath;
var $jsdoc;
var $jsdocConfig;

/**
 * Determine if source files have been changed, run JSDoc and write updated
 * info if there are any changes.
 *
 * @param {function(Error)} callback Called when the info file has been written
 *     (or an error occurs).
 */
function main(infoFile, jsdoc, paths, callback) {
   console.log('      · Writing symbols JSON file: ' + infoFile);
   // init global vars
   $infoPath = infoFile;
   $jsdoc = jsdoc.path;
   $jsdocConfig = jsdoc.config;

   async.waterfall([
    spawnJSDoc.bind(null, paths),
    addSymbolProvides,
    writeInfo
  ], callback);
}

/**
 * Parse the JSDoc output.
 * @param {string} output JSDoc output
 * @return {Object} Symbol and define info.
 */
function parseOutput(output) {
   if (!output) {
      throw new Error('Expected JSON output');
   }

   var info;
   try {
      info = JSON.parse(String(output));
   }
   catch (err) {
      throw new Error('Failed to parse output as JSON: ' + output);
   }
   if (!Array.isArray(info.symbols)) {
      throw new Error('Expected symbols array: ' + output);
   }
   if (!Array.isArray(info.defines)) {
      throw new Error('Expected defines array: ' + output);
   }

   return info;
}

/**
 * Spawn JSDoc.
 * @param {Array.<string>} paths Paths to source files.
 * @param {function(Error, string)} callback Callback called with any error and
 *     the JSDoc output (new metadata).  If provided with an empty list of paths
 *     the callback will be called with null.
 */
function spawnJSDoc(paths, callback) {
   if (paths.length === 0) {
      process.nextTick(function () {
         callback(null, null);
      });
      return;
   }

   var output = '';
   var errors = '';
   var cwd = path.join(__dirname, '..', '..');

   var child = spawn($jsdoc, ['-c', $jsdocConfig].concat(paths), {
      cwd: cwd
   });

   child.stdout.on('data', function (data) {
      output += String(data);
   });

   child.stderr.on('data', function (data) {
      errors += String(data);
   });

   child.on('exit', function (code) {
      if (code) {
         callback(new Error(errors || 'JSDoc failed with no output'));
      }
      else {
         var info;
         try {
            info = parseOutput(output);
         }
         catch (err) {
            callback(err);
            return;
         }
         callback(null, info);
      }
   });
}

/**
 * Given the path to a source file, get the list of provides.
 * @param {string} srcPath Path to source file.
 * @param {function(Error, Array.<string>)} callback Called with a list of
 *     provides or any error.
 */
var getProvides = async.memoize(function (srcPath, callback) {
   fs.readFile(srcPath, function (err, data) {
      if (err) {
         callback(err);
         return;
      }
      var provides = [];
      var matcher = /goog\.provide\('(.*)'\)/;
      String(data).split('\n').forEach(function (line) {
         var match = line.match(matcher);
         if (match) {
            provides.push(match[1]);
         }
      });
      callback(null, provides);
   });
});


/**
 * Add provides data to new symbols.
 * @param {Object} info Symbols and defines metadata.
 * @param {function(Error, Object)} callback Updated metadata.
 */
function addSymbolProvides(info, callback) {
   if (!info) {
      process.nextTick(function () {
         callback(null, null);
      });
      return;
   }

   function addProvides(symbol, callback) {
      getProvides(symbol.path, function (err, provides) {
         if (err) {
            callback(err);
            return;
         }
         symbol.provides = provides;
         callback(null, symbol);
      });
   }

   async.map(info.symbols, addProvides, function (err, newSymbols) {
      info.symbols = newSymbols;
      callback(err, info);
   });
}


/**
 * Write symbol and define metadata to the info file.
 * @param {Object} info Symbol and define metadata.
 * @param {function(Error)} callback Callback.
 */
function writeInfo(info, callback) {
   if (info) {
      var str = JSON.stringify(info, null, '  ');
      fse.outputFile($infoPath, str, callback);
   }
   else {
      process.nextTick(function () {
         callback(null);
      });
   }
}


/**
 * If running this module directly, read the config file and call the main
 * function.
 */
if (require.main === module) {
   main(function (err) {
      if (err) {
         process.stderr.write(err.message + '\n');
         process.exit(1);
      }
      else {
         process.exit(0);
      }
   });
}


/**
 * Export main function.
 */
module.exports = main;