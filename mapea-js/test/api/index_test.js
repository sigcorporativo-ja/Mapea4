// require all modules ending in ".test.js" from the
// current directory and all subdirectories
const testsContext = require.context('./unit_test', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
