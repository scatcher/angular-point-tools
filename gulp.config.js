module.exports = function () {
    var tmp = './.tmp/';
    var app = './app/';
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var tools = './tools/';
    var offlineXMLName = "offlineXML.js";
    var typings = tools + 'typings';

    var config = {
        client: app,
        index: app + "index.html",
        gulpFolder: tools + 'gulp',
        tsOutput: tmp + 'serve/',
        tsFiles: app + '**/*.ts',
        typings: typings,
        appTypeScriptReferences: typings + '/app.d.ts',
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
            "./test/**/*.spec.js",
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
        build: "./dist/",
        report: "./report/",
        docs: "./docs/",
        offlinexml: [
            "./xml-cache/**/*.xml",
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
        ],
        vendorjs: [
            bower.directory + "moment/moment.js",
            bower.directory + "lodash/lodash.js",
            bower.directory + "lodash-deep/lodash-deep.js",
            bower.directory + "firebase/firebase.js",
            bower.directory + "angular-ui-router/release/angular-ui-router.js",
            bower.directory + "angular-bootstrap/ui-bootstrap.js",
            bower.directory + "angular-bootstrap/ui-bootstrap-tpls.js",
            bower.directory + "angular-ui-utils/ui-utils.js",
            bower.directory + "angular-ui-select/dist/select.js",
            bower.directory + "angular-ui-date/src/date.js",
            bower.directory + "angular-ui-sortable/sortable.js",
            bower.directory + "angular-ui-calendar/src/calendar.js",
            bower.directory + "angular-ui-grid/ui-grid.js",
            bower.directory + "ng-table/ng-table.js",
            bower.directory + "angularfire/dist/angularfire.js",
            bower.directory + "angular-toastr/dist/angular-toastr.js",
            bower.directory + "angular-toastr/dist/angular-toastr.tpls.min.js",
            bower.directory + "angular-loading-bar/build/loading-bar.js",
            bower.directory + "angular-filter/dist/angular-filter.js",
            bower.directory + "highcharts-release/highcharts.js",
            bower.directory + "highcharts-ng/dist/highcharts-ng.js",
            bower.directory + "angular-google-chart/ng-google-chart.js",
            bower.directory + "fullcalendar/fullcalendar.js",
            bower.directory + "angular-elastic/elastic.js"
        ],
        vendorcss: [
            bower.directory + "fullcalendar/fullcalendar.css",
            bower.directory + "angular-ui-select/dist/select.css",
            bower.directory + "angular-ui-grid/ui-grid.css",
            bower.directory + "angular-toastr/dist/angular-toastr.css",
            bower.directory + "angular-loading-bar/build/loading-bar.css",
            bower.directory + "ng-table/ng-table.css",
            bower.directory + "font-awesome/css/font-awesome.min.css",
            app + "styles/**/*bootstrap.css",
            app + "styles/**/*bower.css"
        ]
    };

    return config;
};
