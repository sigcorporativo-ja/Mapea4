var fse = require('fs-extra');

module.exports = function (grunt) {

   grunt.registerMultiTask('closure-libraries-wrapper', '"closurize" external libs (add closure directive to them)', function () {
      var done = this.async();

      var index = 0;
      var externalLibs = this.data.libs;
      adaptExternalLib(externalLibs, index, function () {
         grunt.log.ok('external libs adapted');
         done();
         return;
      });
   });

   function adaptExternalLib(libs, index, callback) {
      if (index === libs.length) { // base case
         callback();
      }
      else { // recursive case
         var file = libs[index].file;
         var provideDirective = libs[index].provideDirective;
         fse.readFile(file, 'utf8', function (err, data) {
            var fileContent = provideDirective.concat("\n\n").concat(data);
            fse.outputFile(file, fileContent, function (err) {
               // recursive call
               adaptExternalLib(libs, ++index, callback);
            });
         });
      }
   }
};