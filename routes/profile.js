var express = require('express');
var router = express.Router();
var Profile = require('../models/profile');

router.route('/')
.get(function (req, res) {
    Profile.getProfiles({}, function (err, profiles) {
        if (err)
            return res.send(err);
        return res.send(profiles);
    });
})

.post(function (req, res) {
    Profile.addProfile(profile, function (err, profile) {
        if (err)
            return res.send(err);
        return res.send(profile);
    });
});

router.route('/search')
.post(function (req, res) {
    Profile.getProfileList({ ExpertiseBusinessKeywords: { '$regex': '.*' + req.body.keywords + '.*', '$options': 'i' }, loc: { $geoWithin: { $centerSphere: req.body.centersphere } } }, function (err, profiles) {
        if (err)
            return res.send({});
        return res.send(profiles);
    }, { "id": 1 }, req.body.page, req.body.limit);
});

router.route('/Profileslist')
    .post(function (req, res) {
        Profile.getProfileList(req.body.query, function (err, profiles) {
            if (err)
                return res.send({});
            return res.send(profiles);
        }, { "id": 1 }, req.body.page, req.body.limit);
    });

router.route('/googlepoints')
.post(function (req, res) {
    Profile.getFilteredProfiles({ ExpertiseBusinessKeywords: { '$regex': '.*' + req.body.keywords + '.*', '$options': 'i' }, loc: { $geoWithin: { $centerSphere: req.body.centersphere } } }, { 'loc.coordinates': 1, 'ProfileTitle': 1, 'Address1': 1, 'Address2': 1, 'Landmark': 1, 'ProfileImage': 1, '_id': -1, 'id': 1 }, function (err, profiles) {
        if (err)
            return res.send(err);
        return res.send(profiles);
    }, { "id": 1 });
});

router.route('/count')
.post(function (req, res) {
    Profile.getProfileCount({ ExpertiseBusinessKeywords: { '$regex': '.*' + req.body.keywords + '.*', '$options': 'i' }, loc: { $geoWithin: { $centerSphere: req.body.centersphere } } }, function (err, count) {
        if (err)
            return res.send({});
        return res.send({ count: count });
    });
});

router.route('/totalcount')
  .post(function (req, res) {
        Profile.getProfileCount(req.body, function (err, count) {
            if (err)
                return res.send({});
            return res.send({ count: count });
        });
  });

router.route('/profilecountindustrytype')
.post(function (req, res) {
    Profile.getFilteredProfiles({ IndustryType: { '$regex': '^' + req.body.industrytype, '$options': 'i' } }, function (err, count) {
        return res.send({ count: count });
    });
});

router.route('/profilecountcategory')
.post(function (req, res) {
    Profile.getFilteredProfiles({ IndustryType: { '$regex': '^' + req.body.industrytype, '$options': 'i' }, Category: { '$regex': '^' + req.body.category, '$options': 'i' } }, function (err, count) {
        return res.send({ count: count });
    });

});

router.route('/profilecountsubcategory')
.post(function (req, res) {
    Profile.getFilteredProfiles({ IndustryType: { '$regex': '^' + req.body.industrytype, '$options': 'i' }, Category: { '$regex': '^' + req.body.category, '$options': 'i' }, SubCategory: { '$regex': '^' + req.body.subcategory, '$options': 'i' } }, function (err, count) {
        return res.send({ count: count });
    });
});

router.route('/:id')
.get(function (req, res) {

    Profile.getProfile({ "ProfileUrl": { '$regex': '^' + req.params.id, '$options': 'i' } }, function (err, profile) {
        if (err)
            return res.send({});
        return res.send(profile);
    });

});

router.route('/autocomplete/:keyword')
    .get(function (req, res) {
        Profile.getProfileAutocomplete({ "ProfileTitle": { '$regex': '^' + req.params.keyword, '$options': 'i' } }, { '_id': -1,'ProfileTitle':1 }, function (err, profiles) {
            if (err)
                return res.send(err);
            return res.send(profiles);
        }, { 'id': 1 }, 10);
    });

module.exports = router;