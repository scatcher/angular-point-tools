# angular-point-tools
Build tools shared by angular-point projects.

## Adding to Your Project
        //Sit back and grab a drink, this is going to download all NPM 
        //dependencies so we don't need to each project.
        npm install angular-point-tools --save

        
## Build Project
        gulp build
        
## Start Server and Watch For Changes
        gulp serve
        
## Minimum Config
Setting up your gulpfile.js
                
        var gulp = require('gulp');
        var projectDir = __dirname + '/';
        var config = require('./gulp.config')(projectDir);
        require('angular-point-tools')(projectDir, config);
        
## Setting up Aggregate Typings File
        /// <reference path="tsd.d.ts" />
        /// <reference path="../node_modules/angular-point-tools/interfaces/angular-point.d.ts" />
        /// <reference path="../node_modules/angular-point-tools/ts/Model.ts" />
        /// <reference path="../node_modules/angular-point-tools/ts/ListItem.ts" />

## Referencing Project Types From the Application
From a given TS file add reference
        
        
        /// <reference path="../../../typings/app.d.ts" />
        
## Add an Injection Point in your index.html
        <!-- inject-ts:js -->
        //Stuff gets injected here...
        <!-- endinject -->

## Configure Tools
All configuration can be done in "./gulp.config.js".  If going with the standard template, the only thing you'll
probably want to have in something like below:
    
        module.exports = function (projectDir) {
            var app = projectDir + 'app/';
            var bowerDir = projectDir + 'bower_components/';
            var test = projectDir + 'test/';
            var tmp = projectDir + '.tmp/';
        
            var config = {
                /** Optionally Override */
                //app: app,
                //test: test,
                //tmp:tmp,
                modules: [
                    bowerDir + "angular-point/dist/angular-point.js",
                    bowerDir + "angular-point-attachments/dist/apAttachments.js",
                    bowerDir + "angular-point-discussion-thread/dist/apDiscussionThread.js",
                    bowerDir + "angular-point-modal/dist/apModalService.js",
                    bowerDir + "angular-point-group-manager/dist/apGroupManager.js",
                    bowerDir + "angular-point-lookup-cache/dist/index.js",
                    bowerDir + "angular-point-form-control/dist/apInputControl.js",
                    bowerDir + "angular-point-offline-generator/dist/ap-offline-generator.js",
                    bowerDir + "angular-point-sync/dist/index.js"
                ],
                vendorjs: [
                    bowerDir + "moment/moment.js",
                    bowerDir + "lodash/lodash.js",
                    bowerDir + "lodash-deep/lodash-deep.js",
                    bowerDir + "firebase/firebase.js",
                    bowerDir + "angular-ui-router/release/angular-ui-router.js",
                    bowerDir + "angular-bootstrap/ui-bootstrap.js",
                    bowerDir + "angular-bootstrap/ui-bootstrap-tpls.js",
                    bowerDir + "angular-ui-utils/ui-utils.js",
                    bowerDir + "angular-ui-select/dist/select.js",
                    bowerDir + "angular-ui-date/src/date.js",
                    bowerDir + "angular-ui-sortable/sortable.js",
                    bowerDir + "angular-ui-calendar/src/calendar.js",
                    bowerDir + "angular-ui-grid/ui-grid.js",
                    bowerDir + "ng-table/ng-table.js",
                    bowerDir + "angularfire/dist/angularfire.js",
                    bowerDir + "angular-toastr/dist/angular-toastr.js",
                    bowerDir + "angular-toastr/dist/angular-toastr.tpls.min.js",
                    bowerDir + "angular-loading-bar/build/loading-bar.js",
                    bowerDir + "angular-filter/dist/angular-filter.js",
                    bowerDir + "highcharts-release/highcharts.js",
                    bowerDir + "highcharts-ng/dist/highcharts-ng.js",
                    bowerDir + "angular-google-chart/ng-google-chart.js",
                    bowerDir + "fullcalendar/fullcalendar.js",
                    bowerDir + "angular-elastic/elastic.js"
                ],
                vendorcss: [
                    bowerDir + "fullcalendar/fullcalendar.css",
                    bowerDir + "angular-ui-select/dist/select.css",
                    bowerDir + "angular-ui-grid/ui-grid.css",
                    bowerDir + "angular-toastr/dist/angular-toastr.css",
                    bowerDir + "angular-loading-bar/build/loading-bar.css",
                    bowerDir + "ng-table/ng-table.css",
                    bowerDir + "font-awesome/css/font-awesome.min.css",
                    app + "styles/**/*bootstrap.css",
                    app + "styles/**/*bower.css"
                ]
            };
        
            return config;
        };
        
        
## Example app.module.ts

        module app {
            'use strict';
        
            var modules = [    'ngSanitize', 'ngAnimate', 'googlechart', 'ui.router', 'ui.bootstrap',
                'ui.date', 'ui.utils', 'ui.select', 'ui.sortable', 'ui.highlight', 'ui.grid', 'ui.grid.edit',
                'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.moveColumns',
                'ui.grid.rowEdit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.expandable', 'ngTable',
                'firebase', 'toastr', 'angular-loading-bar', 'angular.filter', 'monospaced.elastic', 'angularPoint'
            ];
        
            var offline = false;
        
            if(window.location.href.indexOf('localhost') > -1 ||
                window.location.href.indexOf('http://0.') > -1 ||
                window.location.href.indexOf('http://10.') > -1 ||
                window.location.href.indexOf('http://127.') > -1 ||
                window.location.href.indexOf('http://192.') > -1) {
        
                offline = true;
                /** Add in mock library if working offline to prevent us from making outside requests */
                modules.push('ngMockE2E');
            } else {
                 /** Reference the module used by template cache */
                 modules.push('templateCache');
             }
        
            angular.module('my-app-module', modules);
        
            if(offline) {
                angular.module('my-app-module')
                /** Set a default user in offline */
                    .constant('mockUser', {
                        lookupId: 441,
                        lookupValue: "Hatcher CIV Scott B"
                    })
                /** Allow requests for specific file types to be allowed through */
                    .run(function ($httpBackend) {
        
                        // Don't mock the html views
                        $httpBackend.whenGET(/\.html$/).passThrough();
        
                        $httpBackend.whenGET(/\.xml$/).passThrough();
        
                    });
        
            }
        }
        
## Pulling Down TypeScript Definitions
        //Installs TS definitions for packages in bower.json
        gulp tsd