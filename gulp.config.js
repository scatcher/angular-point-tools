'use strict';

module.exports = function (apToolsDir, projectDir, projectConfig) {
    var tmp = projectConfig.tmp || projectDir + '.tmp/';
    var app = projectConfig.app || projectDir + 'app/';
    var test = projectConfig.test || projectDir + 'test/';
    var tools = projectConfig.tools || projectDir + 'tools/';

    var bower = {
        json: require(projectDir + 'bower.json'),
        directory: projectDir + 'bower_components/',
        ignorePath: '../..'
    };

    var typings = tools + 'typings';
    var offlineXMLDir = tmp + 'offlineXML';

    var config = {
        appTypeScriptReferences: typings + '/app.d.ts',
        bower: bower,
        build: projectDir + "dist/",
        client: app,
        distjs: [ app + "common/appModule.js" ],
        docs: projectDir + "docs/",
        gulpFolder: apToolsDir + 'gulp',
        index: app + "index.html",
        lessOutput: app + 'styles/css',
        offlineXMLConstant: 'apCachedXML',
        offlineXMLName: 'offlineXML.js',
        offlineXMLDir: offlineXMLDir,
        offlineXMLSrc: [ projectDir + 'xml-cache/', bower.directory + 'angular-point/test/mock/xml/'],
        packageJson: projectDir + 'package.json',
        projectless: app + "styles/less/*.less",
        report: projectDir + "report/",
        tmp: tmp,
        tsdJson: projectDir + 'tsd.json',
        tsFiles: [app + '**/*.ts', './node_modules/angular-point-tools/angular-point-ts/**/*.ts'],
        tsOutput: tmp + 'serve/',
        tsOutputName: 'sortOutput.json',
        typings: typings,

        htmltemplates: [
            app + "**/*.html",
            "!" + app + "index.html"
        ],
        projectcss: [
            app + "styles/**/*.css",
            bower.directory + "angular-point-discussion-thread/dist/apDiscussionThread.css",
            "!" + app + "styles/**/bootstrap.css",
            "!" + app + "styles/**/bower.css"
        ],
        projectjs: [
            app + "**/*.js",
            "!" + app + "common/appModule.js",
            "!" + app + "**/*.spec.js",
            "!" + app + "**/*.mock.js"
        ],
        specs: [
            test + "**/*.spec.js",
            app + "**/*.spec.js"
        ],
        fonts: [
            bower.directory + "font-awesome/fonts/*",
            bower.directory + "bootstrap/fonts/*",
            bower.directory + "angular-ui-grid/*.{eot,svg,ttf,woff}"
        ],
        images: [
            app + "images/**/*.*"
        ],
        offlinexml: [
            projectDir + "xml-cache/**/*.xml",
            bower.directory + "angular-point/test/mock/xml/**/*.xml"
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
            offlineXMLDir + '/*.js',
            test + "mocks/**/*.js",
            bower.directory + "angular-mocks/angular-mocks.js",
            bower.directory + "angular-point/test/mock/apMockBackend.js"
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
            bower.directory + "font-awesome/css/font-awesome.min.css",
            app + "styles/**/*bootstrap.css",
            app + "styles/**/*bower.css"
        ]

    };


    return config;
};
