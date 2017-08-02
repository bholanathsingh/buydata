

var category = require('./category');
var profile = require('./profile');
var contactus = require('./contactus');
var enquiry = require('./enquiry');
var useraccount = require('./useraccount');
var readjsonfile = require('./readjsonfile');
var sitemap = require('./sitemap');
var fileprocess = require('./fileprocess');

module.exports = function (app) {

    app.use('/api/category', category);
    app.use('/api/contactus', contactus);
    app.use('/api/enquiry', enquiry);
    app.use('/api/profile', profile);
    app.use('/api/useraccount', useraccount);
    app.use('/api/readjsonfile', readjsonfile);
    app.use('/api/sitemap', sitemap);
    app.use('/api/fileprocess', fileprocess);
};
