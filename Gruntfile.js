module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // configure plugins
    jasmine: {
      src: 'public/js/app.js',
      options: {
        specs: 'spec/viewTesting.js'
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
        src: ['spec/tweets/models.js']
      }
     },
    watch: {
      files: ['./server.js', './public/**', './test/**/*.js'],
      tasks: ['env:test', 'express', 'mochaTest', 'jshint', 'mocha_casperjs', 'execute', 'jasmine']
    },
    express: {
      options: {},
      dev: {
        options: {
          script: './server.js'
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
  'grunt-mocha-casperjs',
  'grunt-express-server',
  'grunt-jasmine-node',
  'grunt-contrib-jshint',
  'grunt-contrib-watch',
  'grunt-contrib-jasmine',
  'grunt-mocha-test',
  'grunt-env',
  'grunt-execute'
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['watch']);
};
