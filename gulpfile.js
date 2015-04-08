'use strict';

/* jshint camelcase:false */
var gulp = require('gulp');
//var $ = require('gulp-load-plugins')();
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var wrench = require('wrench');
var config = require('./gulp.config')();


wrench.readdirSyncRecursive(config.gulpFolder).filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
    require(config.gulpFolder + '/' + file)(config);
});

var fs = require('fs');

//var browserSync = require('browser-sync');
var karma = require('karma').server;

var log = $.util.log;
var pkg = require('./package.json');
var _ = require('lodash');


gulp.task('build', [
    'templatecache',
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
        .src(config.htmltemplates)
        .pipe($.bytediff.start())
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache('scripts/templates.js', {
            module: pkg.module,
            standalone: false,
            root: ''
        }))
        .pipe($.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.build));
});

gulp.task('html', ['inject-dist'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(config.index)
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
        .pipe(gulp.dest(config.build))
        .pipe($.size());
});


gulp.task('styles', function () {
    return gulp.src(config.projectless)
        .pipe($.less())
        .pipe(gulp.dest('app/styles/css'))
        .pipe($.size());
});


/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        //return gulp.src(config.vendorcss)
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(config.build + 'fonts'))
        .pipe($.size());
});


/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function () {
    return gulp.src(config.images)
        .pipe($.imagemin({
            //.pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.build + 'images'))
        .pipe($.size());
});

gulp.task('clean', function () {
    var del = require('del');
    return del(['.tmp/', 'dist/']);
});

//gulp.task('build-vendor', function() {
//
//    return gulp.src(config.index)
//        .pipe($.plumber())
//        .pipe($.inject(gulp.src(config.vendorjs, {read: false}), {addRootSlash: false}))
//        //.pipe($.bytediff.start())
//        //.pipe($.uglify({mangle: true}))
//        //.pipe($.bytediff.stop(bytediffFormatter))
//        //.pipe(injectRelative('vendorjs', injectOptions))
//        .pipe(gulp.dest(config.client));
//});

gulp.task('inject-dev', ['cacheXML'], function () {
    /** We want to make all links relative to app so remove the app/ prefix on injected references */
    var injectOptions = {ignorePath: 'app/'};

    return gulp.src(config.client + 'index.html')
        .pipe(injectRelative('vendorjs', injectOptions))
        .pipe(injectRelative('cdnjs', injectOptions))
        //.pipe($.inject($.order(sortOutput, {base: config.tmp + '/serve'}), {name: 'inject-ts'}))
        //.pipe($.inject(gulp.src(sortOutput, {read: false}), {name: 'inject-ts', addRootSlash: false}))
        .pipe(injectNG('environmentjs', {src: config.devjs, ignorePath: 'app/'}))
        .pipe(injectNG('projectjs', injectOptions))
        .pipe(injectNG('modules', injectOptions))
    /** Replace local jquery-ui css with cdn */
        .pipe($.replace('href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0',
            'href="bower_components/jquery-ui'))
        .pipe(injectRelative('projectcss', injectOptions))
        .pipe(injectRelative('vendorcss', injectOptions))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject-dist', ['styles'], function () {
    var googlecdn = require('gulp-google-cdn');

    return gulp.src(config.client + 'index.html')
        .pipe(injectRelative('vendorjs'))
        .pipe(injectRelative('cdnjs'))
        .pipe(injectNG('environmentjs', {src: config.distjs}))
    /** Replace local references with Google CDN references */
        .pipe(googlecdn(require('./bower.json')))
        .pipe(injectNG('projectjs'))
        .pipe(injectNG('modules'))
    /** Replace local jquery-ui css with cdn */
        .pipe($.replace('href="bower_components/jquery-ui',
            'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0'))
        .pipe(injectRelative('projectcss'))
        .pipe(injectRelative('vendorcss'))
        .pipe(gulp.dest(config.client));
});

gulp.task('connect', function () {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({port: 35729}))
        .use(serveStatic('app'))
        // config to bower_components should be relative to the current file
        // e.g. in app/index.html you should use ../bower_components
        .use('/bower_components', serveStatic('bower_components'))
        .use('/node_modules', serveStatic('node_modules'))
        .use('/xml-cache', serveStatic('xml-cache'))
        .use('/test', serveStatic('test'))
        .use('/.tmp', serveStatic('.tmp'))
        .use('/typings', serveStatic('typings'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('server', ['connect', 'inject-dev'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('watch', ['connect', 'server'], function () {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        config.htmltemplates,
        config.projectjs,
        config.projectcss
    ]).on('change', $.livereload.changed);

    gulp.watch(config.projectless, ['styles']);

    gulp.watch(config.tsFiles, ['ts'])
        .on('change', $.livereload.changed);

});


gulp.task('serve', ['inject-ts', 'watch']);

// Update bower, component, npm at once:
gulp.task('bump', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});

////////////////

/**
 * @name injectNG
 * @description Looks for a named JS block in index.html and inserts links to all matching
 * files.  Files are sorted first to ensure files are sorted by Angular dependency to eliminate
 * potential issues with dependencies not being available.
 * @param {string} pathName Used to find the applicable inject block in the html. 'test' would look for a
 * "<!-- inject-test:js -->" block.
 * @param {object} options
 * @param {string|string[]} [options.src=config[pathName]] Location to find the files to inject.
 * @param {string} [options.ignorePath] Remove from the beginning of the file reference to make relative.  In
 * dev mode we remove 'app/' so we can run gulp serve relative to the app directory.
 */
function injectNG(pathName, options) {
    var defaults = {
        name: 'inject-' + pathName,
        addRootSlash: false,
        src: options && options.src ? options.src : config[pathName]
    };
    var opts = _.extend({}, defaults, options);

    return $.inject(gulp.src(opts.src).pipe($.angularFilesort()), opts);
}

/**
 * @name injectRelative
 * @description Looks for a named JS block in index.html and inserts links to all matching
 * files.  Unlike injectNG, there is no sorting done based on content so it runs faster.
 * @param {string} pathName Used to find the applicable inject block in the html. 'test' would look for a
 * "<!-- inject-test:js -->" block.
 * @param {object} options
 * @param {string|string[]} [options.src=config[pathName]] Location to find the files to inject.
 * @param {string} [options.ignorePath] Remove from the begining of the file reference to make relative.  In
 * dev mode we remove 'app/' so we can run gulp serve relative to the app directory.
 */
function injectRelative(pathName, options) {
    var defaults = {
        name: 'inject-' + pathName,
        addRootSlash: false,
        src: options && options.src ? options.src : config[pathName]
    };
    var opts = _.extend({}, defaults, options);
    return $.inject(gulp.src(opts.src, {read: false}), opts);
}

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

//TODO Make cacheXML logic use gulp.src and process as a stream instead of use the current sync approach
gulp.task('cacheXML', function () {
    createJSON({
        moduleName: pkg.module,
        constantName: 'apCachedXML',
        fileName: 'offlineXML.js',
        dest: 'test/mocks/',
        src: [ 'xml-cache/', 'bower_components/angular-point/test/mock/xml/']
    });
});

/**
 * @description
 * Takes folders of cached XHR responses (xml files), escapes the contents, and generates an angular constant object
 *     with properties equaling the name of the file and values being the escaped contents of the file.
 * @param {object} options
 * @param {string} [options.constantName='apCachedXML']
 * @param {string} [options.dest=opts.src[0]] The output location for the file.
 * @param {string} [options.fileName='offlineXML.js']
 * @param {string} [options.moduleName='angularPoint']
 * @param {string[]} [options.src] Folders containing XML files to process.
 */
function createJSON(options) {
    var defaults = {
            moduleName: 'angularPoint',
            constantName: 'apCachedXML',
            fileName: 'offlineXML.js',
            //dest: '.',
            src: []
        },
        opts = _.extend({}, defaults, options),
        offlineXML = {operations: {}, lists: {}};

    opts.dest = opts.dest || opts.src[0];

    /** Process each of the src directories */
    opts.src.forEach(function (fileDirectory) {
        /** Go through each XML file in the directory */
        fs.readdirSync(fileDirectory).forEach(function (fileName) {
            if (fileName.indexOf('.xml') > -1) {
                var fileContents = fs.readFileSync(fileDirectory + '/' + fileName, {encoding: 'utf8'});
                var operation = fileContents.split('Response')[0].split('<');
                operation = operation[operation.length - 1];
                if (operation === 'GetListItems' || operation === 'GetListItemChangesSinceToken') {

                    offlineXML.lists[fileName.split('.xml')[0]] = offlineXML.lists[fileName.split('.xml')[0]] || {};
                    offlineXML.lists[fileName.split('.xml')[0]][operation] = fileContents;
                } else {
                    /** Create a property on the offlineXML object with a key equaling the file name (without .xml) and
                     * value being the contents of the file */
                    offlineXML.operations[operation] = offlineXML.operations[operation] || fileContents;
                }
            }
        });
    });

    var fileContents = 'angular.module(\'' + opts.moduleName + '\').constant(\'' + opts.constantName + '\', ';
    /** Stringify object and indent 4 spaces */
    fileContents += JSON.stringify(offlineXML, null, 4) + ');';

    /** Write file to dest */
    return fs.writeFileSync(opts.dest + '/' + opts.fileName, fileContents, {encoding: 'utf8'});
}

/** Used to expose gulp tasks to gulp-devtools
 * Install on system with "npm install -g gulp-devtools"
 * @type {exports}
 */
module.exports = gulp;
