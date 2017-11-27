/*
   wrapper function (all of the Grunt code must
   be specified inside this function)
*/
var renamePluginsFn = require('./grunt-tasks/utilities/rename-plugins');
module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // resolve dependencies
    bower: {
      core: {
        options: {
          targetDir: 'libraries/',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanup: true,
          bowerOptions: {}
        }
      },
      plugins: {
        options: {
          targetDir: 'libraries/',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanup: true,
          bowerOptions: {}
        }
      }
    },

    // checks jshint before and after the concatination
    jshint: {
      core: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          'src': [
            'src/facade/**/*.js',
            'src/impl/**/*.js'
          ]
        }
      },
      plugins: {
        options: {
          jshintrc: 'src/plugins/.jshintrc'
        },
        files: {
          'src': [
            'src/plugins/**/*.js'
          ]
        }
      },
      tasks: {
        options: {
          jshintrc: 'grunt-tasks/.jshintrc'
        },
        files: {
          'src': [
            'grunt-tasks/*.js',
            'grunt-tasks/utilities/*.js'
          ]
        }
      }
    },

    // add js documentation
    jsdoc: {
      src: 'src/facade/**/*.js',
      options: {
        destination: 'doc',
        template: "node_modules/ink-docstrap/template",
        // configure: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
        configure: "jsdoc.conf.json"
      }
    },

    mkdir: {
      default: {
        options: {
          mode: 0700,
          create: [
                  'build/core/assets/fonts',
                  'build/core/assets/css',
                  'build/core/assets/img',
                  'build/core/js',
                  'build/plugins',
                  'build/templates'
               ]
        }
      }
    },

    // removes the closure test files
    clean: {
      build: [
            'build/core/',
            'build/plugins/',
            'build/templates/',
            'externs',
            'grunt-tasks/utilities/symbols',
            'grunt-tasks/utilities/exports'
         ],
      dev: [
            'test/browser/mapea-<%= pkg.version %>.deps.js'
        ],
      'plugins-css': [
            "build/plugins/*.css",
            "build/plugins/**/*.css",
            "!build/plugins/**/*.min.css"
         ],
      tasks: [
               'grunt-tasks/utilities/exports/plugins/*.js',
               'grunt-tasks/utilities/exports/*.js',
               'grunt-tasks/utilities/symbols/plugins/*.json',
               'grunt-tasks/utilities/symbols/*.json',
               'src/externs/mapea-olx.js'
            ]
    },

    cssmin: {
      core: {
        files: [
               // { // leaflet
               //    'build/core/<%= pkg.version %>/assets/css/mapea.l.min.css': [
               //       'src/facade/assets/css/**.css',
               //       'src/impl/leaflet/assets/css/**/*.css'
               //    ]
               // },*/
          { // ol3
            'build/core/assets/css/mapea-<%= pkg.version %>.ol.min.css': [
                     'src/facade/assets/css/**/*.css',
                     'src/impl/ol/assets/css/**/*.css',
                     'libraries/ol3-popup/**/*.css'
                  ]
               }
            ]
      },
      plugins: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src/plugins',
          src: ['**/*.css', '!*.min.css'],
          dest: 'build/plugins/',
          ext: '.min.css'
            }]
      }
    },

    copy: {
      configuration: {
        files: [{
          expand: true,
          cwd: 'src',
          src: 'configuration.js',
          dest: 'build/core/js/',
          flatten: false,
          encoding: 'utf-8'
        }, {
          expand: true,
          cwd: 'src',
          src: 'configuration.js',
          dest: 'build/core/js/',
          flatten: false,
          encoding: 'utf-8',
          rename: function(version, dest, src) {
            console.log('version ' + version + ' dest ' + dest + ' src ' + src);
            return dest.concat('configuration-' + version + '.js')
          }.bind(this, '<%= pkg.version %>')
        }]
      },
      core: {
        files: [{
          expand: true,
          cwd: 'build/core/js',
          src: 'mapea-<%= pkg.version %>.ol.min.js',
          dest: 'build/core/js/',
          encoding: 'utf-8',
          rename: function(dest, source) {
            return dest.concat('mapea.ol.min.js');
          }
        }, {
          expand: true,
          cwd: 'build/core/assets/css',
          src: 'mapea-<%= pkg.version %>.ol.min.css',
          dest: 'build/core/assets/css/',
          encoding: 'utf-8',
          rename: function(dest, source) {
            return dest.concat('mapea.ol.min.css');
          }
        }]
      },
      plugins: {
        files: [{ // css
          expand: true,
          cwd: 'src/plugins',
          src: '**/*.css',
          dest: 'build/plugins/',
          flatten: true,
          encoding: 'utf-8'
        }, { // json
          expand: true,
          cwd: 'src/plugins',
          src: '**/*.json',
          dest: 'build/plugins/',
          flatten: false,
          encoding: 'utf-8'
        }]
      },
      pluginsDist: {
        files: [{
          expand: true,
          cwd: 'build/plugins',
          src: '**/*.min.js',
          dest: 'build/plugins/',
          encoding: 'utf-8',
          flatten: false,
          rename: renamePluginsFn.bind(this, 'min.js')
        }, {
          expand: true,
          cwd: 'build/plugins',
          src: '**/*.min.css',
          dest: 'build/plugins/',
          encoding: 'utf-8',
          flatten: false,
          rename: renamePluginsFn.bind(this, 'min.css')
        }]
      },
      assets: {
        files: [{ // fonts
          expand: true,
          cwd: 'src',
          src: '**/assets/fonts/*.*',
          dest: 'build/core/assets/fonts/',
          flatten: true,
          encoding: 'utf-8'
            }, { // facade img
          expand: true,
          cwd: 'src',
          src: 'facade/assets/img/*.*',
          dest: 'build/core/assets/img/',
          flatten: true
            }, { // impl img
          expand: true,
          cwd: 'src',
          src: 'impl/assets/img/*.*',
          dest: 'build/core/assets/img/',
          flatten: true
            }]
      },
      templates: {
        files: [{
          expand: true,
          cwd: 'src/templates',
          src: '*.html',
          dest: 'build/templates/',
          flatten: true,
          encoding: 'utf-8'
            }, {
          expand: true,
          cwd: 'src/plugins',
          src: '**/templates/*.html',
          dest: 'build/templates/',
          flatten: true,
          encoding: 'utf-8'
        }]
      }
    },

    'closure-libraries-wrapper': {
      build: {
        libs: [{ // handlebars
            file: 'libraries/handlebars/handlebars.js',
            provideDirective: "goog.provide('M.Handlebars');"
          }, { // ol3-popup
            file: 'libraries/ol3-popup/ol3-popup.js',
            provideDirective: "goog.provide('ol.Overlay.Popup');"
          }
          /*, { // proj4
                      file: 'libraries/proj4/proj4.js',
                      provideDirective: "goog.provide('M.proj4');"
                    }*/
               // { // leaflet
               //    file: 'libraries/leaflet/leaflet-src.js',
               //    provideDirective: "goog.provide('M.Leaflet');"
               // }
          ]
      }
    },

    'install-libraries': {
      build: {
        outputDir: 'externs',
        impls: [{
          id: 'ol',
          dir: 'libraries/ol'
            }]
      }
    },

    'generate-symbols': {
      build: {
        jsdoc: {
          path: 'node_modules/.bin/jsdoc',
          config: 'grunt-tasks/utilities/jsdoc/info/conf.json'
        },
        files: [{ // mapea-ol3
            dir: [
                     'src/facade/js',
                     'src/impl/ol/js',
                     'libraries/handlebars',
                     'libraries/proj4',
                     'libraries/ol/src',
                     'libraries/ol/externs'
                  ],
            output: 'grunt-tasks/utilities/symbols/mapea-ol.json'
               },
               // { // mapea-leaflet
               //    dir: [
               //       'src/facade/js',
               //       'src/impl/leaflet/js',
               //       'libraries/handlebars',
               //       'libraries/proj4',
               //       'libraries/leaflet'
               //    ],
               //    output: 'grunt-tasks/utilities/symbols/mapea-leaflet.json'
               // }
            ]
      }
    },

    'generate-exports': {
      build: {
        files: [{ // mapea-ol3
            symbolsFile: 'grunt-tasks/utilities/symbols/mapea-ol.json',
            output: 'grunt-tasks/utilities/exports/mapea-ol.js'
               },
               // { // mapea-leaflet
               //    symbolsFile: 'grunt-tasks/utilities/symbols/mapea-leaflet.json',
               //    output: 'grunt-tasks/utilities/exports/mapea-leaflet.js'
               // }
            ]
      }
    },

    'generate-externs': {
      build: {
        files: [{ // mapea-ol3
            symbolsFile: 'grunt-tasks/utilities/symbols/mapea-ol.json',
            output: 'src/externs/mapea-olx.js'
               },
               // { // mapea-leaflet
               //    symbolsFile: 'grunt-tasks/utilities/symbols/mapea-leaflet.json',
               //    output: 'src/externs/mapea-leafletx.js'
               // }
            ]
      }
    },

    'compile-core': {
      build: {
        files: [{ // mapea-ol3
            closureDepsOpts: {
              lib: [
                        'src/facade/js/**/*.js',
                        'src/impl/ol/js/**/*.js',
                        'libraries/handlebars/**/*.js',
                        'libraries/proj4/**/*.js',
                        'libraries/ol/src/**/*.js',
                        'externs/ol/*.js'
                     ]
            },
            closureComplileOpts: {
              compile: {
                externs: [
                           "src/externs/proj4x.js",
                           "src/externs/handlebarsx.js",
                           "src/externs/chromax.js",
                           "src/externs/mapea-olx.js",
                           "src/externs/mx.js",
                           "libraries/ol/externs/bingmaps.js",
                           "libraries/ol/externs/bootstrap.js",
                           "libraries/ol/externs/cartodb.js",
                           "libraries/ol/externs/closure-compiler.js",
                           "libraries/ol/externs/esrijson.js",
                           "libraries/ol/externs/example.js",
                           "libraries/ol/externs/geojson.js",
                           "libraries/ol/externs/jquery-1.9.js",
                           "libraries/ol/externs/oli.js",
                           "libraries/ol/externs/olx.js",
                           "libraries/ol/externs/proj4js.js",
                           "libraries/ol/externs/tilejson.js",
                           "libraries/ol/externs/topojson.js"
                        ],
                define: [
                           "goog.array.ASSUME_NATIVE_FUNCTIONS=true",
                           "goog.dom.ASSUME_STANDARDS_MODE=true",
                           "goog.json.USE_NATIVE_JSON=true",
                           "goog.DEBUG=false",
                           "ol.DEBUG=false"
                        ],
                jscomp_error: [
                           "accessControls",
                           "ambiguousFunctionDecl",
                           "checkEventfulObjectDisposal",
                           "checkRegExp",
                           "checkTypes",
                           "const",
                           "constantProperty",
                           "deprecated",
                           "duplicateMessage",
                           "es3",
                           "es5Strict",
                           "fileoverviewTags",
                           "globalThis",
                           "internetExplorerChecks",
                           "invalidCasts",
                           "misplacedTypeAnnotation",
                           "missingGetCssName",
                           "missingProperties",
                           "missingProvide",
                           "missingRequire",
                           "missingReturn",
                           "newCheckTypes",
                           "nonStandardJsDocs",
                           "suspiciousCode",
                           "strictModuleDepCheck",
                           "typeInvalidation",
                           "undefinedNames",
                           "undefinedVars",
                           "unknownDefines",
                           "visibility"
                        ],
                jscomp_off: [
                           "checkVars",
                           "externsValidation",
                           "accessControls",
                           "missingProperties",
                           "missingProvide",
                           "missingRequire",
                           "newCheckTypes",
                           "nonStandardJsDocs",
                           "suspiciousCode",
                           "undefinedNames",
                           "undefinedVars",
                           "unknownDefines",
                           "checkTypes",
                           "const",
                           "uselessCode"
                        ],
                // create_source_map: 'build/core/<%= pkg.version %>/js/mapea.ol.min.js.map',
                // source_map_location_mapping: __dirname + '|/mapea/debug',
                language_in: "ECMASCRIPT6",
                language_out: "ECMASCRIPT5",
                extra_annotation_name: ["api", "observable"],
                compilation_level: "ADVANCED",
                warning_level: "QUIET",
                use_types_for_optimization: true,
                manage_closure_dependencies: true,
                js: ["grunt-tasks/utilities/exports/mapea-ol.js"],
                output_wrapper: "(function (root, factory) { root.M = factory(); } (this, function () { %output% return M; }));",
              }
            },
            output: 'build/core/js/mapea-<%= pkg.version %>.ol.min.js'
               }
            ]
      }
    },

    concat: {
      core: {
        src: [
               'node_modules/jsts/dist/jsts.min.js',
               'libraries/chroma-js/js/chroma.min.js',
               'libraries/proj4/proj4.js',
               'build/core/js/mapea-<%= pkg.version %>.ol.min.js'
            ],
        dest: 'build/core/js/mapea-<%= pkg.version %>.ol.min.js',
      },
      plugins: {
        src: [
         'libraries/draggabilly/js/draggabilly.pkgd.min.js',
         'build/plugins/attributetable/attributetable.ol.min.js'
       ],
        dest: 'build/plugins/attributetable/attributetable.ol.min.js',
      }
    },

    'generate-symbols-plugins': {
      build: {
        jsdoc: {
          path: 'node_modules/.bin/jsdoc',
          config: 'grunt-tasks/utilities/jsdoc/info/conf.json'
        },
        dir: 'src/plugins',
        outputDir: 'grunt-tasks/utilities/symbols/plugins'
      }
    },

    'generate-exports-plugins': {
      build: {
        dir: 'grunt-tasks/utilities/symbols/plugins',
        outputDir: 'grunt-tasks/utilities/exports/plugins'
      }
    },

    'compile-plugins': {
      build: {
        dir: 'src/plugins',
        exportsDir: 'grunt-tasks/utilities/exports/plugins',
        outputDir: 'build/plugins/',
        version: '<%= pkg.version %>',
        closureComplileOpts: {
          compile: {
            externs: [
                     'src/externs/plugins.js'
                  ],
            define: [
                     "goog.array.ASSUME_NATIVE_FUNCTIONS=true",
                     "goog.dom.ASSUME_STANDARDS_MODE=true",
                     "goog.json.USE_NATIVE_JSON=true",
                     "goog.DEBUG=false",
                     "ol.DEBUG=false"
                  ],
            jscomp_error: [
                     "accessControls",
                     "ambiguousFunctionDecl",
                     "checkRegExp",
                     "checkTypes",
                     "checkVars",
                     "const",
                     "constantProperty",
                     "deprecated",
                     "duplicateMessage",
                     "es3",
                     "es5Strict",
                     "fileoverviewTags",
                     "globalThis",
                     "internetExplorerChecks",
                     "invalidCasts",
                     "misplacedTypeAnnotation",
                     "missingGetCssName",
                     "missingProperties",
                     "missingProvide",
                     "missingRequire",
                     "missingReturn",
                     "newCheckTypes",
                     "nonStandardJsDocs",
                     "suspiciousCode",
                     "typeInvalidation",
                     "undefinedNames",
                     "undefinedVars",
                     "unknownDefines",
                     "visibility"
                  ],
            jscomp_off: [
                     "checkVars",
                     "es3",
                     "missingRequire",
                     "externsValidation",
                     "accessControls",
                     "violatedModuleDep",
                     "missingProperties",
                     "missingProvide",
                     "missingRequire",
                     "newCheckTypes",
                     "nonStandardJsDocs",
                     "suspiciousCode",
                     "strictModuleDepCheck",
                     "undefinedNames",
                     "undefinedVars",
                     "unknownDefines",
                     "checkTypes",
                     "const",
                     "uselessCode"
                  ],
            extra_annotation_name: ["api", "observable"],
            language_in: "ECMASCRIPT6",
            language_out: "ECMASCRIPT5",
            compilation_level: "SIMPLE",
            warning_level: "QUIET",
            use_types_for_optimization: true,
            manage_closure_dependencies: true,
            export_local_property_definitions: true,
            generate_exports: true,
            js: [],
            output_wrapper: "(function (M) { %output% })(window.M);"
          }
        }
      }
    },

    'closure-dependencies': { //JGL: es necesario el deps en el build?
      core: {
        impl: [{ // ol3
            closurePath: 'libraries/closure/',
            deps: [{ // source
              path: 'src/facade/js',
              prefix: '../mapea/facade/js'
                  }, { // ol3 impl
              path: 'src/impl/ol/js',
              prefix: '../mapea/impl/ol/js'
                  }, { // ol3 sources
              path: 'libraries/ol/src/ol',
              prefix: '../ol/js'
                  }, { // ol3 externs
              path: 'externs/ol',
              prefix: '../externs/ol'
                  }, { // ol3-popup
              path: 'libraries/ol3-popup',
              prefix: '../'
                  }, { // handlebars
              path: 'libraries/handlebars',
              prefix: '../'
            }, {
              //chromajs
              path: 'libraries/chroma-js',
              prefix: '../'
            }, { // proj4js
              path: 'libraries/proj4',
              prefix: '../'
            }, { // plugins
              path: 'src/plugins',
              prefix: '../mapea/plugins'
                  }],
            outputFile: 'build/core/js/mapea-<%= pkg.version %>.ol.deps.js'
               },
               // { // leaflet
               //    closurePath: 'libraries/closure/',
               //    deps: [{ // source
               //       path: 'src/facade/js',
               //       prefix: '../mapea/facade/js'
               //    }, { // ol3 impl
               //       path: 'src/impl/leaflet/js',
               //       prefix: '../mapea/impl/leaflet/js'
               //    }, { // handlebars
               //       path: 'libraries/handlebars',
               //       prefix: '../'
               //    }, { // proj4js
               //       path: 'libraries/proj4',
               //       prefix: '../'
               //    }, { // plugins
               //       path: 'src/plugins',
               //       prefix: '../mapea/plugins'
               //    }],
               //    outputFile: 'build/core/<%= pkg.version %>/js/mapea.l.deps.js'
               // }
            ]
      },
      dev: {
        impl: [{ // leaflet
          closurePath: 'libraries/closure/',
          deps: [{ // source
            path: 'src/facade/js',
            prefix: '../../../../src/facade/js'
               }, { // source externs
            path: 'src/externs',
            prefix: '../../../../src/externs'
               }, { // lf impl
            path: 'src/impl/leaflet/js',
            prefix: '../../../../src/impl/leaflet/js'
               }, { // handlebars
            path: 'libraries/handlebars',
            prefix: '../../../handlebars'
               }, { // proj4js
            path: 'libraries/proj4',
            prefix: '../../../proj4'
          }, { // chromajs
            path: 'libraries/chroma-js',
            prefix: '../../../chroma-js'
               }, { // leaflet src
            path: 'libraries/leaflet',
            prefix: '../../../../libraries/leaflet'
               }, { // plugins
            path: 'src/plugins',
            prefix: '../../../../src/plugins'
               }],
          outputFile: 'test/mapea.l.deps.js'
            }, { // ol3
          closurePath: 'libraries/closure/',
          deps: [{ // source
            path: 'src/facade/js',
            prefix: '../../../../src/facade/js'
               }, { // source externs
            path: 'src/externs',
            prefix: '../../../../src/externs'
               }, { // ol3 impl
            path: 'src/impl/ol/js',
            prefix: '../../../../src/impl/ol/js'
               }, { // ol3-popup
            path: 'libraries/ol3-popup',
            prefix: '../../../ol3-popup'
               }, { // handlebars
            path: 'libraries/handlebars',
            prefix: '../../../handlebars'
               }, { // proj4js
            path: 'libraries/proj4',
            prefix: '../../../proj4'
          }, { // ol3 externs
            path: 'externs/ol',
            prefix: '../../../../externs/ol'
               }, { // ol3 src
            path: 'libraries/ol/src/ol',
            prefix: '../../../../libraries/ol/src/ol'
               }, { // plugins
            path: 'src/plugins',
            prefix: '../../../../src/plugins'
               }],
          outputFile: 'test/mapea.ol.deps.js'
            }]
      }
    },
    mocha_phantomjs: {
      all: ['test/api/**/*.html']
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // debug task
  // grunt.loadNpmTasks('grunt-debug-task');

  // load custom tasks
  grunt.loadTasks('./grunt-tasks');

  grunt.registerTask('clean-target', ['clean:build', 'mkdir']);
  grunt.registerTask('css-core', ['copy:assets', 'cssmin:core']);
  grunt.registerTask('js-core', ['bower:core', 'jshint:core', 'jsdoc', 'closure-libraries-wrapper', 'install-libraries', 'generate-symbols', 'generate-exports', 'generate-externs', 'compile-core', 'concat:core', 'copy:configuration', 'copy:core']);
  grunt.registerTask('css-plugins', ['copy:plugins', 'cssmin:plugins']);
  grunt.registerTask('js-plugins', ['jshint:plugins', 'generate-symbols-plugins', 'generate-exports-plugins', 'compile-plugins', 'clean:plugins-css', 'copy:pluginsDist', 'concat:plugins']);
  grunt.registerTask('templates', ['copy:templates']);
  grunt.registerTask('dependencies-core', ['closure-dependencies:core']);

  // tasks
  grunt.registerTask('build', ['clean-target', 'css-core', 'js-core', 'css-plugins', 'js-plugins', 'templates', 'dependencies-core' /*, 'test'*/ , 'clean:tasks']);
  grunt.registerTask('test', ['mocha_phantomjs']);
  grunt.registerTask('dev', ['clean:dev', 'closure-dependencies:dev']);

  grunt.registerTask('plugins', ['clean-target', 'bower:plugins', 'css-plugins', 'js-plugins']);

  // only debug
  //grunt.registerTask('js-build', ['generate-symbols', 'generate-exports', 'generate-externs', 'compile-core', 'concat', 'copy:configuration']);
  grunt.registerTask('js-build', ['generate-symbols', 'generate-exports', 'generate-externs', 'compile-core', 'copy:configuration']);
};
