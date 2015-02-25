// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: '../../lib',
    paths: {
        app: '../eartonic-apps/PitchDial',
        'mic' : '../eartonic-libs/mic',
        'audiobuffer' : '../eartonic-libs/audiobuffer'
    }, 

    // Add modules that do not support AMD
    shim: {
    	'pitchjs/pitch' : {
    		deps : ['pitchjs/complex']
    		// exports : 'PitchAnalyzer'
    	},
    	'jquery/jquery' : {
    		exports : '$'
    	}
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/app']);

