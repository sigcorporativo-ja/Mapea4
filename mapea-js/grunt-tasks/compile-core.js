var async = require('async');
var path = require('path');

var compile = require('./utilities/mapea-compiler');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {

   grunt.registerMultiTask('compile-core', 'use closure to build the project', function () {
      var done = this.async();

      var files = this.data.files;

      var generateFile = function (index, callback) {
         // base case
         if (files.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var file = files[index];
            compile(file.closureDepsOpts, file.closureComplileOpts, file.output, function (err) {
               if (err != null) {
                  grunt.log.error(err);
               }
               // next
               generateFile(index + 1, callback);
            });
         }
      };
      generateFile(0, function (err) {
         if (err != null) {
            grunt.log.error(err);
            grunt.log.error('Compilation failed');
         }
         else {
            grunt.log.ok('Compilation succeed');
         }
         done();
         return;
      });
   });
};