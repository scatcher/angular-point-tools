'use strict';

var _ = require('lodash');

module.exports = function (apToolsDir, projectDir, projectConfig) {
    var appFolderName = 'app';
    var app = projectConfig.app || projectDir + appFolderName,
        appDir = app + '/',
        test = projectConfig.test || projectDir + 'test',
        testDir = test + '/',
        tmp = projectConfig.tmp || projectDir + '.tmp',
        tmpDir = tmp + '/',
        typings = projectConfig.typings || projectDir + 'typings',
        typingsDir = typings + '/';

    var buildDir = projectDir + "dist/";
    var nodeModules = projectConfig.nodeModules || projectDir + 'node_modules/';

    var templateCache = 'templateCache.js';
    var server = tmpDir + 'serve';
    var serverDir = server + '/';

    var bower = {
        json: require(projectDir + 'bower.json'),
        directory: projectDir + 'bower_components/',
        ignorePath: '../..'
    };

    var offlineXML = tmpDir + 'offlineXML';

    var config = {
        app: app,
        appDir: appDir,
        appTypeScriptReferences: typings + '/app.d.ts',
        bower: bower,
        bowerJson: projectDir + 'bower.json',
        build: buildDir,
        client: app,
        distjs: [tmpDir + templateCache],
        docs: projectDir + "docs/",
        gulpFolder: apToolsDir + '/gulp',
        index: appDir + "index.html",
        lessOutput: appDir + 'styles/css',
        nodeModules: nodeModules,
        offlineXMLConstant: 'apCachedXML',
        offlineXMLName: 'offlineXML.js',
        offlineXML: offlineXML,
        offlineXMLDir: offlineXML + '/',
        offlineXMLSrc: [projectDir + 'xml-cache/', bower.directory + 'angular-point/xml-cache/'],
        packageJson: projectDir + 'package.json',
        projectless: appDir + "styles/less/*.less",
        report: projectDir + "report/",
        server: server,
        serverDir: serverDir,
        templateCache: templateCache,
        templatesModule: 'templateCache',
        tmp: tmp,
        tmpDir: tmpDir,
        tsdJson: projectDir + 'tsd.json',
        tsFiles: [
            app + '/**/*.ts',
            //nodeModules + 'angular-point*/ts/**/*.ts',
            bower.directory + 'angular-point*/ts/**/*.ts'
        ],
        tsSortOutputName: 'sortOutput.json',
        typings: typings,
        typingsDir: typingsDir,
        userefSearchPaths: ['.', app, server],
        //Want everything besides index.html, so ignore the root appDir directory
        htmltemplates: appDir + "*/**/*.html",
        projectcss: [
            appDir + "styles/**/*.css",
            bower.directory + "angular-point-discussion-thread/dist/apDiscussionThread.css"
        /** Issue Globbing, doesn't currently work */
            //"!(bootstrap.css)"
        ],
        projectjs: [
            appDir + "**/*.module.js",
            appDir + "**/*.js",
            '!' + app + '/**/*.spec.js',
            '!' + app + '/**/*.mock.js'
        ],
        mocks: testDir + '**/*.mock.js',
        specs: [
            testDir + "**/*.spec.js",
            appDir + "**/*.spec.js"
        ],
        fonts: [
            bower.directory + "font-awesome/fonts/*",
            bower.directory + "bootstrap/fonts/*",
            bower.directory + "angular-ui-grid/*.{eot,svg,ttf,woff}"
        ],
        images: [
            appDir + "images/**/*.*"
        ],
        offlinexml: [
            projectDir + "xml-cache/**/*.xml",
            bower.directory + "angular-point/xml-cache/**/*.xml"
        ],
        cdnjs: [
            bower.directory + "jquery/dist/jquery.js",
            bower.directory + "angular/angular.js",
            bower.directory + "jquery-ui/jquery-ui.js",
            bower.directory + "angular-sanitize/angular-sanitize.js",
            bower.directory + "angular-animate/angular-animate.js",
            bower.directory + "angular-resource/angular-resource.js",
            bower.directory + "angular-touch/angular-touch.js"
        ],
        devjs: [
            bower.directory + "chance/chance.js",
            offlineXML + '/*.js',
            bower.directory + "angular-mocks/angular-mocks.js",
            bower.directory + "angular-point/test/mock/apMockBackend.mock.js"
        ],
        modules: [
            bower.directory + "angular-point/dist/angular-point.js"
        ],
        vendorjs: [
            bower.directory + "moment/moment.js",
            bower.directory + "lodash/lodash.js",
            bower.directory + "angular-ui-router/release/angular-ui-router.js",
            bower.directory + "angular-bootstrap/ui-bootstrap.js",
            bower.directory + "angular-bootstrap/ui-bootstrap-tpls.js",
            bower.directory + "angular-ui-select/dist/select.js",
            bower.directory + "angular-ui-date/src/date.js",
            bower.directory + "angular-toastr/dist/angular-toastr.js",
            bower.directory + "angular-toastr/dist/angular-toastr.tpls.min.js",
            bower.directory + "angular-loading-bar/build/loading-bar.js",
            bower.directory + "angular-elastic/elastic.js"
        ],
        vendorcss: [
            bower.directory + "angular-ui-select/dist/select.css",
            bower.directory + "angular-toastr/dist/angular-toastr.css",
            bower.directory + "angular-loading-bar/build/loading-bar.css",
            bower.directory + "font-awesome/css/font-awesome.min.css"
        ]

    };


    return config;
};
