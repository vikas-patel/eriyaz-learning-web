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
    'hot-keys',
    'pitch-dial',
    'sing-alankars',
    'upordown',
    'melodygraph',
    'swarspace',
    'swarposition',
    'sargamtuner',
    'thatmemorizer',
    'singgraph',
    'voicematch',
    'freestylephrases',
    'swarmastery',
    'melodygraph2',
    'timetrainer',
    'voicerange',
    'swarsense',
    'rapidintervals',
    'melakarta',
    'melakarta2',
    'fasternotes',
    'rapidupdown',
    'extractnotes',
    'singsargam',
    'countnotes',
    'tonesmemory',
    'poorvanga',
    'phraseshape',
    'singinggame',
    'flappybird',
    'fruitninja',
    'voicematch2'
    
], function(angular) {
    'use strict';

    return angular.module('app', [
        'app.controllers',
        'app.models',
        'app.services',
        'app.directives',
        'app.filters',
        'ui.router',
        'cfp.hotkeys',
        'pitch-dial',
        'sing-alankars',
        'upordown',
        'melodygraph',
        'swarspace',
        'swarposition',
        'sargamtuner',
        'thatmemorizer',
        'singgraph',
        'voicematch',
        'freestylephrases',
        'swarmastery',
        'melodygraph2',
        'timetrainer',
        'voicerange',
        'swarsense',
        'rapidintervals',
        'melakarta',
        'melakarta2',
        'fasternotes',
        'rapidupdown',
        'extractnotes',
        'singsargam',
        'countnotes',
        'tonesmemory',
        'poorvanga',
        'flappybird',
        'fruitninja',
        'phraseshape',
        'singinggame',
        'voicematch2',
        'ngResource',
        'angulartics',
        'angulartics.google.analytics',
        'infinite-scroll'
    ]);
});