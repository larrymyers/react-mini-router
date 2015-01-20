var gulp = require('gulp'),
    del = require('del'),
    changed = require('gulp-changed'),
    browserify = require('browserify'),
    watchify = require('watchify'),
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

var bundler = createDevBundler()
    .on('update', function(ids) {
        if (ids) {
            console.log('Browserify', ids);
        }

        generateDevBundle();
    })
    .on('log', function(msg) {
        console.log('Browserify: ' + msg);
    });

gulp.task('browserify', ['react'], generateDevBundle);

gulp.task('watch', function() {
    gulp.watch(['app/components/**/*.jsx'], ['react'])
        .on('change', function(event) {
            console.log('React Transform: ' + event.path + ' (' + event.type + ')');
        });
});

gulp.task('serve', ['browserify', 'watch'], function() {
    nodemon({
        script: 'server.js',
        args: ['--environment=DEV', '--port=8000'],
        watch: ['app']
    });
});

function createDevBundler() {
    var opts = watchify.args;
    opts.debug = true;

    return watchify(browserify('./app/main.js', opts));
}

function generateDevBundle() {
    return bundler.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js/'));
}
