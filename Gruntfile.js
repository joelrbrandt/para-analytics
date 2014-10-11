module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jshint : {
            options : {
                jshintrc : true
            },
            all : [
                "package.json",
                "*.js"
            ]
        },
        jscs: {
            src: "<%= jshint.all %>",
            options: {
                config: ".jscsrc"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");

    grunt.registerTask("test", ["jshint", "jscs"]);

    grunt.registerTask("default", ["test"]);

};
