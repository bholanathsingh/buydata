var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    displayName: String,
    providerId: String,
    provider: String,
    gender: String,
    photo: String,
    email: String,
    phonenumber: String,
    providerData: {},
    created_at: { type: Date, default: Date.now }
});


userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUsers = function (callback, limit) {
    User.find(callback).limit(limit);
}

module.exports.getUser = function (query, callback) {
    console.log(query);
    User.findOne(query, callback);
}

module.exports.addUser = function (user, callback) {
    User.create(user, callback);
}

module.exports.updateUser = function (query, updatequery, option, callback) {
    User.findByIdAndUpdate(query, updatequery, option, callback);
}

module.exports.removeUser = function (query, callback) {
    User.remove(query, callback);
}