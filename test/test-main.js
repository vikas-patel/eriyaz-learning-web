var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'note': 'client/public/src/er-libs/note',
    'melody': 'client/public/src/er-libs/melody',
    'webaudioplayer': 'client/public/src/er-libs/webaudioplayer',
    'midiplayer': 'client/public/src/er-libs/midiplayer',
    'midi-config': 'client/public/src/er-libs/midi-config',
    'order': 'client/public/src/ext-libs/requirejs-order.min',
    'currentaudiocontext': 'client/public/src/er-libs/currentaudiocontext',
    'underscore' : 'client/public/src/ext-libs/underscore'
  },
   packages: [{
        name: 'tanpura',
        location: 'client/public/src/er-libs/tanpura',
        main: 'tanpura'
    },
    {
        name: 'metronome',
        location: 'client/public/src/er-libs/metronome',
        main: 'metronome'
    }],
  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});