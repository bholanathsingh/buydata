var express = require('express');
var router = express.Router();

var User = require('../models/user');

var bCrypt = require('bcrypt-nodejs');
var Mail = require('./mailsystem');

router.route('/forgotpassword')
    .post(function (req, res) {
        console.log(req.body);
        User.getUser(req.body, function (err, user) {
            //console.log('debug2');
            if (err) {
                return res.send(err);
            }
            if (user) {

                var password = 'anujkumarsingh';//stringGen(10);

                user.password = user.generateHash(password);;

                var mailOptions = {
                    from: 'bholanathsingh@mail.com',
                    to: user.emailid,
                    subject: 'Password Change ',
                    text: 'Your New password is ' + password
                };

                user.save(function (err) {
                    if (err) throw err;
                    Mail.SendMail(mailOptions, function (error) {
                        if (err) throw err;
                        return res.send(true);
                    });
                });
            }
            else
                return res.send(false);
        });

    });

router.route('/userdetail')
    .post(function (req, res) {
        User.getUser(req.body, function (err, user) {
            if (err)
                return res.send(err);

            return res.send(user);
        })
    });

function stringGen(len) {
    var text = " ";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = router;