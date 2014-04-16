'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    less: {
      default: {
        options: {
          modifyVars: {
            img: '"../images"'
          },
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'styles/base.css': [
            'normalize.css',
            'less/**/*.less',
            'jquery.fullPage.css',
            'sl-slider.css'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 9000,
          livereload: true
        }
      }
    },
    watch: {
      styles: {
        files: ['less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      options: {
        livereload: true
      },
      target: {
        files: ['index.html', 'styles/**/*.css', 'scripts/**/*.js']
      }
    }
  });
  grunt.registerTask('default', ['connect', 'watch']);
};
