// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    waitSeconds: 60,
    baseUrl: '/',
    paths: {
        'polymer-wecomponents': 'ext-libs/bower_components/webcomponentsjs/webcomponents.min',
        'domReady': 'ext-libs/bower_components/requirejs-domready/domready',
        'angular': 'ext-libs/bower_components/angular/angular',
        'angular-ui-router': 'ext-libs/bower_components/angular-ui-router/release/angular-ui-router.min',
        'angulartics' : 'ext-libs/bower_components/angulartics/dist/angulartics.min',
        'angulartics-ga' : 'ext-libs/bower_components/angulartics/dist/angulartics-ga.min',

        'mic': 'er-libs/mic',
        'pitchdetector' : 'er-libs/pitchdetector',
        'intensityfilter':'er-libs/intensityfilter',
        'currentaudiocontext' : 'er-libs/currentaudiocontext',
        'audiobuffer': 'er-libs/audiobuffer',
        'fft-pitch' : 'ext-libs/pitchjs/pitch',
        'jquery' : 'ext-libs/jquery/jquery',
        'webaudio-tools' : 'ext-libs/webaudio/webaudio-tools',
        'webaudioplayer' : 'er-libs/webaudioplayer',
        'melody' : 'er-libs/melody',
        'note' : 'er-libs/note',
        'wavelet-pitch' : 'ext-libs/waveletPitch',
        'd3' : 'ext-libs/d3.min',
        'pitch-shift':'ext-libs/pitch-shift'
        //'countdown' : "ext-libs/countdown"
    },

    // Add modules that do not support AMD
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angulartics': {
            deps: ['angular']
        },
        'angulartics-ga': {
            deps: ['angular']
        },
        'fft-pitch': {
            deps: ['ext-libs/pitchjs/complex']
                // exports : 'PitchAnalyzer'
        },
        'jquery': {
            exports: '$'
        }
    },
    packages: [{
        name: 'er-shell',
        location: 'er-shell/scripts',
        main: 'main'
    }, {
        name: 'pitch-dial',
        location: 'er-apps/PitchDial',
        main: 'index'
    }, {
        name: 'sing-graph',
        location: 'er-apps/SingGraph',
        main: 'index'
    }]
});