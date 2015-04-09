'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});


module.exports = function(projectDir, paths) {

    gulp.task('styles', function () {
        return gulp.src(paths.projectless)
            .pipe($.less())
            .pipe(gulp.dest(paths.lessOutput))
            .pipe($.size());
    });

    /**
     * Copy fonts
     * @return {Stream}
     */
    gulp.task('fonts', function () {
        return gulp.src($.mainBowerFiles())
            //return gulp.src(config.vendorcss)
            .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
            .pipe($.flatten())
            .pipe(gulp.dest(paths.build + 'fonts'))
            .pipe($.size());
    });

    /**
     * Compress images
     * @return {Stream}
     */
    gulp.task('images', function () {
        return gulp.src(paths.images)
            .pipe($.imagemin({
                //.pipe($.cache($.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(paths.build + 'images'))
            .pipe($.size());
    });

};
