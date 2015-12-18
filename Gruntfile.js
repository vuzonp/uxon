module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '/* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> - <%= pkg.name %> v.<%= pkg.version %> - License: <%= pkg.license %> */',
          linebreak: true,
          replace: true,
        },
        files: {
          src: ['src/*.js', 'src/*.css'],
        },
      },
    },

    csslint: {
      options: {
        'known-properties': false, // SVG properties.
      },
      src: ['src/makeup.css'],
    },

    cssmin: {
      options: {
        comments: 0,
        roundingPrecision: 5,
        sourceMap: true,
      },
      target: {
        files: {
          'src/makeup.min.css': ['src/makeup.css'],
        },
      },
    },

    jscs: {
      src: 'src/core.js',
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
      all: ['src/core.js'],
    },

    lintspaces: {
      all: {
        src: ['src/core.js', 'src/makeup.css'],
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
          sourceMap: true,
        },
        files: {
          'src/core.min.js': ['src/core.js'],
        },
      },
    },

    'http-server': {
      all: {
        cache: 15,
        host: "0.0.0.0",
        port: 8080,
        showDir: true,
        autoIndex: true,
        runInBackground: false,
        openBrowser: true,
      },
    },

  });

  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-lintspaces');

  // Default task(s).
  grunt.registerTask('local', ['http-server']);
  grunt.registerTask('lint', ['csslint', 'jshint', 'jscs', 'lintspaces']);
  grunt.registerTask('minify', ['uglify', 'cssmin', 'usebanner']);
  grunt.registerTask('default', ['lint', 'minify']);

};
