// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    waitSeconds: 60,
    baseUrl: '/',
    paths: {
        'polymer-wecomponents': 'ext-libs/bower_components/webcomponentsjs/webcomponents.min',
        'domReady': 'ext-libs/bower_components/requirejs-domready/domReady',
        'angular': 'ext-libs/bower_components/angular/angular',
        'angular-ui-router': 'ext-libs/bower_components/angular-ui-router/release/angular-ui-router.min',
        'angulartics': 'ext-libs/bower_components/angulartics/dist/angulartics.min',
        'angulartics-ga': 'ext-libs/bower_components/angulartics/dist/angulartics-ga.min',
        'angular-resource': 'ext-libs/bower_components/angular-resource/angular-resource',
        'underscore': 'ext-libs/underscore-min',
        'order': 'ext-libs/requirejs-order.min',
        'ng-infinite-scroll': 'ext-libs/ng-infinite-scroll',
        'hot-keys': 'ext-libs/bower_components/angular-hotkeys/build/hotkeys',
        'hopscotch': 'ext-libs/bower_components/hopscotch/dist/js/hopscotch.min',


        'music-calc' : 'er-libs/music-calc',
        'mic-util': 'er-libs/mic-util',
        'pitchdetector': 'er-libs/pitchdetector',
        'pitchcustomdetector': 'er-libs/pitchcustomdetector',
        'intensityfilter': 'er-libs/intensityfilter',
        'stabilitydetector': 'er-libs/stabilitydetector',
        'currentaudiocontext': 'er-libs/currentaudiocontext',
        'audiobuffer': 'er-libs/audiobuffer',
        'fft-pitch': 'ext-libs/pitchjs/pitch',
        'jquery': 'ext-libs/jquery/jquery',
        'webaudio-tools': 'ext-libs/webaudio/webaudio-tools',
        'webaudioplayer': 'er-libs/webaudioplayer',
        'bufferloader': 'er-libs/bufferloader',
        'voiceplayer': 'er-libs/voiceplayer',
        'chart': 'er-libs/chart',
        'melody': 'er-libs/melody',
        'note': 'er-libs/note',
        'wavelet-pitch': 'ext-libs/waveletPitch',
        'yin-pitch': 'ext-libs/pitchfinder/src/detectors/yin',
        'd3': 'ext-libs/d3',
        'pitch-shift': 'ext-libs/pitch-shift',
        'ng-polymer-elements':'ext-libs/bower_components/ng-polymer-elements/ng-polymer-elements.min',
        'st-core' : 'ext-libs/soundtouch/core',
        'st-pipe' : 'ext-libs/soundtouch/pipe',
        'st-rate-transposer' : 'ext-libs/soundtouch/rate-transposer',
        'st-buffer' : 'ext-libs/soundtouch/buffer',
        'st-filter' : 'ext-libs/soundtouch/filter',
        'st-stretch' : 'ext-libs/soundtouch/stretch',
        'soundtouch' : 'ext-libs/soundtouch/soundtouch.min',
        'phasevocoder' : 'ext-libs/PhaseVocoderJS/PV_fast',
        'timeMe' : 'ext-libs/TimeMe/TImeMe',
        'ng-table' : "ext-libs/bower_components/ng-table/dist/ng-table.min",
        'recorderworker' : 'er-libs/recorderworker',
        'phaser': 'ext-libs/bower_components/phaser/build/phaser.min',
        // 'tone': 'ext-libs/tone.min', // version 0.12.0
        'lyrics' : 'ext-libs/lyrics.min',
        'socketio-client' : 'ext-libs/socket.io-client'
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
        'phaser': {
            exports: 'Phaser'
        },
        // 'tone': {
        //     exports: 'Tone'
        // },
        'soundtouch' : {
            deps: ['underscore']
        },
        'phasevocoder' : {
            deps: ['ext-libs/PhaseVocoderJS/jensnockert-fft.js/lib/complex.js', 'ext-libs/PhaseVocoderJS/jensnockert-fft.js/lib/real.js']
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
    },{
        name: 'pitch-dial2',
        location: 'er-apps/PitchDial2',
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
        name: 'sargamtuner',
        location: 'er-apps/SargamTuner',
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
        location: 'er-apps/VoiceRange',
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
        name: 'fasternotes',
        location: 'er-apps/FasterNotes',
        main: 'index'
    }, {    
        name: 'fasternotes2',
        location: 'er-apps/FasterNotes2',
        main: 'index'
    }, {    
        name: 'rapidupdown',
        location: 'er-apps/RapidUpDown',
        main: 'index'
    }, {    
        name: 'extractnotes',
        location: 'er-apps/ExtractNotes',
        main: 'index'
    }, {
        name: 'singsargam',
        location: 'er-apps/SingSargam',
        main: 'index'
    }, {
        name: 'songpractice',
        location: 'er-apps/SongPractice',
        main: 'index'
    }, {
        name: 'countnotes',
        location: 'er-apps/CountNotes',
        main: 'index'
    }, {
        name: 'tonesmemory',
        location: 'er-apps/TonesMemory',
        main: 'index'
    }, {
        name: 'poorvanga',
        location: 'er-apps/Poorvanga',
        main: 'index'
    }, {
        name: 'flappybird',
        location: 'er-apps/FlappyBird',
        main: 'index'
    },{
        name: 'monsterblaster',
        location: 'er-apps/MonsterBlaster',
        main: 'index'
    },
    // {
    //     name: 'fruitninja',
    //     location: 'er-apps/FruitNinja',
    //     main: 'index'
    // }, 
    {
        name: 'phraseshape',
        location: 'er-apps/PhraseShape',
        main: 'index'
    }, {
        name: 'singinggame',
        location: 'er-apps/SingingGame',
        main: 'index'
    }, {
        name: 'singinggame2',
        location: 'er-apps/SingingGame2',
        main: 'index'
    }, {
        name: 'voicematch2',
        location: 'er-apps/VoiceMatch2',
        main: 'index'
    }, {
        name: 'fastsinging',
        location: 'er-apps/FastSinging',
        main: 'index'
    }, {
        name: 'singphrases',
        location: 'er-apps/SingPhrases',
        main: 'index'
    }, {
        name: 'uttaranga',
        location: 'er-apps/Uttaranga',
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