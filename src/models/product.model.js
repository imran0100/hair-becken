const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: {
        type: String,
        required: true
    }
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    products: [productSchema]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
