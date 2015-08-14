/// <reference path="../gulp.config.js" />
'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var angularFilesort = require('gulp-angular-filesort');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var log = $.util.log;

module.exports = function (projectDir, paths) {

    gulp.task('build', [
        'html',
        'images',
        'fonts',
        'bump'
    ]);

    /**
     * Create $templateCache from the html templates
     * @return {Stream}
     */
    gulp.task('templatecache', function () {
        log('Creating an AngularJS $templateCache');
        return gulp
            .src(paths.htmltemplates)
        // .pipe($.bytediff.start())
            .pipe($.minifyHtml({ empty: true }))
            .pipe($.angularTemplatecache(paths.templateCache, {
                module: paths.templatesModule,
                standalone: true,
                root: ''
            }))
        // .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(gulp.dest(projectDir + '.tmp'));
    });

    gulp.task('build-vendor-js', function () {
        return gulp.src(paths.vendorjs)
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.concat('vendor.js'))
            .pipe($.uglify({ mangle: true }))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.build + 'scripts'));
    });


    gulp.task('build-app-js', ['ts', 'templatecache'], function () {
        var sortOutput = require(paths.tmpDir + paths.tsSortOutputName);
        var projectReferenes = _.chain(sortOutput)
            .filter(function (ref) {
                if (ref.indexOf('.map') === -1) {
                    return true;
                }
            })
            .map(function (ref) {
                return paths.serverDir + ref;
            })
            .value();

        return gulp.src(_.flatten([paths.modules, projectReferenes, projectDir + '.tmp/' + paths.templateCache]))
            .pipe($.sourcemaps.init({ loadMaps: true }))
        // .pipe($.ngAnnotate())
            .pipe($.concat('scripts.js'))
        // .pipe($.uglify({mangle: true}))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.build + 'scripts'));
    });

    gulp.task('build-vendor-css', function () {
        return gulp.src(paths.vendorcss)
            .pipe($.concat('vendor.css'))
            .pipe($.bytediff.start())
            .pipe($.csso())
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe($.replace('ui-grid.svg', '../fonts/ui-grid.svg'))
            .pipe($.replace('ui-grid.woff', '../fonts/ui-grid.woff'))
            .pipe($.replace('styles/fonts', 'fonts'))
            .pipe($.replace('../../../bower_components/bootstrap/fonts', '../fonts'))
            .pipe(gulp.dest(paths.build + 'styles'));
    });

    gulp.task('build-app-css', ['styles'], function () {
        return gulp.src(paths.projectcss)
            .pipe($.concat('main.css'))
            .pipe($.bytediff.start())
            .pipe($.csso())
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(gulp.dest(paths.build + 'styles'));
    });

    gulp.task('html', ['build-vendor-js', 'build-app-js', 'build-vendor-css', 'build-app-css'], function () {
        // var jsFilter = $.filter('**/*.js');
        // var cssFilter = $.filter('**/*.css');
        var googlecdn = require('gulp-google-cdn');
        var assets;

        return gulp.src(paths.index)
            .pipe(googlecdn(paths.bower.json))
        /** Replace local jquery-ui css with cdn */
            .pipe($.replace('href="bower_components/jquery-ui',
                'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0'))
            
            //Need to specify https because SharePoint occasionally tries to make
            //all CDN links relative which breaks everything
            .pipe($.replace('"//', '"https://'))

            //Intentionally don't pass it any files so it will clear our all 
            //existing refs
            .pipe(assets = $.useref.assets())

            //Filter out all CSS & JS because we're handling 
            // manually above
            // .pipe(cssFilter)
            // .pipe(jsFilter)

            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest(paths.build));
        // .pipe($.size());
    });

    gulp.task('uglify-vendor-js', function () {
        return gulp.src('dist/scripts/vendor.js')
            .pipe($.bytediff.start())
            .pipe($.uglify({ mangle: true }))
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(gulp.dest('dist/scripts'));
    });


    ////////////////

    /**
     * Formatter for bytediff to display the size changes after processing
     * @param  {Object} data - byte data
     * @return {String}      Difference in bytes, formatted
     */
    function bytediffFormatter(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' went from ' +
            (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
            ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
    }

    /**
     * Format a number as a percentage
     * @param  {Number} num       Number to format as a percent
     * @param  {Number} precision Precision of the decimal
     * @return {Number}           Formatted perentage
     */
    function formatPercent(num, precision) {
        return (num * 100).toFixed(precision);
    }

};
