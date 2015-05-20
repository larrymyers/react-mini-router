var gulp = require('gulp'),
    del = require('del'),
    changed = require('gulp-changed'),
    reactTransform = require('gulp-react'),
    source = require('vinyl-source-stream'),
    nodemon = require('gulp-nodemon');

gulp.task('clean', function(done) {
    del([
        'app/components/*.js',
        'public/js/app.js'
    ], done);
});

gulp.task('react', function() {
    return gulp.src('./app/components/*.jsx')
        .pipe(changed('./app/components/', { extension: '.js' }))
        .pipe(reactTransform())
        .pipe(gulp.dest('./app/components/'));
});

gulp.task('watch', function() {
    gulp.watch(['app/components/**/*.jsx'], ['react'])
        .on('change', function(event) {
            console.log('React Transform: ' + event.path + ' (' + event.type + ')');
        });
});

gulp.task('serve', ['react', 'watch'], function() {
    nodemon({
        script: 'server.js',
        watch: ['app']
    });
});
