module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // configure plugins
    jasmine_node: {
      options: {
        forceExit: true,
      },
      all: ['spec/']
    },
    jshint: {
      files: ['Gruntfile.js', 'package.json', 'spec/**/*.js', 'src/**/*.js', 'test/**/*.js'],
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
    watch: {
      files: ['src/*.js', './server.js', './public/js/*.js', './spec/*.js', './test/*'],
      tasks: ['express', 'jasmine_node', 'jshint', 'mocha_casperjs']
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
        src: ['test/*.js']
      }
    }
  });

  // load plugins
  [
  'grunt-mocha-casperjs',
  'grunt-express-server',
  'grunt-jasmine-node',
  'grunt-contrib-jshint',
  'grunt-contrib-watch'
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['watch']);
};
