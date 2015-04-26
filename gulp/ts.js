'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var tsd = require('tsd');
var log = require('gulp-util').log;
var typescript = require('gulp-typescript')

module.exports = function(projectDir, paths) {
    var tsdApi = new tsd.getAPI(paths.tsdJson);

    gulp.task('ts', function() {
        return gulp.src(paths.tsFiles)
            .pipe(sourcemaps.init())
            //.pipe(tslint())
            //.pipe(tslint.report('prose', { emitError: false }))
            .pipe(typescript({sortOutput: true, declarationFiles:true}))
            .pipe(sourcemaps.write())
            .pipe($.toJson({filename: paths.tmpDir + paths.tsSortOutputName, relative:true}))
            .pipe(gulp.dest(paths.serverDir))
            .pipe($.size());
    });

    gulp.task('inject-ts', ['clean-server', 'ts'], function() {
        var sortOutput = require(paths.tmpDir + paths.tsSortOutputName);

        var tempScripts = gulp.src([paths.serverDir + '**/*.js'])
            //.pipe($.angularFilesort());
            .pipe($.order(sortOutput, {base: paths.server}),{read: false});

        return gulp.src(paths.appDir + 'index.html')
            .pipe($.inject(tempScripts, {name: 'inject-ts', addRootSlash: false}))
            .pipe(gulp.dest(paths.app));
    });

    gulp.task('clean-server', function () {
        var del = require('del');
        return del([paths.server]);
    });


    gulp.task('tsd:install', function () {
        var bower = paths.bower.json;

        var dependencies = [].concat(
            Object.keys(bower.dependencies),
            Object.keys(bower.devDependencies)
        );

        var query = new tsd.Query();
        dependencies.forEach(function (dependency) {
            query.addNamePattern(dependency);
        });

        var options = new tsd.Options();
        options.resolveDependencies = true;
        options.overwriteFiles = true;
        options.saveBundle = true;

        return tsdApi.readConfig()
            .then(function () {
                return tsdApi.select(query, options);
            })
            .then(function (selection) {
                return tsdApi.install(selection, options);
            })
            .then(function (installResult) {
                var written = Object.keys(installResult.written.dict);
                var removed = Object.keys(installResult.removed.dict);
                var skipped = Object.keys(installResult.skipped.dict);

                written.forEach(function (dts) {
                    $.util.log('Definition file written: ' + dts);
                });

                removed.forEach(function (dts) {
                    $.util.log('Definition file removed: ' + dts);
                });

                skipped.forEach(function (dts) {
                    $.util.log('Definition file skipped: ' + dts);
                });
            });
    });

    gulp.task('tsd:purge', function () {
        return tsdApi.purge(true, true);
    });

    gulp.task('tsd', ['tsd:install']);

    /**
     * Generates the app.d.ts references file dynamically from all application *.ts files.
     * TODO This currently breaks order so don't use
     */

    /**
     * Generates the app.d.ts references file dynamically from all application *.ts files.
     */
    gulp.task('gen-ts-refs', function () {
        var target = gulp.src(paths.appTypeScriptReferences);
        var sources = gulp.src([paths.tsFiles], {read: false});
        return target.pipe($.inject(sources, {
            starttag: '//{',
            endtag: '//}',
            transform: function (filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
        })).pipe(gulp.dest(paths.typings));
    });
};
