var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;

var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {
  grunt.registerMultiTask('remove-comments', 'use closure to build the dependencies', function() {
    let compiledFiles = this.data.src;
    compiledFiles.forEach(file => {
      let data = fs.readFileSync(path.join(ROOT, file), 'utf-8');
      let sanitizeData = data.replace('//# sourceMappingURL=jsts.min.js.map', '');
      fs.writeFileSync(path.join(ROOT, file), sanitizeData, 'utf-8');
    })
  });
};
