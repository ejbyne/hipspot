module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // configure plugins
    jasmine: {
      src: ['public/js/mapController.js', 'public/js/placesFinder.js', 'public/js/tweetsFinder.js'],
      options: {
        specs: 'spec/frontEnd/*Spec.js',
        vendor: 'public/vendor/foundation/jquery.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'package.json', 'public/js/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['spec/models/*Spec.js']
      }
     },
    watch: {
      files: ['./server.js', './public/**', './test/**/*.js', './spec/**/*.js'],
      tasks: ['express:test', 'mocha_casperjs', 'env:test', 'execute', 'mochaTest', 'jshint', 'jasmine']
    },
    express: {
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    mocha_casperjs: {
      options: {
      },
      files: {
        src: ['test/features/*.js']
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
    },
    execute: {
      target: {
        src: ['./test/apiTests/tweetSearch.js']
      }
    }
  });

  // load plugins
  [
  'grunt-jasmine-node',
  'grunt-contrib-jshint',
  'grunt-contrib-watch',
  'grunt-contrib-jasmine',
  'grunt-mocha-test',
  'grunt-mocha-casperjs',
  'grunt-env',
  'grunt-execute',
  'grunt-express-server'
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  // grunt.registerTask('default', ['env:test', 'express:test', 'execute', 'mochaTest', 'jshint', 'jasmine', 'mocha_casperjs']);
  grunt.registerTask('default', ['jshint', 'jasmine']);
};
