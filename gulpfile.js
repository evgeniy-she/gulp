var gulp = require('gulp'),
    scss = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync"),
    ugl = require('gulp-uglifycss'),
    del = require('del');


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        scss: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};



gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js:build', function () {
    return  gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css:build', function () {
    return gulp.src(path.src.scss)
        .pipe(scss().on('error', scss.logError))
        .pipe(ugl({
            'maxLineLen': 80,
            'uglyComments': true
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('img:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        tunnel: false,
        host: 'localhost',
        port: 3333
    });
});


gulp.task('clean', function() {
    return del(['build/*']);
});



gulp.task('build', gulp.series('clean', gulp.parallel('html:build', 'js:build', 'css:build','img:build', 'fonts:build')));

gulp.task('watch', function() {
    gulp.watch((path.src.scss), gulp.series('css:build'));
    gulp.watch((path.src.js), gulp.series('js:build'));
    gulp.watch((path.src.img), gulp.series('img:build'));
    gulp.watch((path.src.fonts), gulp.series('fonts:build'));
    gulp.watch((path.src.html),  gulp.series('html:build'));
});



gulp.task('default', gulp.series('clean', 'build', gulp.parallel('browserSync', 'watch')));