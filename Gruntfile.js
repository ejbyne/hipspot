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
    watch: {
      files: ['./server.js', './public/**', './test/**/*.js'],
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
        src: ['test/**/*.js']
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
