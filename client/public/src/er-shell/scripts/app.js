/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'angulartics',
    'angulartics-ga',
    'angular-resource',
    'ng-infinite-scroll',
    './controllers/index',
    './models/index',
    './services/index',
    './directives/index',
    './filters/index',
    'pitch-dial',
    'sing-alankars',
    'upordown',
    'melodygraph',
    'swarspace',
    'swarposition',
    'thatmemorizer',
    'singgraph',
    'voicematch'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'app.controllers',
        'app.models',
        'app.services',
        'app.directives',
        'app.filters',
        'ui.router',
        'pitch-dial',
        'sing-alankars',
        'upordown',
        'melodygraph',
        'swarspace',
        'swarposition',
        'thatmemorizer',
        'singgraph',
        'voicematch',
        
        'ngResource',
        'angulartics',
        'angulartics.google.analytics',
        'infinite-scroll'
    ]);
});