module.exports = function (defFormat, dest, source) {
  var folderName = source.substr(0, source.indexOf('-'));
  var fileName = folderName;
  var extensionFileName = source.substr(source.indexOf('-') + 1);
  var versionMatches = extensionFileName.match(new RegExp('^(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)', 'ig'));
  if (versionMatches != null && versionMatches.length > 0) {
    fileName += extensionFileName.replace(versionMatches[0], '');
  }
  else {
    fileName += '.' + (typeof defFormat !== 'undefined' ? defFormat : 'null');
  }
  // concat(source.substr(0, source.indexOf('-'))).concat('/')
  return dest.concat(fileName);
}
