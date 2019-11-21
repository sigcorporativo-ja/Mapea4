/**
 * Expose entry point loader for Webpack 4
 * @function
 */
function exposeEntryLoader(content, map, meta) {
  if (/.*\/test\/development.*/.test(this.resourcePath) === true) {
    const parsedContent = content.replace(/const /g, 'window.');
    this.callback(null, parsedContent, false, meta);
  } else {
    this.callback(null, content, false, meta);
  }
  return 0;
}

module.exports = exposeEntryLoader;
