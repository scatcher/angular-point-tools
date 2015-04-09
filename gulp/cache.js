'use strict';

var gulp = require('gulp');
var fs = require('fs');
var _ = require('lodash');
var log = require('gulp-util').log;


module.exports = function (projectDir, paths) {
    var pkg = require(paths.packageJson);

    //TODO Make cacheXML logic use gulp.src and process as a stream instead of use the current sync approach
    gulp.task('cacheXML', function () {
        createJSON({
            moduleName: pkg.module,
            constantName: paths.offlineXMLConstant,
            fileName: paths.offlineXMLName,
            dest: paths.offlineXMLDir,
            src: paths.offlineXMLSrc
        });
    });

    /**
     * @description
     * Takes folders of cached XHR responses (xml files), escapes the contents, and generates an angular constant object
     *     with properties equaling the name of the file and values being the escaped contents of the file.
     * @param {object} options
     * @param {string} [options.constantName='apCachedXML']
     * @param {string} [options.dest=options.src[0]] The output location for the file.
     * @param {string} [options.fileName='offlineXML.js']
     * @param {string} [options.moduleName='angularPoint']
     * @param {string[]} [options.src] Folders containing XML files to process.
     */
    function createJSON(options) {
        var offlineXML = {operations: {}, lists: {}};

        /** Process each of the src directories */
        options.src.forEach(function (fileDirectory) {

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

        var fileContents = 'angular.module(\'' + options.moduleName + '\').constant(\'' + options.constantName + '\', ';
        /** Stringify object and indent 4 spaces */
        fileContents += JSON.stringify(offlineXML, null, 4) + ');';

        /** Ensure destination folder exists */
        try{
            fs.readdirSync(options.dest);
        }
        catch(err) {
            fs.mkdirSync(options.dest);
        }

        /** Write file to dest */
        return fs.writeFileSync(options.dest + '/' + options.fileName, fileContents, {encoding: 'utf8'});
    }


};
