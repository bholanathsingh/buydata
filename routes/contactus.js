var express = require('express');
var router = express.Router();

var ContactUs = require('../models/contectus');
var User = require('../models/user');
var Mail = require('./mailsystem');

router.route('/')
.get(function (req, res) {
    ContactUs.getContactUses(function (err, contactus) {
        if (err)
            return res.send(err);
        return res.send(contactus);
    });
})
.post(function (req, res) {
    ContactUs.addContactUs(req.body.contact, function (err, ccontactus) {
        if (err)
            res.json(false);
        else {
            Mail.SendMail(req.body.mailOptions, function (error) { console.log('Mail Sent !'); });
            res.send({ message: 'thanks for contact us' });
        }
    });
});

router.route('/:id')
.get(function (req, res) {
    ContactUs.getContactUs({ '_id': req.params.id }, function (err, contactus) {
        if (err)
            return res.send(err);
        return res.send(contactus);
    });
});



router.route('/claimit')
.post(function (req, res) {
    User.addUser(req.body, function (error, user) {
        if (error)
            console.log('Error ' + error);
        var mailOptions = { from: 'bholanathsingh@mail.com', to: user.emailid, subject: 'This is testt mail', text: 'Hi this is test from bhola nath singh' };;
        Mail.SendMail(mailOptions, function (error) { console.log('Mail Sent !'); });
        return res.send(user);
    });
});




module.exports = router;