var express = require('express');
var router = express.Router();
var Profile = require('../models/profile');

var async = require('async');
var fs = require('fs');
var request = require('request');


router.route('/download')
    .get(function (req, res) {

        async.waterfall([
                function (callback) {
                    Profile.getProfileList({ ProfileImage: { '$regex': 'http.*', '$options': 'i' } }, function (err, profiles) {
                        callback(null, profiles);
                    }, { "id": 1 }, 0, 2000);
                }],
            function (error, profiles) {
                if (error)
                    res.send(error);

                if(profiles)
                {
                   try {
                       profiles.forEach( function(profile) {
                            var filename =  profile.ProfileImage.split('/').pop();
                            var extention=filename.split('.').pop();
                            var newfile=profile.ProfileUrl+'.'+extention;
                            download(profile.ProfileImage,'public/profileimages/'+newfile , function(err){
                                Profile.updateProfile({ _id: profile._id },{ProfileImage:newfile},{new: false}, function (err, profiles) {
                                });
                            });
                        });
                       }
                       catch (e)
                       {
                       }
                }
                res.json(true);
            })
    });



function download (url, dest, callback){
     request.get(url)
        .on('error', function(err) {console.log(err)} )
        .pipe(fs.createWriteStream(dest))
        .on('close', callback);
};


module.exports = router;