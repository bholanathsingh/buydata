var express = require('express');
var router = express.Router();
var Category = require('../models/category');

router.route('/')
.get(function (req, res) {
    Category.getCategories(function (error, categories) {
        if (error)
            throw error;
        res.json(categories);
    });
})
.post(function (req, res) {
    Category.addCategory(req.body, function (error, category) {
        if (error)
            throw error;
        res.json(category);
    });
});

router.route('/querysearch')
.post(function (req, res) {
    Category.getCategoryList(req.body, function (error, categories) {
        if (error)
            throw error;
        res.json(categories);
    });
});

router.route('/autocomplete/:keyword')
.get(function (req, res) {
    Category.getCategoryAutocomplete({ "_id": { '$regex': '^' + req.params.keyword, '$options': 'i' } }, { '_id': 1 }, function (err, categories) {
        if (err)
            return res.send(err);
        return res.send(categories);
    }, { '_id': 1 }, 10);
});

router.route('/:id')
.get(function (req, res) {
    Category.getCategory({ "_id": { '$regex': '^' + req.params.id, '$options': 'i' } }, function (err, category) {
        if (err)
            return res.send(err);
        return res.send(category);
    });
})

router.route('/:page/:pagecount')
.get(function (req, res) {
    Category.getCategoryPagination(function (err, categories) {
        if (err)
            return res.send(err);
        return res.send(categories);
    }, { '_id': 1 }, parseInt(req.params.page, 10), parseInt(req.params.pagecount, 10));
});


module.exports = router;
