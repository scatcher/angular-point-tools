'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function (projectDir, paths) {
    function listFiles(callback) {

        var vendorjs = [
            paths.cdnjs,
            paths.vendorjs,
            paths.modules
        ];

        var sortOutput = require(paths.tmpDir + paths.tsSortOutputName);

        /** Use all JS files except the main module because we need to use ngMock instead of ngMockE2E */
        gulp.src([paths.serverDir + '**/*.js', '!' + paths.serverDir + '**/*.module.js'])
            .pipe($.order(sortOutput, {base: paths.server}),{read: false})
            .pipe(concat(function (files) {

                callback(_.flattenDeep(vendorjs
                    .concat(paths.modules)
                    .concat(paths.devjs)
                    .concat(paths.mocks)
                    .concat(_.pluck(files, 'path'))
                    .concat(paths.specs)));
            }));
    }

    function runTests(singleRun, done, options) {
        listFiles(function (files) {
            karma.server.start(_.extend({}, {
                configFile: projectDir + 'karma.conf.js',
                files: files,
                singleRun: singleRun,
                autoWatch: !singleRun
            }, options), done);
        });
    }

    gulp.task('test', function (done) {
    //gulp.task('test', ['inject-dev'], function (done) {
        runTests(true, done);
    });
    gulp.task('test:auto', ['watch'], function (done) {
        runTests(false, done);
    });
    gulp.task('test:debug', ['watch'], function (done) {
        runTests(false, done, {browsers:['Chrome']});
    });
};
