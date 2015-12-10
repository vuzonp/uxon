module.exports = function(grunt) {

  grunt.initConfig({

    csslint: {
      options: {
        'known-properties': false, // SVG properties.
      },
      src: ['./*.css'],
    },

    cssmin: {
      options: {
        roundingPrecision: 5,
        sourceMap: true,
      },
      target: {
        files: {
          'makeup.min.css': ['makeup.css'],
        },
      },
    },

    jscs: {
      src: './core.js',
      options: {
        config: '.jscsrc',
        fix: true,
      },
    },

    jshint: {
      options: {
        browser: true,
        curly: true,
        forin: true,
        freeze: true,
        latedef: true,
        strict: true,
        unused: true,
      },
      all: ['core.js'],
    },

    lintspaces: {
      all: {
        src: ['./core.js', './makeup.css'],
        options: {
          newline: true,
          trailingspaces: true,
          indentation: 'spaces',
          spaces: 2,
          showTypes: true,
        },
      },
    },

    uglify: {
      all: {
        options: {
          footer: '\n',
          sourceMap: true,
        },
        files: {
          'core.min.js': ['core.js'],
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-lintspaces');

  // Default task(s).
  grunt.registerTask('lint', ['csslint', 'jshint', 'jscs', 'lintspaces']);
  grunt.registerTask('minify', ['uglify', 'cssmin']);
  grunt.registerTask('default', ['lint', 'minify']);

};
