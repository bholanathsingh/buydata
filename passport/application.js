var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
		function (req, username, password, done) {
		    // check in mongo if a user with username exists or not
		    User.getUser({ $or: [{ username: username }, { phonenumber: username }] },
				function (err, user) {
				    // In case of any error, return using the done method
				    if (err)
				        return done(err);
				    // Username does not exist, log the error and redirect back
				    if (!user) {
				        console.log('User Not Found with username ' + username);
				        return done(null, false);
				    }
				    // User exists but wrong password, log the error 
				    if (!user.validPassword(password)) {
				        console.log('Invalid Password');
				        return done(null, false); // redirect back to login page
				    }
				    // User and password both match, return user from done method
				    // which will be treated like success
				    return done(null, user);
				}
			);
		}
	));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
		function (req, username, password, done) {

		    User.getUser({ $or: [{ username: req.param('emailid') }, { phonenumber: req.param('phonenumber') }] }, function (err, user) {
		        // In case of any error, return using the done method
		        if (err) {
		            console.log('Error in SignUp: ' + err);
		            return done(err);
		        }
		        // already exists
		        if (user) {
		            console.log('User already exists with username / phone number : ' + username);
		            return done(null, false);
		        } else {
		            // if there is no user, create the user
		            var newUser = new User();

		            // set the user's local credentials
		            newUser.username = req.param('emailid');
		            newUser.password = newUser.generateHash(password);
		            newUser.email = req.param('emailid');
		            newUser.phonenumber = req.param('phonenumber');
		            newUser.displayName = username;
		            newUser.provider = 'epoket';
		            // save the user
		            User.addUser(newUser, function (err, newUser) {
		                if (err) {
		                    console.log('Error in Saving user: ' + err);
		                    throw err;
		                }
		                console.log(newUser.username + ' Registration succesful');
		                return done(null, newUser);
		            });
		        }
		    });
		})
	);
};
