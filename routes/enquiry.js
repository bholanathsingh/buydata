var express = require('express');
var router = express.Router();

var Enquery = require('../models/enquiry');

router.route('/')
.get(function (req, res) {
    Enquery.getEnquiries(function (err, enqueries) {
        if (err)
            return res.send(err);
        return res.send(enqueries);
    });
})
.post(function (req, res) {
    Enquery.addEnquiry(req.body, function (err, enquery) {
        if (err)
            res.json(false);
        return res.send(enquery);
    });
});

router.route('/:id')
    .get(function (req, res) {
        Enquery.getEnquiry({ '_id': req.params.id }, function (err, enquery) {
            if (err)
                return res.send(err);
            return res.send(enquery);
        });
    });

router.route('/userenquery')
    .post(function (req, res) {

        Enquery.getEnquiriesByUser({ EmailId: { '$regex': '.*' + req.body.emailid + '.*', '$options': 'i' } }, function (err, enqueries) {
            if (err)
                return res.send(err);
            return res.send(enqueries);
        }, { "CreatedDate": -1 }, req.body.page, req.body.limit);
    });

module.exports = router;