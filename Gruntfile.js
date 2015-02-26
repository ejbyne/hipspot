module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
      files: ['server.js', 'public/js/*.js', 'test/**/*.js', 'spec/**/*.js'],
      tasks: ['env:test', 'express:test', 'execute', 'mochaTest', 'jshint', 'jasmine', 'mocha_casperjs']
    },
    mocha_casperjs: {
      options: {
      },
      files: {
        src: ['test/features/*.js']
      }
    },
    express: {
      options: {
        port: 4000
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    execute: {
      target: {
        src: ['test/apiTests/tweetSearch.js']
      }
    }
  });

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

  grunt.registerTask('default', ['env:test', 'express:test', 'execute', 'mochaTest', 'jshint', 'jasmine', 'mocha_casperjs']);

};
