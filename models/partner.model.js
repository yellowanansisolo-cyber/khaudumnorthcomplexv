const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Partner name is required.'],
        trim: true
    },
    logo: {
        type: String,
        required: [true, 'Partner logo is required.']
    },
    websiteUrl: {
        type: String,
        trim: true
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);