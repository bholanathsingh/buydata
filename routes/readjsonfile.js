var express = require('express');
var router = express.Router();


router.route('/headermenu')
.get(function (req, res) { 
    var jsfile = require('../public/files/headermenu.json');
    return res.json(jsfile);
});

router.route('/fulldirectory')
.get(function (req, res) {
    var jsfile = require('../public/files/fulldirectory.json');
    return res.json(jsfile);
});

router.route('/homecategory')
.get(function (req, res) {
    var jsfile = require('../public/files/homecategory.json');
    return res.json(jsfile);
});


module.exports = router;
