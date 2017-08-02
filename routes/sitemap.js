var express = require('express');
var router = express.Router();
var zlib = require('zlib');
var async = require('async');
var fs = require('fs');

var Category = require('../models/category');
var Profile = require('../models/profile');
var Region = require('../models/region');
var config = require('../config/config');

router.route('/sitemap.xml.gz')
.get(function (req, res) {
    var stack = {};
    stack.categoryList = function (callback) {
        Category.getCategories(function (error, categories) {
            if (error)
                throw error;
            callback(null, categories);
        });
    }

    stack.resionsList = function (callback) {
        Region.getRegions(function (error, resions) {
            if (error)
                throw error;
            callback(null, resions);
        });
    }

    async.parallel(stack, function (error, result) {
        if (error)
            res.send(error);

        var sitemap = generate_xml_sitemap(result.resionsList, result.categoryList);
        res.header('Content-Type: application/x-gzip');
        res.header('Content-Encoding: gzip');
        res.header('Content-Disposition: attachment; filename="sitemap.xml.gz"');
        zlib.gzip(new Buffer(sitemap, 'utf8'), function (error, data) {
            res.send(data);
        });
    });
});

router.route('/sitemap.xml')
.get(function (req, res) {

    var stack = {};
    stack.categoryList = function (callback) {
        Category.getCategories(function (error, categories) {
            if (error)
                throw error;
            callback(null, categories);
        });
    }

    stack.resionsList = function (callback) {
        Region.getRegions(function (error, resions) {
            if (error)
                throw error;
            callback(null, resions);
        });
    }

    async.parallel(stack, function (error, result) {
        if (error)
            res.send(error);

        if (result) {
            var xml = generate_xml_sitemap(result.resionsList, result.categoryList);
            res.header('Content-Type', 'text/xml');
            //   console.log(xml);
            res.send(xml);
        }
    })
});


router.route('/createsitemap')
.get(function (req, res) {

    var stack = {};
    stack.categoryList = function (callback) {
        Category.getCategories(function (error, categories) {
            if (error)
                throw error;
            callback(null, categories);
        });
    }

    stack.resionsList = function (callback) {
        Region.getRegions(function (error, resions) {
            if (error)
                throw error;
            callback(null, resions);
        });
    }

    async.parallel(stack, function (error, result) {
        if (error)
            res.send(error);

        if (result) {
            var xml = create_xmlgz_sitemap(result.resionsList, result.categoryList, '/bhola');
            res.send(xml);
        }
    })
});


router.route('/profilesitemap')
    .get(function (req, res) {

        var stack = {};


        stack.profileList = function (callback) {
            Profile.getFilteredProfiles({},{ 'ProfileTitle': 1,'_id': -1},function (error, profiles) {
                if (error)
                    throw error;
                callback(null, profiles);
            });
        }

        async.parallel(stack, function (error, result) {
            if (error)
                res.send(error);

            if (result) {

                var xml = profile_xmlgz_sitemap(result.profileList, '/profile');
                res.send(xml);
            }
        })
    });

router.route('/sitemaplist')
.get(function (req, res) {
    var filelist = getFiles(config.sitemappath)
    res.json(filelist);
});



function generate_xml_sitemap(regions, categories) {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var xml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // XML sitemap generation starts here
    var priority = 0.5;
    var someDate = new Date();
    var freq = 'monthly';
    for (var i in categories) {
        for (var r in regions) {
            xml += '<sitemap>';
            xml += '<loc>' + config.rootpath + regions[r].Name.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '/' + categories[i]._id.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>';
            xml += '<changefreq>' + freq + '</changefreq>';
            xml += '<priority>' + priority + '</priority>';
            xml += '<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>';
            xml += '</sitemap>';
        };
    };
    xml += '</sitemapindex>';
    return xml;
}


function create_gz_sitemap(regions, categories) {

    var stream = fs.createWriteStream('public/sitemap/1.xml.gz');
    var compress = zlib.createGzip();

    compress.pipe(stream);
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    compress.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    // XML sitemap generation starts here
    var priority = 0.5;
    var someDate = new Date();
    var freq = 'monthly';
    for (var i in categories) {
        for (var r in regions) {
            compress.write('<sitemap>');
            compress.write('<loc>' + config.rootpath + regions[r].Name.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '/' + categories[i]._id.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>');
            compress.write('<changefreq>' + freq + '</changefreq>');
            compress.write('<priority>' + priority + '</priority>');
            compress.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>');
            compress.write('</sitemap>');
        };
    };
    compress.end('</sitemapindex>');
    return 'Sucess';
}


function create_xml_sitemap(regions, categories) {

    var stream = fs.createWriteStream('public/sitemap/1.xml');

    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    stream.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

    // XML sitemap generation starts here
    var priority = 0.5;
    var someDate = new Date();
    var freq = 'monthly';
    for (var i in categories) {
        for (var r in regions) {
            stream.write('<sitemap>\n');
            stream.write('<loc>' + config.rootpath + regions[r].Name.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '/' + categories[i]._id.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>\n');
            stream.write('<changefreq>' + freq + '</changefreq>\n');
            stream.write('<priority>' + priority + '</priority>\n');
            stream.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>\n');
            stream.write('</sitemap>\n');
        };
    };
    stream.end('</sitemapindex>');
    return 'Sucess';
}



function create_xmlgz_sitemap(regions, categories, filename) {

    var stream = fs.createWriteStream(config.sitemappath + filename + '.xml');
    var gzstream = fs.createWriteStream(config.sitemappath + filename + '.xml.gz');
    var compress = zlib.createGzip();

    compress.pipe(gzstream);
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    compress.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    stream.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

    // XML sitemap generation starts here
    var priority = 0.5;
    var someDate = new Date();
    var freq = 'monthly';
    for (var i in categories) {
        for (var r in regions) {

            compress.write('<sitemap>');
            compress.write('<loc>' + config.rootpath + regions[r].Name.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '/' + categories[i]._id.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>');
            compress.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>');
            compress.write('</sitemap>');

            stream.write('<sitemap>\n');
            stream.write('<loc>' + config.rootpath + regions[r].Name.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '/' + categories[i]._id.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>\n');
            stream.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>\n');
            stream.write('</sitemap>\n');

        };
    };
    compress.end('</sitemapindex>');
    stream.end('</sitemapindex>');
    return 'Sucess';
}


function profile_xmlgz_sitemap(profiles, filename) {

    var stream = fs.createWriteStream(config.sitemappath + filename + '.xml');
    var gzstream = fs.createWriteStream(config.sitemappath + filename + '.xml.gz');
    var compress = zlib.createGzip();

    compress.pipe(gzstream);
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    compress.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    stream.write('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');


    // XML sitemap generation starts here
    var priority = 0.5;
    var someDate = new Date();
    var freq = 'monthly';

        for (var r in profiles) {

            if(profiles[r].ProfileTitle!=undefined) {
                compress.write('<url>');
                compress.write('<loc>' + config.rootpath + profiles[r].ProfileTitle.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>');
                compress.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>');
                compress.write('</url>');

                stream.write('<url>\n');
                stream.write('<loc>' + config.rootpath + profiles[r].ProfileTitle.replace(/&/g, '').replace(/  /g, ' ').replace(/ /g, '-') + '</loc>\n');
                stream.write('<lastmod>' + someDate.getFullYear() + '-' + someDate.getMonth() + '-' + someDate.getDate() + '</lastmod>\n');
                stream.write('</url>\n');
            }

        };

    compress.end('</urlset>');
    stream.end('</urlset>');
    return 'Sucess';
}




function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


module.exports = router;