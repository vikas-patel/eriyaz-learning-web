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
        'angulartics': 'ext-libs/bower_components/angulartics/dist/angulartics.min',
        'angulartics-ga': 'ext-libs/bower_components/angulartics/dist/angulartics-ga.min',
        'angular-resource': 'ext-libs/bower_components/angular-resource/angular-resource',
        'underscore': 'ext-libs/underscore',
        'order': 'ext-libs/requirejs-order.min',
        'ng-infinite-scroll': 'ext-libs/ng-infinite-scroll',
        'hot-keys': 'ext-libs/bower_components/angular-hotkeys/build/hotkeys',

        'music-calc' : 'er-libs/music-calc',
        'mic-util': 'er-libs/mic-util',
        'pitchdetector': 'er-libs/pitchdetector',
        'intensityfilter': 'er-libs/intensityfilter',
        'stabilitydetector': 'er-libs/stabilitydetector',
        'currentaudiocontext': 'er-libs/currentaudiocontext',
        'audiobuffer': 'er-libs/audiobuffer',
        'fft-pitch': 'ext-libs/pitchjs/pitch',
        'jquery': 'ext-libs/jquery/jquery',
        'webaudio-tools': 'ext-libs/webaudio/webaudio-tools',
        'webaudioplayer': 'er-libs/webaudioplayer',
        'chart': 'er-libs/chart',
        'melody': 'er-libs/melody',
        'note': 'er-libs/note',
        'wavelet-pitch': 'ext-libs/waveletPitch',
        'd3': 'ext-libs/d3',
        'pitch-shift': 'ext-libs/pitch-shift',
        'ng-polymer-elements':'ext-libs/bower_components/ng-polymer-elements/ng-polymer-elements.min',
        'st-core' : 'ext-libs/soundtouch/core',
        'st-pipe' : 'ext-libs/soundtouch/pipe',
        'st-rate-transposer' : 'ext-libs/soundtouch/rate-transposer',
        'st-buffer' : 'ext-libs/soundtouch/buffer',
        'st-filter' : 'ext-libs/soundtouch/filter',
        'st-stretch' : 'ext-libs/soundtouch/stretch',
        'soundtouch' : 'ext-libs/soundtouch/soundtouch',
        'timeMe' : 'ext-libs/TimeMe/TImeMe',
        'ng-table' : "ext-libs/bower_components/ng-table/dist/ng-table.min"
    },

    // Add modules that do not support AMD
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'ng-polymer-elements' : {
            deps:['angular']
        },
        'angulartics': {
            deps: ['angular']
        },
        'angulartics-ga': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'hot-keys': {
            deps: ['angular']
        },
        'underscore': {
            exports: '_'
        },
        'ng-infinite-scroll': {
            deps: ['angular', 'jquery']
        },
        'fft-pitch': {
            deps: ['ext-libs/pitchjs/complex']
                // exports : 'PitchAnalyzer'
        },
        'jquery': {
            exports: '$'
        },

        //sountouch load order
        'soundtouch' : {
            deps: ['underscore','st-core','st-pipe','st-rate-transposer','st-buffer','st-filter','st-stretch']
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
        name: 'sing-alankars',
        location: 'er-apps/SingAlankars',
        main: 'index'
    }, {
        name: 'upordown',
        location: 'er-apps/UpOrDown',
        main: 'index'
    }, {    
        name: 'melodygraph',
        location: 'er-apps/MelodyGraph',
        main: 'index'
    }, {    
        name: 'swarspace',
        location: 'er-apps/SwarSpace',
        main: 'index'
    }, {    
        name: 'swarposition',
        location: 'er-apps/SwarPosition',
        main: 'index'
    }, {    
        name: 'sargammemorizer',
        location: 'er-apps/SargamMemorizer',
        main: 'index'
    }, {    
        name: 'thatmemorizer',
        location: 'er-apps/ThatMemorizer',
        main: 'index'
    }, {    
        name: 'singgraph',
        location: 'er-apps/SingGraph',
        main: 'index'
    }, {    
        name: 'voicematch',
        location: 'er-apps/VoiceMatch',
        main: 'index'
    }, {
        name: 'voicerange',
        location: 'er-apps/Voicerange',
        main: 'index'
    }, {    
        name: 'freestylephrases',
        location: 'er-apps/FreestylePhrases',
        main: 'index'
    }, {    
        name: 'swarmastery',
        location: 'er-apps/SwarMastery',
        main: 'index'
    }, {    
        name: 'melodygraph2',
        location: 'er-apps/MelodyGraph2',
        main: 'index'
    }, {    
        name: 'timetrainer',
        location: 'er-apps/TimeTrainer',
        main: 'index'
    }, {    
        name: 'swarsense',
        location: 'er-apps/SwarSense',
        main: 'index'
    }, {    
        name: 'rapidintervals',
        location: 'er-apps/RapidIntervals',
        main: 'index'
    }, {    
        name: 'melakarta',
        location: 'er-apps/Melakarta',
        main: 'index'
    }, {    
        name: 'melakarta2',
        location: 'er-apps/Melakarta2',
        main: 'index'
    }, {
        name: 'tanpura',
        location: 'er-libs/tanpura',
        main: 'tanpura'
    }, {
        name: 'metronome',
        location: 'er-libs/metronome',
        main: 'metronome'
    }]
});