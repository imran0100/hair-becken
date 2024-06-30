const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemId: { type: String},
    name: { type: String},
    quantity: { type: String},
    price: { type: Number },
    description: {
        type: String
    }
});

const cartSchema = new mongoose.Schema({
    cartId: { type: String },
    userId: { type: String },
    items: [itemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
