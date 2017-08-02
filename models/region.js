var mongoose = require('mongoose');

var regionSchema = new mongoose.Schema({
    Code: { type: String },
    Name: { type: String }
});

var Region = module.exports = mongoose.model('Region', regionSchema);

module.exports.getRegions = function (callback, limit) {
    Region.find(callback).limit(limit);
}

module.exports.getRegion = function (query, callback) {
    Region.findOne(query, callback);
}

module.exports.addLocation = function (region, callback) {
    Region.create(region, callback);
}

module.exports.updateRegion = function (query, updatequery, option, callback) {
    Region.findByIdAndUpdate(query, updatequery, option, callback);
}

module.exports.removeRegion = function (query, callback) {
    Region.remove(query, callback);
}