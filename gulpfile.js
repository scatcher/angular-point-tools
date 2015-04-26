'use strict';

var log = require('gulp-util').log;
var gulp = require('gulp');
var wrench = require('wrench');
var _ = require('lodash');
var typescript = require('gulp-typescript');

gulp.task('dts', function () {
    var ts = gulp.src('./ts/*.ts')
        .pipe(typescript({declarationFiles: true}));

    return ts.dts.pipe(gulp.dest('./interfaces'));
});

module.exports = function (projectDir, projectConfig) {


    /* jshint camelcase:false */

    var apToolsDir = __dirname + '/';

    /** Get default paths based on current directory */
    var defaultConfig = require('./gulp.config')(apToolsDir, projectDir, projectConfig);

    /** Allow overrides to be passed in */
    var paths = _.assign({}, defaultConfig, projectConfig);

    /** Iterate over each of the gulp modules so we can break logic up into smaller chunks */
    wrench.readdirSyncRecursive(defaultConfig.gulpFolder).filter(function (file) {
        return (/\.(js|coffee)$/i).test(file);
    }).map(function (file) {
        require(defaultConfig.gulpFolder + '/' + file)(projectDir, paths);
    });




////////////////

};
