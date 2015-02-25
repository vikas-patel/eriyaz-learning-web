/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    './controllers/index',
    './models/index',
    './services/index',
    './directives/index',
    'pitch-dial',
    'sing-graph'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'app.controllers',
        'app.models',
        'app.services',
        'app.directives',
        'ui.router',
        'pitch-dial',
        'sing-graph'
    ]);
});