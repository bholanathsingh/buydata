var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
    id: { type: Number },
    ProfileUrl:{type: String },
    ProfileTitle: { type: String },
    ProfileImage: { type: String },
    Category1: { type: String },
    Category2: { type: String },
    Category3: { type: String },
    Expertise: { type: String },
    ExpertiseBusinessKeywords: { type: [] },
    HoursDaysOfOperation: { type: Object },
    Address1: { type: String },
    Address2: { type: String },
    Location: { type: String },
    Country: { type: String },
    State: { type: String },
    City: { type: String },
    PinCode: { type: String },
    Landmark: { type: String },
    loc: { type: Object },
    AreaServed: { type: [] },
    Experience: { type: String },
    Accredation: { type: String },
    Speciality: { type: String },
    LanguageKnows: { type: [] },
    AverageRating: { type: Number },
    TotalReview: { type: Number },
    DoYouServeOnline: { type: Boolean },
    AdditionalInfo:{type:String},
    WorkAs: { type: [] },
    ContactPersonName: { type: String },
    ContactPersonDesignation: { type: String },
    MobileCountryCode: { type: String },
    PrimaryMobileNumber: { type: String },
    OtherMobile: { type: [] },
    Landline: { type: String },
    FaxNumber: { type: String },
    PrimaryEmail: { type: String },
    OtherEmail: { type: [] },
    WebsiteURL: { type: [] },
    SocialPages: { type: [] },
    ModesOfPayment: { type: [] },
    AboutYouDescription: { type: String },
    Gallery: { type: [] },
    RatingsReviews: { type: [] },
    PageViewCount: { type: Number },
    Qualification:{type: String},
    NumberOfClients: { type: Number },
    CreateBy: { type: String },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date, default: Date.now },
    IsActive: { type: Boolean, default: true }

});

var Profile = module.exports = mongoose.model('Profile', profileSchema);

module.exports.getProfiles = function (query,callback, limit) {
    Profile.find(query,callback).limit(limit);
}

module.exports.getFilteredProfiles = function (query, filter, callback, shortexp) {
    Profile.find(query, filter, callback).sort(shortexp);
}

module.exports.getProfile = function (query, callback) {
    Profile.findOne(query, callback);
}

module.exports.addProfile = function (profile, callback) {
    Profile.create(profile, callback);
}

module.exports.getProfileList = function (query, callback, shortexp, page, limit) {
    Profile.find(query, callback).sort(shortexp).skip(page * limit).limit(limit);
}

module.exports.getProfileCount = function (query, callback) {
    Profile.count(query, callback);
}

module.exports.updateProfile = function (query, update, option, callback) {
    Profile.findByIdAndUpdate(query, update, option, callback);
}

module.exports.removeProfile = function (id, callback) {
    var query = { _id: id };
    Profile.remove(query, callback);
}

module.exports.getProfileAutocomplete = function (query, fields, callback, shortexp, limit) {
    Profile.find(query, fields, callback).sort(shortexp).limit(limit);
}

module.exports.getProfileDetail = function (query, callback) {
    Profile.aggregate(query, callback);
}