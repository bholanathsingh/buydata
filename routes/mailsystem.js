/// <reference path="common/config.js" />
var nodemailer = require('nodemailer');
var config = require('../config/config');


var smtpTransport = nodemailer.createTransport({
    service: config.service,
    auth: config.auth
});

module.exports.SendMail = function (mailOptions, callback) {
    smtpTransport.sendMail(mailOptions, callback);
}