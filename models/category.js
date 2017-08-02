var mongoose = require('mongoose');


var categorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    ancestors: { type: [] },
    parent: { type: String },
    created_date: { type: Date, default: Date.now }
});

var Category = module.exports = mongoose.model('Category', categorySchema);

module.exports.getCategories = function (callback, limit) {
    Category.find(callback).limit(limit);
}

module.exports.getCategoryList = function (query, callback, limit) {
    Category.find(query, callback).limit(limit);
}

module.exports.getCategory = function (query,callback) {
    Category.findOne(query, callback);
}

module.exports.addCategory = function (category, callback) {
    Category.create(category, callback);
}

module.exports.updateCategory = function (id, category, option, callback) {
    var query = { _id: id };
    var update = { name: category.name };
    Category.findByIdAndUpdate(query, update, option, callback);
}

module.exports.removeCategory = function (query, callback) {
    Category.remove(query, callback);
}

module.exports.getCategoryPagination = function (callback, shortexp, page, limit) {
    Category.find(callback).sort(shortexp).skip(page * limit).limit(limit);
}

module.exports.getCategoryAutocomplete = function (query, fields, callback, shortexp, limit) {
    Category.find(query, fields, callback).sort(shortexp).limit(limit);
}