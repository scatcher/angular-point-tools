'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

module.exports = function (projectDir, paths) {

    gulp.task('connect', function () {
        var serveStatic = require('serve-static');
        var serveIndex = require('serve-index');
        var app = require('connect')()
            .use(require('connect-livereload')({ port: 35729 }))
            .use(serveStatic('app'))
        // config to bower_components should be relative to the current file
        // e.g. in app/index.html you should use ../bower_components
            .use('/app', serveStatic('app'))
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

    gulp.task('server', ['connect', 'inject-dev', 'styles'], function () {
        require('opn')('http://localhost:9000');
    });

    gulp.task('watch', ['connect', 'server', 'watch-ts'], function () {
        $.livereload.listen();

        // watch for changes
        gulp.watch([
            paths.htmltemplates,
            paths.projectjs,
            paths.projectcss
        ]).on('change', $.livereload.changed);

        gulp.watch(paths.projectless, ['styles']);

        gulp.watch(paths.serverDir + '**/*.js')
            .on('change', $.livereload.changed);

    });

    gulp.task('watch-ts', ['ts'], function () {
        gulp.watch(paths.tsFiles, ['ts']);
    });

    gulp.task('serve', ['watch']);

    // gulp.task('serve', ['inject-dev', 'styles'], function () {
    //     browserSync.init({
    //         server: {
    //             baseDir: ["./", "app"],
    //             index: paths.index
    //         }
    //     });

    //     gulp.watch(paths.tsFiles, ['ts']);
    //     gulp.watch(paths.projectless, ['styles']);
    //     gulp.watch("app/**/*.ts", { events: ['add'] }, ['ts', 'inject-dev']);
    //     gulp.watch(".tmp/**/*.js").on('change', browserSync.reload);
    //     gulp.watch("app/**/*.html").on('change', browserSync.reload);
    // });


};
