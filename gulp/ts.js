'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var log = require('gulp-util').log;
var typescript = require('gulp-typescript');

module.exports = function (projectDir, paths) {

    /** Much faster reloads if we declare the project only once */
    var tsProject = typescript.createProject({
        noExternalResolve: true,
        sortOutput: true,
        target: paths.targetECMAScriptVersion,
        typescript: require('typescript')
    });

    var tsTest = typescript.createProject({
        noExternalResolve: true,
        sortOutput: true,
        typescript: require('typescript')
    });

    gulp.task('ts', function () {

        var tsResult = gulp.src(paths.tsFiles)
            .pipe(sourcemaps.init({loadMaps: true})) //Sourcemaps will be generated
            .pipe(typescript(tsProject, undefined, paths.tsReporter)); //Don't display error messages in console

        return tsResult.js
            .pipe(sourcemaps.write('.', { sourceRoot: '/' })) //Place maps in same directory as transpiled ES5
            .pipe($.toJson({filename: paths.tmpDir + paths.tsSortOutputName, relative: true}))
            .pipe(gulp.dest(paths.serverDir));
    });

    gulp.task('ts-test', function() {
        var tsResult = gulp.src('test/**/*.ts')
            .pipe(sourcemaps.init({loadMaps: true})) //Sourcemaps will be generated
            .pipe(typescript(tsTest, undefined, paths.tsReporter)); //Don't display error messages in console

        return tsResult.js
            // .pipe(sourcemaps.write('.')) //Place maps in same directory as transpiled ES5
            .pipe(sourcemaps.write('.'), { sourceRoot: '/' }) //Place maps in same directory as transpiled ES5
            // .pipe($.toJson({filename: paths.tmpDir + paths.tsSortOutputName, relative: true}))
            .pipe(gulp.dest('test'));

    })

    gulp.task('inject-ts', ['clean-server', 'ts', 'gen-ts-refs'], function () {
        var sortOutput = require(paths.tmpDir + paths.tsSortOutputName);

        var tempScripts = gulp.src([paths.serverDir + '**/*.js'])
            .pipe($.order(sortOutput, {base: paths.server}), {read: false});

        return gulp.src(paths.appDir + 'index.html')
            .pipe($.inject(tempScripts, {name: 'inject-ts', addRootSlash: false}))
            .pipe(gulp.dest(paths.app));
    });

    gulp.task('clean-server', function () {
        var del = require('del');
        return del([paths.server]);
    });

    /**
     * Generates the app.d.ts references file dynamically from all application *.ts files.
     */
    gulp.task('gen-ts-refs', function () {
        var target = gulp.src(paths.appTypeScriptReferences);
        var sources = gulp.src(paths.tsFiles, {read: false});
        return target.pipe($.inject(sources, {
            starttag: '//{',
            endtag: '//}',
            transform: function (filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
        })).pipe(gulp.dest(paths.typings));
    });
};
