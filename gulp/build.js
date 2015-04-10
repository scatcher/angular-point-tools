'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var log = $.util.log;

module.exports = function (projectDir, paths) {
    var pkg = require(paths.packageJson);

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
            .pipe($.bytediff.start())
            .pipe($.minifyHtml({empty: true}))
            .pipe($.angularTemplatecache(paths.templateCache, {
                module: pkg.module,
                standalone: false,
                root: ''
            }))
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(gulp.dest(paths.tmp));
    });

    gulp.task('html', ['inject-dist'], function () {
        var jsFilter = $.filter('**/*.js');
        var cssFilter = $.filter('**/*.css');
        var assets;

        return gulp.src(paths.index)
            .pipe(assets = $.useref.assets({searchPath: '.'}))

            .pipe(jsFilter)
            //.pipe($.ngAnnotate({add: true, single_quotes: true}))
            //.pipe($.stripDebug())
            //.pipe($.bytediff.start())
            //.pipe($.uglify({mangle: true}))
            //.pipe($.bytediff.stop(bytediffFormatter))
            .pipe(jsFilter.restore())

            .pipe(cssFilter)
            //TODO Create a regexp to replace all font in ui-grid
            .pipe($.bytediff.start())
            .pipe($.csso())
            .pipe($.replace('ui-grid.svg', '../fonts/ui-grid.svg'))
            .pipe($.replace('ui-grid.woff', '../fonts/ui-grid.woff'))
            .pipe($.replace('styles/fonts', 'fonts'))
            //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
            .pipe($.replace('bower_components/bootstrap/fonts', '../fonts'))
            //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
            .pipe($.bytediff.stop(bytediffFormatter))
            .pipe(cssFilter.restore())

            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest(paths.build))
            .pipe($.size());
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
