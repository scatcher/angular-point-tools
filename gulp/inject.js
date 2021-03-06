'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var _ = require('lodash');
var log = require('gulp-util').log;


module.exports = function(projectDir, paths) {

    gulp.task('inject-dev', ['cacheXML', 'inject-ts', 'templatecache'], function () {
        /** We want to make all links relative to app so remove the app/ prefix on injected references */
        var injectOptions = {}; //{ignorePath: 'app/'};

        return gulp.src(paths.appDir + 'index.html')
            .pipe($.plumber())
            .pipe(injectRelative('vendorjs', injectOptions))
            .pipe(injectRelative('cdnjs', injectOptions))
            //.pipe($.inject($.order(sortOutput, {base: config.tmp + '/serve'}), {name: 'inject-ts'}))
            //.pipe($.inject(gulp.src(sortOutput, {read: false}), {name: 'inject-ts', addRootSlash: false}))
            .pipe(injectNG('environmentjs', {src: paths.devjs, ignorePath: 'app/'}))
            .pipe(injectNG('projectjs', injectOptions))
            .pipe(injectNG('modules', injectOptions))
        /** Replace local jquery-ui css with cdn */
            .pipe($.replace('href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0',
                'href="bower_components/jquery-ui'))
            .pipe(injectRelative('projectcss', injectOptions))
            .pipe(injectRelative('vendorcss', injectOptions))
            .pipe(gulp.dest(paths.app));
    });

    /**
     * @name injectNG
     * @description Looks for a named JS block in index.html and inserts links to all matching
     * files.  Files are sorted first to ensure files are sorted by Angular dependency to eliminate
     * potential issues with dependencies not being available.
     * @param {string} pathName Used to find the applicable inject block in the html. 'test' would look for a
     * "<!-- inject-test:js -->" block.
     * @param {object} options
     * @param {string|string[]} [options.src=paths[pathName]] Location to find the files to inject.
     * @param {string} [options.ignorePath] Remove from the beginning of the file reference to make relative.  In
     * dev mode we remove 'app/' so we can run gulp serve relative to the app directory.
     */
    function injectNG(pathName, options) {
        var defaults = {
            name: 'inject-' + pathName,
            addRootSlash: false,
            src: options && options.src ? options.src : paths[pathName]
        };
        var opts = _.assign({}, defaults, options);

        return $.inject(gulp.src(opts.src).pipe($.angularFilesort()), opts);
    }

    /**
     * @name injectRelative
     * @description Looks for a named JS block in index.html and inserts links to all matching
     * files.  Unlike injectNG, there is no sorting done based on content so it runs faster.
     * @param {string} pathName Used to find the applicable inject block in the html. 'test' would look for a
     * "<!-- inject-test:js -->" block.
     * @param {object} options
     * @param {string|string[]} [options.src=paths[pathName]] Location to find the files to inject.
     * @param {string} [options.ignorePath] Remove from the begining of the file reference to make relative.  In
     * dev mode we remove 'app/' so we can run gulp serve relative to the app directory.
     */
    function injectRelative(pathName, options) {
        var defaults = {
            name: 'inject-' + pathName,
            addRootSlash: false,
            src: options && options.src ? options.src : paths[pathName]
        };
        var opts = _.assign({}, defaults, options);
        return $.inject(gulp.src(opts.src, {read: false, dot:true}), opts);
    }

    //gulp.task('build-vendor', function() {
//
//    return gulp.src(paths.index)
//        .pipe($.plumber())
//        .pipe($.inject(gulp.src(paths.vendorjs, {read: false}), {addRootSlash: false}))
//        //.pipe($.bytediff.start())
//        //.pipe($.uglify({mangle: true}))
//        //.pipe($.bytediff.stop(bytediffFormatter))
//        //.pipe(injectRelative('vendorjs', injectOptions))
//        .pipe(gulp.dest(paths.client));
//});


};
