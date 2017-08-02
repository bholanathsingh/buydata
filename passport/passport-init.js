

var User = require('../models/user');
var application = require('./application');
var facebook = require('./facebook');
var linkedin = require('./linkedin');
var google = require('./google');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.getUser({ '_id': id }, function (err, user) {
            console.log('deserializing user:', user.username);
            done(err, user);
        });
    });

    application(passport);
    facebook(passport);
    google(passport);
    linkedin(passport);
};
