var mongoose = require('mongoose');

var contectusSchema = new mongoose.Schema({
    reason: { type: String },
    name: { type: String },
    emailid: { type: String },
    phonenumber: { type: String },
    message: { type: String },
    created_at: { type: Date, default: Date.now }
});

var ContactUs = module.exports = mongoose.model('ContactUs', contectusSchema);

module.exports.getContactUses = function (callback, limit) {
    ContactUs.find(callback).limit(limit);
}

module.exports.getContactUs = function (query, callback) {
    ContactUs.findOne(query, callback);
}

module.exports.addContactUs = function (ccontactus, callback) {
    ContactUs.create(ccontactus, callback);
}

module.exports.updateContactUs = function (id, genre, option, callback) {
    var query = { _id: id };
    var update = { name: genre.name };
    ContactUs.findByIdAndUpdate(query, update, option, callback);
}

module.exports.removeContactUs = function (id, callback) {
    var query = { _id: id };
    ContactUs.remove(query, callback);
}