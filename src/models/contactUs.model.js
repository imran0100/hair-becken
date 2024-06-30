const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String
    },

    message: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
