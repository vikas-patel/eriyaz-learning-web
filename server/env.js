var env = require('./env.json');

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  var config = env[node_env];
  config.env = node_env;
  return config;
};