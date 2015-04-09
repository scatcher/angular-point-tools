'use strict';
var gulp = require('gulp');
var bump = require('gulp-bump');

module.exports = function (projectDir, paths) {

// Update bower, component, npm at once:
    gulp.task('bump', function () {
        gulp.src([paths.bowerJson, paths.packageJson])
            .pipe(bump())
            .pipe(gulp.dest(projectDir));
    });

};
