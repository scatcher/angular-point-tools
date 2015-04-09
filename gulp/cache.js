'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var fs = require('fs');
var _ = require('lodash');


module.exports = function (projectDir, paths) {
    var pkg = require(paths.packageJson);

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


};
