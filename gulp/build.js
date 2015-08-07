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
        log(paths.htmltemplates);
        return gulp
            .src(paths.htmltemplates)
            .pipe($.bytediff.start())
            .pipe($.minifyHtml({empty: true}))
            .pipe($.angularTemplatecache(paths.templateCache, {
                module: paths.templatesModule,
                standalone: true,
                root: ''
            }))
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(gulp.dest(projectDir + '.tmp'));
    });
    
    gulp.task('build-vendor-js', function () {
        return gulp.src(paths.vendorjs)
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.concat('vendor.js'))
            .pipe($.uglify({mangle: true}))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.build + 'scripts'));
    });
    
    gulp.task('build-app-js', ['inject-dist', 'templatecache'], function () {
        var sortOutput = require(paths.tmpDir + paths.tsSortOutputName);
        var projectReferenes = _.chain(sortOutput)
            .filter(function(ref) {
                if(ref.indexOf('.map') === -1) {
                    return true;
                }
            })
            .map(function(ref) {
                return paths.serverDir + ref;
            })
            .value()
                    
        return gulp.src(_.flatten([paths.modules, projectReferenes, projectDir + '.tmp/' + paths.templateCache]))
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.concat('scripts.js'))
            // .pipe($.uglify({mangle: true}))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.build + 'scripts'));
    });
    

    gulp.task('html', ['build-vendor-js', 'build-app-js'], function () {
        var jsFilter = $.filter('**/*.js');
        var cssFilter = $.filter('**/*.css');
        var assets;

        return gulp.src(paths.index)
            .pipe(assets = $.useref.assets({searchPath: paths.userefSearchPaths, noconcat: true}))
            //Filter out all JS because we're handling vendor.js and app.js manually above
            .pipe(jsFilter)

            .pipe(cssFilter)
            //TODO Create a regexp to replace all font in ui-grid
            .pipe($.bytediff.start())
            .pipe($.csso())
            .pipe($.replace('ui-grid.svg', '../fonts/ui-grid.svg'))
            .pipe($.replace('ui-grid.woff', '../fonts/ui-grid.woff'))
            .pipe($.replace('styles/fonts', 'fonts'))
            //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
            .pipe($.replace('../../../bower_components/bootstrap/fonts', '../fonts'))
            //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(cssFilter.restore())

            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest(paths.build))
            .pipe($.size());
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
