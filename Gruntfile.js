module.exports = function(grunt) {

    grunt.initConfig({

        cssmin: {
            options: {
                roundingPrecision: 5,
                sourceMap: true
            },
            target: {
                files: {
                    "makeup.min.css": ["makeup.css"]
                }
            }
        },

        jshint: {
            options: {
                browser: true,
                curly: true,
                forin: true,
                freeze: true,
                latedef: true,
                strict: true,
                unused: true
            },
            all: ["core.js"]
        },

        uglify: {
            all: {
                options: {
                    sourceMap: true
                },
                files: {
                    "core.min.js": ["core.js"]
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task(s).
    grunt.registerTask("default", ["cssmin", "jshint", "uglify"]);

};
