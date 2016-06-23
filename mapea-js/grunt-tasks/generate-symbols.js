var async = require('async');
var path = require('path');

var Utils = require('./utilities/task-utilities');
var generateSymbols = require('./utilities/generate-symbols');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

var isWindows = process.platform.indexOf('win') === 0;

module.exports = function (grunt) {

   grunt.registerMultiTask('generate-symbols', 'use jsdoc to create the symbols file', function () {
      var done = this.async();

		
      var jsdoc = this.data.jsdoc;
      var files = this.data.files;

      var generateFile = function (index, callback) {
         // base case
         if (files.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var file = files[index];
			if(isWindows)
			{
				generateSymbols(file.output, jsdoc, file.dir, function (err) {
                     if (err != null) {
                        grunt.log.error(err);
                     }
                     // next
                     generateFile(index + 1, callback);
                  });
			}
			else{
            Utils.getJSFiles(file.dir, function (err, jsfiles) {
				
               if (err != null) {
                  grunt.log.error(err);
               }
               else {

                  generateSymbols(file.output, jsdoc, jsfiles, function (err) {
                     if (err != null) {
                        grunt.log.error(err);
                     }
                     // next
                     generateFile(index + 1, callback);
                  });
               }
            });
		   }
         }
      };
      generateFile(0, function (err) {
         if (err != null) {
            grunt.log.error(err);
            grunt.log.error('Symbols generation failed');
         }
         else {
            grunt.log.ok('Symbols generation succeed');
         }
         done();
         return;
      });
   });
};
