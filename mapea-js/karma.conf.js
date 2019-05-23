const path = require('path');

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    browserDisconnectTolerance: 2,
    client: {
      runInParent: true,
      mocha: {
        timeout: 2500,
      },
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [{
      pattern: path.resolve(__dirname, require.resolve('expect.js/index.js')),
      watched: false,
    }, {
      pattern: path.resolve(__dirname, 'test', 'api', 'unit_test', 'index.html'),
      watched: false,
      type: 'dom',
    }, {
      pattern: path.resolve(__dirname, 'dist', 'js', 'mapea-5.1.0.ol.min.js'),
      watched: false,
    }, {
      pattern: path.resolve(__dirname, 'dist', 'assets', 'css', 'mapea-5.1.0.ol.min.css'),
      watched: false,
    }, {
      pattern: path.resolve(__dirname, 'test', 'configuration_filtered.js'),
      watched: false,
    }, {
      pattern: path.resolve(__dirname, 'test', 'api', 'index_test.js'),
      watched: false,
    }],

    // list of files / patterns to exclude
    exclude: [
      '**/*.test.js',
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.js': ['webpack'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging. Possible values:
    // config.LOG_DISABLE
    // config.LOG_ERROR
    // config.LOG_WARN
    // config.LOG_INFO
    // config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    webpack: {
      mode: 'production',
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
