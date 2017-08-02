var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('../config/social');

module.exports = function (passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID: fbConfig.facebook.appID,
        clientSecret: fbConfig.facebook.appSecret,
        callbackURL: fbConfig.facebook.callbackUrl,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },

    // facebook will send back the tokens and profile
    function (access_token, refresh_token, profile, done) {
        process.nextTick(function () {
            // find the user in the database based on their facebook id
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
