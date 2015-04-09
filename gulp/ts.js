'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var tsd = require('tsd');
var log = require('gulp-util').log;

module.exports = function(projectDir, paths) {

    log(paths.tsdJson);

    var tsdApi = new tsd.getAPI(paths.tsdJson);

    gulp.task('ts', function() {
        return gulp.src(paths.tsFiles)
            .pipe($.sourcemaps.init())
            .pipe($.tslint())
            .pipe($.tslint.report('prose', { emitError: false }))
            .pipe($.typescript({sortOutput: true, module: true, declarationFiles:false}))
            .pipe($.sourcemaps.write())
            .pipe($.toJson({filename: paths.tmp + paths.tsOutputName, relative:true}))
            .pipe(gulp.dest(paths.tmp + '/serve/'))
            .pipe($.size());
    });

    //gulp.task('inject-ts', function() {
    gulp.task('inject-ts', ['clean-ts', 'ts'], function() {
        var sortOutput = require(paths.tmp + paths.tsOutputName);

        var tempScripts = gulp.src([paths.tsOutput + '**/*.js'])
            //.pipe($.angularFilesort());
            .pipe($.order(sortOutput, {base: paths.tsOutput}),{read: false});

        gulp.src(paths.client + 'index.html')
            .pipe($.inject(tempScripts, {name: 'inject-ts', addRootSlash: false}))
            .pipe(gulp.dest(paths.client));
    });

    gulp.task('clean-ts', function () {
        var del = require('del');
        return del([paths.tsOutput]);
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
    //gulp.task('gen-ts-refs', ['ts'], function () {
    //    var target = gulp.src(config.appTypeScriptReferences);
    //    var sources = gulp.src(config.tsFiles, {read: false});
    //    return target.pipe($.inject(sources, {
    //        starttag: '//{',
    //        endtag: '//}',
    //        transform: function (filepath) {
    //            return '/// <reference path="../..' + filepath + '" />';
    //        }
    //    })).pipe(gulp.dest(config.typings));
    //});

};
