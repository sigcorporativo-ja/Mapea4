var async = require('async');
var path = require('path');

var generateExport = require('./utilities/generate-exports');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {

   grunt.registerMultiTask('generate-exports', 'use jsdoc to generate the export file', function () {
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
            generateExport(file.symbolsFile, file.output, function (err) {
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
            grunt.log.error('Exports generation failed');
         }
         else {
            grunt.log.ok('Exports generation succeed');
         }
         done();
         return;
      });
   });
};