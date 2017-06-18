//var nodebb = require("./nodebb/userAPI")
var notifier = require("./email/notifier")
// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mongoose = require('mongoose');
var User  = require('./model/user.js');
var Payment = require('./model/payment.js');
//var User = mongoose.model('User', userSchema);

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false,'That email is already taken.');
            } else {
				// if there is no user with that email
                // create the user
                var newUser            = new User();
                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.gender = req.body.gender;
                newUser.name=req.body.name;
                newUser.phone = req.body.mobile
                newUser.isActive = true;
                Payment.find({
                    email: email
                }).sort({subscription_end_date:-1})
                .exec(function(err, payments) {
                    if (err) return done(err);
                    if (payments && payments.length > 0) {
                        payment = payments[0];
                        newUser.subscription_start_date = new Date();
                        newUser.subscription_end_date = payment.subscription_end_date;
                    }
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser, "Account created: <a href='/#/login'>Login</a>");
                    });
                });
				//creating NodeBB user
				// console.log("Creating user in NodeBB");
				// nodebb.createUser(newUser.name, password, email, function(err, uid){
				// 	if(!err)
				// 	{
				// 		newUser.nodebb.uid = uid;
				// 	}
				// });
				
				//Sending email to user
				console.log("Sending email to user");
				notifier.SendWelcomeEmail(email, newUser.name);
				
				//Sending email to user
				console.log("Sending email to admin");
				notifier.NewUserEmail(newUser);
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
    },
    function(email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, 'No user found.'); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false,'Oops! Wrong password.'); // create the loginMessage and save it to session as flashdata
			
            // if (!user.isActive)
            //     return done(null, false,'Waiting for admin approval.');
			
            if (user.userType != "admin" && !user.subscription_end_date) {
                var subscribeUrl = "/signup/payment.html?" + "name="+encodeURIComponent(user.name)+
                                "&email="+encodeURIComponent(user.local.email)+
                                "&phone="+encodeURIComponent(user.phone);
                return done(null, false,"no subscription: <a href=" + subscribeUrl+">Subscribe Here</a>");
            }

            if (user.userType != "admin" && user.subscription_end_date < new Date()) {
                var subscribeUrl = "/signup/payment.html?" + "name="+encodeURIComponent(user.name)+
                                "&email="+encodeURIComponent(user.local.email)+
                                "&phone="+encodeURIComponent(user.phone);
                return done(null, false,"subscription expired: <a href=" + subscribeUrl+">Subscribe Here</a>");
            }
            
			//if user is not created on NodeBB attempt to create one
			// if(!user.nodebb.uid){
			// 	console.log("Creating user in NodeBB");
			// 	nodebb.createUser(user.name, password, email, function(err, uid){
			// 		if(!err)
			// 		{
			// 			user.nodebb.uid = uid;
			// 			user.save();
			// 		}
			// 	});
			// }
			// else{
			// 	console.log("%s userid in NodeBB", user.nodebb.uid);
			// }
			
			console.log('%s logged in', user.local.email)
			// all is well, return successful user
			return done(null, user);

        });

    }));

};
