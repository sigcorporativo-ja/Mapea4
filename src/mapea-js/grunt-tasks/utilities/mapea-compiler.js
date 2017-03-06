var path = require('path');
var Promise = require('promise');
var closure = require('closure-util');

var Utils = require('./task-utilities');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

/**
 * Export main function.
 */
module.exports = function (closureDepsOpts, closureComplileOpts, outputFile, callback) {
   closureDepsOpts.cwd = ROOT;
   closureComplileOpts.cwd = ROOT;
   closure.getDependencies(closureDepsOpts, function (err, dependencies) {
      if (err != null) {
         callback(err);
      }
      else {
         closureComplileOpts.compile.js = dependencies.concat(closureComplileOpts.compile.js);
         closure.compile(closureComplileOpts, function (err, code) {
            if (err != null) {
               callback(err);
            }
            else {
               // applies the replaces
               if (closureComplileOpts.replacements != null) {
                  for (var i = 0, ilen = closureComplileOpts.replacements.length; i < ilen; i++) {
                     var replacement = closureComplileOpts.replacements[i];
                     code = code.replace(replacement.regexp, replacement.value);
                  }
               }
               var writeFilePromise = Utils.writeFile(outputFile, code);
               writeFilePromise.catch(function (err) {
                  callback(err);
               });
               writeFilePromise.then(function () {
                  callback(null);
               });
            }
         });
      }
   });
};