'use strict';
module.exports = function (directory, config) {

    /* jshint camelcase:false */
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'main-bower-files']
    });
    var wrench = require('wrench');
    var defaultConfig = require('./gulp.config')(projectDir);
    var _ = require('lodash');

    var paths = _.assign({}, defaultConfig, config);

    /** Iterate over each of the gulp modules so we can break logic up into modules */
    wrench.readdirSyncRecursive(defaultConfig.gulpFolder).filter(function (file) {
        return (/\.(js|coffee)$/i).test(file);
    }).map(function (file) {
        require(defaultConfig.gulpFolder + '/' + file)(projectDir, paths);
    });

// Update bower, component, npm at once:
    gulp.task('bump', function () {
        gulp.src(['./bower.json', './package.json'])
            .pipe($.bump())
            .pipe(gulp.dest('./'));
    });

////////////////

}