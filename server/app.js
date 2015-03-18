var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var path = require('path');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');

var config = require('./env').config();

var compression = require('compression');

// var basicAuth = require('basic-auth-connect');
// app.use(basicAuth('username', 'password'));
// app.use(basicAuth(function(user, pass) {
//  return user === 'testUser' && pass === 'testPass';
// }));
// app.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                     failureRedirect: '/login' }));

mongoose.connect(config.dburl); // connect to our database

require('./passport-setup')(passport); // pass passport for configuration


//cofigure express applicatoin
// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); // get information from html forms
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(compression());

require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

var server = app.listen(port, function() {
	console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
});