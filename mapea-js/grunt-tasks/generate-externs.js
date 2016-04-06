var async = require('async');
var path = require('path');

var generateExtern = require('./utilities/generate-externs');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {

   grunt.registerMultiTask('generate-externs', 'use closure to create the extern file', function () {
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
            generateExtern(file.symbolsFile, file.output, function (err) {
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
            grunt.log.error('Extern generation failed');
         }
         else {
            grunt.log.ok('Extern generation succeed');
         }
         done();
         return;
      });
   });
};