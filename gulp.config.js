var log = require('gulp-util').log;

module.exports = function (directory) {
    var projectDir = directory ? directory + '/' : './';
    var tmp = projectDir + '.tmp/';
    var app = projectDir + 'app/';
    var test = projectDir + 'test/';


    var bower = {

        json: require(projectDir + 'bower.json'),
        directory: projectDir + 'bower_components/',
        ignorePath: '../..'
    };

    var tools = projectDir + 'tools/';
    var offlineXMLName = "offlineXML.js";
    var typings = tools + 'typings';

    var config = {
        appTypeScriptReferences: typings + '/app.d.ts',
        bower: bower,
        build: projectDir + "dist/",
        client: app,
        docs: projectDir + "docs/",
        gulpFolder: tools + 'gulp',
        index: app + "index.html",
        lessOutput: app + 'styles/css',
        packageJson: projectDir + 'package.json',
        report: projectDir + "report/",
        tsdJson: projectDir + 'tsd.json',
        tsFiles: [app + '**/*.ts', './node_modules/angular-point-tools/angular-point-ts/**/*.ts'],
        tsOutput: tmp + 'serve/',
        tsOutputName: 'sortOutput.json',
        typings: typings,

        htmltemplates: [
            app + "**/*.html",
            "!" + app + "index.html"
        ],
        offlineXMLName: offlineXMLName,
        projectcss: [
            app + "styles/**/*.css",
            bower.directory + "angular-point-discussion-thread/dist/apDiscussionThread.css",
            "!" + app + "styles/**/bootstrap.css",
            "!" + app + "styles/**/bower.css"
        ],
        projectless: app + "styles/less/*.less",
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
        tmp: tmp,
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
            "./test/mocks/**/*.js",
            bower.directory + "angular-mocks/angular-mocks.js",
            bower.directory + "angular-point/test/mock/apMockBackend.js"
        ],
        distjs: [
            app + "common/appModule.js"
        ],
        modules: [
            bower.directory + "angular-point/dist/angular-point.js",
            bower.directory + "angular-point-attachments/dist/apAttachments.js",
            bower.directory + "angular-point-discussion-thread/dist/apDiscussionThread.js",
            bower.directory + "angular-point-modal/dist/apModalService.js",
            bower.directory + "angular-point-group-manager/dist/apGroupManager.js",
            bower.directory + "angular-point-lookup-cache/dist/index.js",
            bower.directory + "angular-point-form-control/dist/apInputControl.js",
            bower.directory + "angular-point-offline-generator/dist/ap-offline-generator.js",
            bower.directory + "angular-point-sync/dist/index.js"
        ]
    };

    return config;
};
