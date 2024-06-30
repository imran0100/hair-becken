const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },

    amount: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    fullname: {
        type: String
    },
    Address: {
        type: String
    },
    Appartment: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    pinCode: {
        type: Number,
        default: null
    },



    plainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    isDeleted: {
        type: Boolean,
        default: false

    },
    products: {
        type: Array
    },
    currency: {
        type: String,

    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderType: {
        type: String,
        enum: ["Appointment", "product Buy"],
        required: true

    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
