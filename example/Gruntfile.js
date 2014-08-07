module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    watchedExtensions: ['js'],
                    watchedFolders: ['app/server']
                }
            }
        },

        react: {
            server: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/components',
                        src: ['**/*.jsx'],
                        dest: 'app/components',
                        ext: '.js'
                    }
                ]
            }
        },

        browserify: {
            app: {
                src: 'app/main.js',
                dest: 'public/js/app.js',
                options: {
                    bundleOptions: { debug: true }
                }
            }
        },

        clean: ['dist', '.tmp', 'public/js/app.js', 'app/components/*.js']
    });

    grunt.registerTask('serve', [
        'react:server',
        'browserify',
        'nodemon:dev'
    ]);
};