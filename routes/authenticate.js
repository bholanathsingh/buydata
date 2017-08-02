var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    //sends successful login state back to angular
    router.get('/success', function (req, res) {
        res.send({ state: 'success', user: req.user ? req.user : null });
    });

    //sends failure login state back to angular
    router.get('/failure', function (req, res) {
        res.send({ state: 'failure', user: null, message: "Invalid username or password" });
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // different scopes while logging in
    router.get('/login/facebook',
		passport.authenticate('facebook', { scope: 'email' }
	));

    // handle the callback after facebook has authenticated the user
    router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
		    successRedirect: '/dashboard',
		    failureRedirect: '/login'
		})
	);

    // route for google authentication and login
    router.get('/login/google',
      passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' }));

    // handle the callback after facebook has authenticated the user
    router.get('/login/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/dashboard');
        });

    // linkedin 
    router.get('/login/linkedin',
          passport.authenticate('linkedin', { state: 'SOME STATE' }));

    router.get('/login/linkedin/callback', passport.authenticate('linkedin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    }));

    // chek user is already loged in
    router.get('/islogin', function (req, res) {
        if (req.isAuthenticated())
            return res.send(200, req.user);
        else
            return res.send(200, null);
    });

    return router;

}