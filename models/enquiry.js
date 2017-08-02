var mongoose = require('mongoose');

var enquirySchema = new mongoose.Schema({
    ProfileId: { type: String },
    Industry: { type: String },
    Category: { type: String },
    SubCategory: { type: String },
    ContactPerson: { type: String },
    EmailId: { type: String },
    MobilenNmber: { type: String },
    Message: { type: String },
    Location: { type: String },
    CreateBy: { type: String },
    CreatedDate: { type: Date, default: Date.now },
    IsActive: { type: Boolean, default: true }
});

var Enquiry = module.exports = mongoose.model('Enquiry', enquirySchema);

module.exports.getEnquiries = function (callback, limit) {
    Enquiry.find(callback).limit(limit);
}

module.exports.getEnquiry = function (query, callback) {
    Enquiry.findOne(query, callback);
}

module.exports.addEnquiry = function (enquery, callback) {
    Enquiry.create(enquery, callback);
}

module.exports.updateEnquiry = function (query, updatequery, option, callback) {
    Enquiry.findByIdAndUpdate(query, updatequery, option, callback);
}


module.exports.getEnquiriesByUser = function (query,callback,shortexp,page,limit) {
    Enquiry.find(query,callback).sort(shortexp).skip(page * limit).limit(limit);
}

module.exports.removeEnquiry = function (query, callback) {
    Enquiry.remove(query, callback);
}