var fs = require('fs');
var path = require('path');

var async = require('async');
var fse = require('fs-extra');
var browserify = require('browserify');
var derequire = require('derequire');

/**
 * Get external module metadata.
 * @return {Array.<Object>} Array of objects representing external modules.
 */
function getExternalModules(pkg, implRootDir) {
   return pkg.ext.map(function (item) {
      var modulePath;
      if (typeof item === 'string') {
         modulePath = path.join(implRootDir, 'node_modules', item);
         return {
            name: item,
            module: item,
            main: require.resolve(modulePath),
            browserify: false
         };
      }
      else {
         modulePath = path.join(implRootDir, 'node_modules', item.module);
         return {
            module: item.module,
            name: item.name !== undefined ? item.name : item.module,
            main: require.resolve(modulePath),
            browserify: item.browserify !== undefined ? item.browserify : false
         };
      }
   });
}


/**
 * Wrap a CommonJS module in Closure Library accessible code.
 * @param {Object} mod Module metadata.
 * @param {function(Error, string)} callback Called with any error and the
 *     wrapped module.
 */
function wrapModule(mod, callback) {
   var wrap = function (code) {
      return 'goog.provide(\'ol.ext.' + mod.name + '\');\n' +
         '/** @typedef {function(*)} */\n' +
         'ol.ext.' + mod.name + ';\n' +
         '(function() {\n' +
         'var exports = {};\n' +
         'var module = {exports: exports};\n' +
         'var define;\n' +
         '/**\n' +
         ' * @fileoverview\n' +
         ' * @suppress {accessControls, ambiguousFunctionDecl, ' +
         'checkDebuggerStatement, checkRegExp, checkTypes, checkVars, const, ' +
         'constantProperty, deprecated, duplicate, es5Strict, ' +
         'fileoverviewTags, missingProperties, nonStandardJsDocs, ' +
         'strictModuleDepCheck, suspiciousCode, undefinedNames, ' +
         'undefinedVars, unknownDefines, uselessCode, visibility}\n' +
         ' */\n' + code + '\n' +
         'ol.ext.' + mod.name + ' = module.exports;\n' +
         '})();\n';
   };

   if (mod.browserify) {
      var b = browserify(mod.main, {
         standalone: mod.name
      }).
      bundle(function (err, buf) {
         if (err) {
            callback(err);
            return;
         }
         callback(null, wrap(derequire(buf.toString())));
      });
   }
   else {
      fs.readFile(mod.main, function (err, data) {
         if (err) {
            callback(err);
            return;
         }
         callback(null, wrap(data.toString()));
      });
   }
}


/**
 * Build external modules.
 * @param {Array.<Object>} modules External modules.
 * @param {function(Error)} callback Called with any error.
 */
function buildModules(modules, outputDir, callback) {
   async.each(modules, function (mod, done) {
      var output = path.join(outputDir, mod.name) + '.js';
      async.waterfall([
      wrapModule.bind(null, mod),
      fse.outputFile.bind(fse, output)
    ], done);
   }, callback);
}


/**
 * Build all external modules.
 * @param {function(Error)} callback Called with any error.
 */
function main(packagejson, outputDir, implRootDir, callback) {
   var pkg = require(packagejson);
   var modules = getExternalModules(pkg, implRootDir);
   buildModules(modules, outputDir, callback);
}

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

module.exports = main;