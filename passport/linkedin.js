var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/user');
var lkdConfig = require('../config/social');

module.exports = function (passport) {

    passport.use(new LinkedInStrategy({
        clientID: lkdConfig.linkedin.clientID,
        clientSecret: lkdConfig.linkedin.clientSecret,
        callbackURL: lkdConfig.linkedin.callbackURL,
        scope: ['r_emailaddress', 'r_basicprofile']
    },
    function (accessToken, refreshToken, profile, done) {

        console.log('profile', profile);
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function () {

            User.getUser({ 'providerId': profile.id }, function (err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    newUser.displayName = profile.displayName;
                    newUser.providerId = profile.id;
                    newUser.provider = profile.provider;
                    newUser.gender = profile.gender;
                    newUser.photo = profile.photos[0].value;
                    if (profile.emails != undefined) {
                        newUser.email = profile.emails[0].value;
                        newUser.username = profile.emails[0].value;
                    }
                    else
                        newUser.username = profile.id;

                    User.addUser(newUser, function (err, newUser) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });

        });

    }));

};
