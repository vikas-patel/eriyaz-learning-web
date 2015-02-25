// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: '/',
    paths: {
        'polymer-wecomponents': 'external-libs/bower_components/webcomponentsjs/webcomponents.min',
        'domReady': 'external-libs/bower_components/requirejs-domready/domready',
        'angular': 'external-libs/bower_components/angular/angular',
        'angular-ui-router': 'external-libs/bower_components/angular-ui-router/release/angular-ui-router.min',


        'mic': 'eartonic-libs/mic',
        'audiobuffer': 'eartonic-libs/audiobuffer',
        'fft-pitch' : 'external-libs/pitchjs/pitch',
        'jquery' : 'external-libs/jquery/jquery',
        'webaudio-tools' : 'external-libs/webaudio/webaudio-tools',
        'webaudioplayer' : 'eartonic-libs/webaudioplayer',
        'melody' : 'eartonic-libs/melody',
        'note' : 'eartonic-libs/note',
        'waveletpitch' : 'external-libs/waveletPitch',
        'd3' : 'external-libs/d3.min'
        //'countdown' : "external-libs/countdown"
    },

    // Add modules that do not support AMD
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'fft-pitch': {
            deps: ['external-libs/pitchjs/complex']
                // exports : 'PitchAnalyzer'
        },
        'jquery': {
            exports: '$'
        }
    },
    packages: [{
        name: 'eriyaz',
        location: 'eriyaz/scripts',
        main: 'main'
    }, {
        name: 'pitch-dial',
        location: 'eartonic-apps/PitchDialAngular',
        main: 'index'
    }, {
        name: 'sing-graph',
        location: 'eartonic-apps/SingGraph',
        main: 'index'
    }]
});