'use strict';

var log = require('gulp-util').log;

module.exports = function (projectDir, projectConfig) {

    /* jshint camelcase:false */
    var gulp = require('gulp');
    var wrench = require('wrench');
    var _ = require('lodash');

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
